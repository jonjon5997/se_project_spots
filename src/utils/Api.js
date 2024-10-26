// utils/Api.js

class Api {
  constructor({ baseUrl, headers }) {
    // constructor body
    this._baseUrl = baseUrl;
    this._headers = headers;
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
  // this._baseUrl and this._headers should be assigned in the constructor
  // ...

  // Pass the data as an argument. In this example, we are using destructuring,
  // so we would need to pass the function an object with properties called
  // name and about.
  // editUserInfo({ name, about }) {
  //   return fetch(`${this._baseUrl}/users/me`, {
  //     method: "PATCH",
  //     headers: this._headers,
  //     // Send the data in the body as a JSON string.
  //     body: JSON.stringify({
  //       name,
  //       about,
  //     }),
  //   }).then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     }
  //     Promise.reject(`Error: ${res.status}`);
  //   });
  // }
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
      body: JSON.stringify(avatar),
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
