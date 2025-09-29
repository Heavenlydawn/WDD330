import ExternalServices from './ExternalServices.mjs';
import { getLocalStorage, setLocalStorage, alertMessage } from './utils.mjs';

export default class CheckoutProcess {
  constructor() {
    this.externalServices = new ExternalServices();
  }

  async checkout(form) {
    try {
      // Get cart items
      const cartItems = getLocalStorage('so-cart') || [];
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Calculate totals
      const order = {
        items: cartItems,
        orderTotal: this.calculateOrderTotal(cartItems),
        shipping: 10, // Assuming fixed shipping
        tax: this.calculateTax(this.calculateOrderTotal(cartItems)),
        orderDate: new Date().toISOString(),
        fname: form.fname.value,
        lname: form.lname.value,
        street: form.street.value,
        city: form.city.value,
        state: form.state.value,
        zip: form.zip.value,
        cardNumber: form.cardNumber.value,
        expiration: form.expiration.value,
        code: form.code.value,
      };

      // Submit order
      const response = await this.externalServices.checkout(order);

      // On success, clear cart and redirect
      setLocalStorage('so-cart', []);
      window.location.href = '/checkout/success.html';

    } catch (err) {
      // Handle error
      if (err.name === 'servicesError') {
        alertMessage(err.message.message || 'An error occurred during checkout');
      } else {
        alertMessage(err.message || 'An unexpected error occurred');
      }
    }
  }

  calculateOrderTotal(cartItems) {
    return cartItems.reduce((total, item) => total + item.FinalPrice, 0);
  }

  calculateTax(orderTotal) {
    return orderTotal * 0.06; // Assuming 6% tax
  }
}
