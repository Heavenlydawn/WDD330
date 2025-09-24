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
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);

    // Animate the cart icon
    const cartElement = document.getElementById("cartIcon");
    if (cartElement) {
      cartElement.classList.add("animate");
      setTimeout(() => {
        cartElement.classList.remove("animate");
      }, 1000);
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
    productPrice.textContent = product.FinalPrice;
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
