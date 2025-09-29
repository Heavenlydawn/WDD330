import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";

function wishlistItemTemplate(item) {
  return `<li class="wishlist-card divider">
    <a href="/product_pages/index.html?product=${item.Id}" class="wishlist-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="/product_pages/index.html?product=${item.Id}">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="wishlist-card__color">${item.Colors[0].ColorName}</p>
    <p class="wishlist-card__price">$${item.FinalPrice}</p>
    <button class="remove-wishlist-btn" data-id="${item.Id}">Remove</button>
  </li>`;
}

function renderWishlist() {
  const wishlistItems = getLocalStorage("so-wishlist") || [];
  const wishlistContainer = document.querySelector(".wishlist-list");
  if (!wishlistContainer) return;
  wishlistContainer.innerHTML = "";
  renderListWithTemplate(wishlistItemTemplate, wishlistContainer, wishlistItems, "beforeend", true);

  // Add event listeners for remove buttons
  const removeButtons = document.querySelectorAll(".remove-wishlist-btn");
  removeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeFromWishlist(id);
      renderWishlist();
    });
  });
}

function removeFromWishlist(productId) {
  let wishlistItems = getLocalStorage("so-wishlist") || [];
  wishlistItems = wishlistItems.filter(item => item.Id !== productId);
  setLocalStorage("so-wishlist", wishlistItems);
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});

export { renderWishlist, removeFromWishlist };
