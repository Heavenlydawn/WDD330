import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");

// Get product ID from URL parameter or from the Add to Cart button's data-id
let productID = getParam("product");
if (!productID) {
  // If no URL parameter, try to get it from the Add to Cart button
  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    productID = addToCartBtn.dataset.id;
  }
}

console.log("Product ID:", productID);

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing ProductDetails");
    const product = new ProductDetails(productID, dataSource);
    product.init();
  });
} else {
  console.log("DOM already loaded, initializing ProductDetails");
  const product = new ProductDetails(productID, dataSource);
  product.init();
}

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
