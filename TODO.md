# TODO: Fix Add to Cart Animation and Netlify 404 Issues

## Animation Issue
- [x] Verify cart icon element (#cartIcon) presence on all product detail pages
- [x] Test animation trigger in browser (add to cart and check if class is added/removed)
- [x] Debug console logs for cart element found/not found

## 404 Issue on Netlify
- [ ] Review and adjust netlify.toml redirects to avoid 404 on product detail pages
- [ ] Ensure product_pages folder is included in build output (dist/)
- [ ] Test redirects locally or on Netlify

## Build Configuration
- [x] Check vite.config.js for any exclusions or inclusions of product_pages
- [x] Ensure build process copies static HTML files correctly
