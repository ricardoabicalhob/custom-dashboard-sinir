import axios from "axios"

//PRODUCTION CONFIGURATION
// const isServer = typeof window === "undefined"
// const API_URL = isServer ? "http://api:3100" : "http://localhost:3100"

//DEVELOPMENT CONFIGURATION
const API_URL = "https://admin.sinir.gov.br"

const api = axios.create({
    baseURL: API_URL
})

export default api