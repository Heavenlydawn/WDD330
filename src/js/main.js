import ProductSearch from './ProductSearch.mjs';

// Initialize the search functionality when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ProductSearch');
    new ProductSearch();
  });
} else {
  console.log('DOM already loaded, initializing ProductSearch');
  new ProductSearch();
}
