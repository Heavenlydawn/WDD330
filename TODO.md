# TODO: Fix Add to Cart Animation and Netlify 404 Issues

## Animation Issue
- [x] Verify cart icon element (#cartIcon) presence on all product detail pages
- [x] Test animation trigger in browser (add to cart and check if class is added/removed)
- [x] Debug console logs for cart element found/not found

## 404 Issue on Netlify
- [x] Review and adjust netlify.toml redirects to avoid 404 on product detail pages
- [x] Ensure product_pages folder is included in build output (dist/)
- [x] Test redirects locally or on Netlify
- [x] Fix inconsistent redirect configurations between netlify.toml and _redirects
- [ ] Standardize asset paths from relative to absolute for better Netlify compatibility
- [ ] Update all product page HTML files with correct asset paths

## Build Configuration
- [x] Check vite.config.js for any exclusions or inclusions of product_pages
- [x] Ensure build process copies static HTML files correctly
