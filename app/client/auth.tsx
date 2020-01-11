import axios from "axios";

let isLoggedIn = !!localStorage.loginToken;

function getToken() {
  return localStorage.loginToken;
}

export const auth = {
  isLoggedIn() {
    return isLoggedIn;
  },
  logIn(token: string) {
    localStorage.loginToken = token;
    isLoggedIn = true;
  },
  logOut() {
    delete localStorage.loginToken;
    isLoggedIn = false;
  },
  getToken() {
    return getToken();
  },
  axios() {
    return axios.create({
      headers: { "Authorization" : "Bearer " + getToken() }
    });
  },
  queryAuth() {
    return "auth=" + getToken();
  }
};
