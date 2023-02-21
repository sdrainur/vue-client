import {authToken} from "@/service/auth.service";

const axios = require('axios')

const token = authToken

const axiosInstance = token ?
    axios.create({
        baseURL: 'http://localhost:4000',
        timeout: 8000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    }) :
    axios.create({
        baseURL: 'http://localhost:4000',
        timeout: 8000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

export default axiosInstance;