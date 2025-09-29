// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function alertMessage(message, scroll = true) {
  // Remove existing alert if any
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const main = document.querySelector('main');
  if (!main) return;

  const alertDiv = document.createElement('div');
  alertDiv.className = 'custom-alert';
  alertDiv.style.backgroundColor = '#f8d7da';
  alertDiv.style.color = '#721c24';
  alertDiv.style.border = '1px solid #f5c6cb';
  alertDiv.style.padding = '1em';
  alertDiv.style.marginBottom = '1em';
  alertDiv.style.borderRadius = '4px';
  alertDiv.style.fontWeight = 'bold';
  alertDiv.style.textAlign = 'center';
  alertDiv.style.position = 'relative';

  alertDiv.textContent = typeof message === 'string' ? message : JSON.stringify(message);

  main.insertBefore(alertDiv, main.firstChild);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
