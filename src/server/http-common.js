import axios from 'axios'
import store from '../store'
import router from '../router'

const API_URL = 'https://staging.swift-english.com/api/v1/'
    // const API_URL = 'https://api.swift-english.com/api/v1/' // commented 12.05.19
const USERS_URL = 'https://api.swift-english.com/api/v1/users/'

// const API_URL = 'http://127.0.0.1:8000/api/v1/'
// const USERS_URL = 'http://127.0.0.1:8000/api/v1/users/'

const TEST_URL = "http://127.0.0.1:8081"

// Отслеживание действий пользователя
export const HTTP_USER = axios.create({
    baseURL: TEST_URL + '/test',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})

// HTTP
export const HTTP = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
})

// USERS_HTTP
export const USERS_HTTP = axios.create({
    baseURL: USERS_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
})

HTTP.interceptors.request.use(
    function(config) {
        const token = store.getters.token
        if (token)
            config.headers.Authorization = `Bearer ${token}`
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

HTTP.interceptors.response.use(null, function(error) {
    if (error.response.status === 401)
        router.push('/login')
    return Promise.reject(error)
})