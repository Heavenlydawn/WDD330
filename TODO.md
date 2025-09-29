# W04 Individual Activity: Error Checking and Validation

## Plan

1. Create `src/js/ExternalServices.mjs`
   - Refactor `convertToJson` to parse JSON response body before checking `res.ok`.
   - Implement `checkout` method to submit order to server.

2. Create `src/js/CheckoutProcess.mjs`
   - Implement `checkout` method that calls `ExternalServices.checkout` inside try-catch.
   - On success, clear cart and redirect to `success.html`.
   - On error, show alert message using `alertMessage`.

3. Update `src/checkout/index.html`
   - Add checkout form with all required inputs and `required` attributes.
   - Add form submission listener that checks form validity and calls `CheckoutProcess.checkout`.

4. Create `src/checkout/success.html`
   - Add success message page with header and footer.

5. Update `src/js/utils.mjs`
   - Add `alertMessage` function to show non-intrusive alert messages.

6. (Optional) Update `src/js/cart.js` or product detail page to use `alertMessage` for product added feedback.

## Next Steps
- Await user confirmation to proceed with implementation.
