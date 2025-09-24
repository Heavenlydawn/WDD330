import ProductData from './ProductData.mjs';

export default class ProductSearch {
  constructor() {
    this.productData = new ProductData('tents');
    this.allProducts = [];
    this.filteredProducts = [];
    this.searchInput = document.getElementById('searchInput');
    this.searchButton = document.getElementById('searchButton');
    this.productList = document.querySelector('.product-list');
    this.productsSection = document.querySelector('.products h2');

    this.init();
  }

  async init() {
    // Load all products
    await this.loadProducts();

    // Set up event listeners
    this.setupEventListeners();
  }

  async loadProducts() {
    try {
      this.allProducts = await this.productData.getData();
      this.filteredProducts = [...this.allProducts];
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  setupEventListeners() {
    // Search button click
    this.searchButton.addEventListener('click', () => {
      this.performSearch();
    });

    // Enter key in search input
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    // Real-time search as user types
    this.searchInput.addEventListener('input', (e) => {
      this.debounce(() => {
        this.performSearch();
      }, 300)();
    });
  }

  performSearch() {
    const searchTerm = this.searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
      // Show all products if search is empty
      this.filteredProducts = [...this.allProducts];
    } else {
      // Filter products based on search term
      this.filteredProducts = this.allProducts.filter(product => {
        const name = product.Name ? product.Name.toLowerCase() : '';
        const brand = product.Brand ? product.Brand.Name.toLowerCase() : '';
        const description = product.DescriptionHtmlSimple ?
          product.DescriptionHtmlSimple.replace(/<[^>]*>/g, '').toLowerCase() : '';
        const nameWithoutBrand = product.NameWithoutBrand ?
          product.NameWithoutBrand.toLowerCase() : '';

        return name.includes(searchTerm) ||
               brand.includes(searchTerm) ||
               description.includes(searchTerm) ||
               nameWithoutBrand.includes(searchTerm);
      });
    }

    // Update the display
    this.updateProductDisplay();
  }

  updateProductDisplay() {
    if (!this.productList) return;

    // Clear existing products
    this.productList.innerHTML = '';

    if (this.filteredProducts.length === 0) {
      // Show no results message
      this.productList.innerHTML = `
        <li class="no-results">
          <p>No products found matching your search.</p>
          <p>Try searching for brand names like "Marmot", "The North Face", or product types like "tent".</p>
        </li>
      `;
    } else {
      // Update section title with result count
      if (this.productsSection) {
        const count = this.filteredProducts.length;
        const term = this.searchInput.value.trim();
        if (term) {
          this.productsSection.textContent = `Products (${count} found for "${term}")`;
        } else {
          this.productsSection.textContent = `Top Products`;
        }
      }

      // Add filtered products
      this.filteredProducts.forEach(product => {
        const productCard = this.createProductCard(product);
        this.productList.appendChild(productCard);
      });
    }
  }

  createProductCard(product) {
    const li = document.createElement('li');
    li.className = 'product-card';

    // Fix image path for production build
    let imagePath = '/images/tents/placeholder.jpg';
    if (product.Image) {
      if (product.Image.startsWith('../')) {
        imagePath = product.Image.replace('../images/', '/assets/images/');
      } else if (product.Image.startsWith('/images/')) {
        imagePath = '/assets' + product.Image;
      } else {
        imagePath = product.Image;
      }
    }

    // Get brand name
    const brandName = product.Brand ? product.Brand.Name : 'Unknown Brand';

    // Get product name
    const productName = product.NameWithoutBrand || product.Name || 'Unknown Product';

    // Get price
    const price = product.FinalPrice || product.ListPrice || 'Price not available';

    li.innerHTML = `
      <a href="product_pages/${this.getProductPageName(product)}.html">
        <img
          src="${imagePath}"
          alt="${productName}"
        />
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${productName}</h2>
        <p class="product-card__price">$${price}</p>
      </a>
    `;

    return li;
  }

  getProductPageName(product) {
    // Create a URL-friendly name from the product name
    const name = product.NameWithoutBrand || product.Name || 'unknown';
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Debounce function to limit API calls during typing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
