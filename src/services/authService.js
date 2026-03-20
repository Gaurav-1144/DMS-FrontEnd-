import axios from 'axios'

const http = axios.create({ baseURL: '/api/auth', timeout: 15_000 })

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.messages?.[0] ||
      err.message ||
      'An error occurred.'
    return Promise.reject(new Error(msg))
  }
)

const authService = {
  login(username, password) {
    return http.post('/login', { username, password }).then(r => r.data)
  },
  register(username, email, password, fullName) {
    return http.post('/register', { username, email, password, fullName }).then(r => r.data)
  },
}

export default authService
