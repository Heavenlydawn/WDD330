import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      console.error(`Product with ID ${this.productId} not found.`);
      return;
    }
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    const addToCartBtn = document.getElementById("addToCart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", this.addProductToCart.bind(this));
    }
    // Add listener to the Add to Wishlist button
    const addToWishlistBtn = document.getElementById("addToWishlist");
    if (addToWishlistBtn) {
      addToWishlistBtn.addEventListener("click", this.addProductToWishlist.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);

    // Animate the cart icon SVG
    const cartElement = document.getElementById("cartIcon");
    if (cartElement) {
      const svgElement = cartElement.querySelector("svg");
      if (svgElement) {
        svgElement.classList.remove("animate");
        // Force reflow to restart animation
        void svgElement.offsetWidth;
        svgElement.classList.add("animate");
        setTimeout(() => {
          svgElement.classList.remove("animate");
        }, 1000);
      }
    }
  }

  addProductToWishlist() {
    const wishlistItems = getLocalStorage("so-wishlist") || [];
    // Check if product is already in wishlist
    const existingIndex = wishlistItems.findIndex(item => item.Id === this.product.Id);
    if (existingIndex === -1) {
      wishlistItems.push(this.product);
      setLocalStorage("so-wishlist", wishlistItems);
      alert("Product added to wishlist!");
    } else {
      alert("Product is already in your wishlist!");
    }
  }

  renderProductDetails() {
    // Check if this is a template-based page or hardcoded page
    const productImage = document.getElementById("productImage");
    const productPrice = document.getElementById("productPrice");
    const productColor = document.getElementById("productColor");
    const productDesc = document.getElementById("productDesc");

    if (productImage && productPrice && productColor && productDesc) {
      // Template-based page - update the elements
      productDetailsTemplate(this.product);
    } else {
      // Hardcoded page - just set up the add to cart functionality
      const addToCartBtn = document.getElementById("addToCart");
      if (addToCartBtn) {
        addToCartBtn.dataset.id = this.product.Id || addToCartBtn.dataset.id;
      }
    }
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  if (productImage) {
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;
  }

  const productPrice = document.getElementById("productPrice");
  if (productPrice) {
    // Format price as currency
    const priceFormatted = `$${product.FinalPrice.toFixed(2)}`;
    productPrice.textContent = priceFormatted;

    // Calculate discount if any
    let discountText = "";
    const suggestedPrice = product.SuggestedRetailPrice || product.ListPrice || 0;
    if (suggestedPrice > product.FinalPrice) {
      const discountPercent = Math.round(((suggestedPrice - product.FinalPrice) / suggestedPrice) * 100);
      discountText = `${discountPercent}% OFF`;
    }

    // Create or update discount indicator element
    let discountIndicator = document.getElementById("discountIndicator");
    if (!discountIndicator) {
      discountIndicator = document.createElement("span");
      discountIndicator.id = "discountIndicator";
      discountIndicator.className = "discount-indicator";
      productPrice.parentNode.insertBefore(discountIndicator, productPrice.nextSibling);
    }
    discountIndicator.textContent = discountText;
    discountIndicator.style.display = discountText ? "inline" : "none";
  }

  const productColor = document.getElementById("productColor");
  if (productColor) {
    productColor.textContent = product.Colors[0].ColorName;
  }

  const productDesc = document.getElementById("productDesc");
  if (productDesc) {
    productDesc.innerHTML = product.DescriptionHtmlSimple;
  }

  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    addToCartBtn.dataset.id = product.Id;
  }
}

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }
