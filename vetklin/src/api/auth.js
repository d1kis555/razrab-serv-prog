import api from './index';

export function login({ username, password }) {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);
  return api.post('/token', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}
