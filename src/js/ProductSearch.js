import ProductData from './ProductData.js';

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

    // Render initial product list
    this.updateProductDisplay();

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

      // Limit to 4 products on homepage
      const productsToShow = this.filteredProducts.slice(0, 4);

      // Add filtered products
      productsToShow.forEach(product => {
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
      if (product.Image.startsWith('../images/tents/')) {
        imagePath = product.Image.replace('../images/tents/', '/images/tents/');
      } else if (product.Image.startsWith('/images/')) {
        imagePath = product.Image;
      } else {
        imagePath = product.Image;
      }
    }
    console.log(`Product: ${product.NameWithoutBrand || product.Name}, Image Path: ${imagePath}`);

    // Get brand name
    const brandName = product.Brand ? product.Brand.Name : 'Unknown Brand';

    // Get product name
    const productName = product.NameWithoutBrand || product.Name || 'Unknown Product';

    // Get price
    const price = product.FinalPrice || product.ListPrice || 'Price not available';

    // Calculate discount if any
    let discountText = "";
    const suggestedPrice = product.SuggestedRetailPrice || product.ListPrice || 0;
    if (suggestedPrice > product.FinalPrice) {
      const discountPercent = Math.round(((suggestedPrice - product.FinalPrice) / suggestedPrice) * 100);
      discountText = `${discountPercent}% OFF`;
    }

    li.innerHTML = `
      <a href="product_pages/${this.getProductPageName(product)}.html">
        <img
          src="${imagePath}"
          alt="${productName}"
        />
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${productName}</h2>
        <p class="product-card__price">$${price}</p>
        <span class="discount-indicator" style="display: ${discountText ? 'inline' : 'none'};">${discountText}</span>
      </a>
    `;

    return li;
  }

  getProductPageName(product) {
    // Map product names to actual product page filenames
    const pageMap = {
      'ajax tent - 3-person, 3-season': 'marmot-ajax-3',
      'talus tent - 4-person, 3-season': 'northface-talus-4',
      'alpine guide tent - 3-person, 4-season': 'northface-alpine-3',
      'rimrock tent - 2-person, 3-season': 'cedar-ridge-rimrock-2'
    };
    const name = (product.NameWithoutBrand || product.Name || 'unknown').toLowerCase().trim();
    return pageMap[name] || 'index';
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
