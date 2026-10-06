function tokenExists() {
  const token = localStorage.getItem('token');
  return token !== null;
}

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token: string) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

export { tokenExists, getToken, setToken, removeToken };
