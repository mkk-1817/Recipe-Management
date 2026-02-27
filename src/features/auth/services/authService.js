import { Email } from "@mui/icons-material";

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

function generateToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  const signature = btoa('signature');
  return `${header}.${body}.${signature}`;
}

function login(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const storedUser = localStorage.getItem(`user_${username}`);
  let userData = { username };
  
  if (storedUser) {
    userData = JSON.parse(storedUser);
  }

  const token = generateToken({ ...userData, sub: username });
  const refreshToken = generateToken({ username, type: 'refresh' });

  setToken(token);
  setRefreshToken(refreshToken);

  return { token, refreshToken, user: userData };
}

function register(userData) {
  if (!userData.username || !userData.password) {
    throw new Error('Username and password are required');
  }

  const user = {
    username: userData.username,
    email: userData.email || '',
    name: userData.name || '',
    age: userData.age || '',
    gender: userData.gender || ''
  };

  localStorage.setItem(`user_${userData.username}`, JSON.stringify(user));

  return { success: true, user };
}

function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}


function getUserInfo(username) {
  const storedUser = localStorage.getItem(`user_${username}`);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}

function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.username || payload.sub;
    return getUserInfo(username) || { username };
  } catch {
    return null;
  }
}

function refreshAuthToken() {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) return false;

  try {
    const payload = JSON.parse(atob(currentRefreshToken.split('.')[1]));
    const newToken = generateToken({ username: payload.username, sub: payload.username });
    setToken(newToken);
    return true;
  } catch {
    return false;
  }
}

export {
  login,
  register,
  logout,
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  isAuthenticated,
  getAuthHeader,
  refreshAuthToken,
  getUserInfo,
  getCurrentUser
};
