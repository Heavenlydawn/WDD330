// Import the main CSS file to ensure it is bundled by Vite
import '../css/style.css';

import ProductSearch from './ProductSearch.js';


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
