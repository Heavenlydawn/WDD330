async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // Assuming the base URL is the same as for products
    this.baseURL = '/json'; // Adjust if needed
  }

  async checkout(order) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    };
    const response = await fetch(`${this.baseURL}/checkout`, options);
    return convertToJson(response);
  }
}
