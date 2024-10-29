// utils/Api.js

class Api {
  constructor({ baseUrl, headers }) {
    // constructor body
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // need to call getInitialCards one time on page load
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  // need to call getInitialCards one time on page load
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  //implement POST/cards
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name, // The title or name of the card
        link: link, // The URL or link to the image
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json(); // Return the new card data if the request was successful
      }
      return Promise.reject(`Error: ${res.status}`); // Handle HTTP errors
    });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH", // or 'PUT' depending on your API
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    }).then((res) => {
      if (res.ok) {
        return res.json(); // Return the updated user info
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }
  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH", // or 'PUT' depending on your API
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    }).then((res) => {
      if (res.ok) {
        return res.json(); // Return the updated user info
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE", // or 'PUT' depending on your API
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json(); // Return the updated user info
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // other methods for working with the API
  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }
}

// export the class
export default Api;
