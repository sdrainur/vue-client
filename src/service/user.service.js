import axios from "axios";
import axiosInstance from "@/service/axios.instance";

export const logIn = (email, password) => {
    console.log('loggining')
    return axios.post('http://192.168.1.8:4000/login', {
        'email': email,
        'password': password
    }).then(response => {
        if (response) {
            console.log(response.data.accessToken)
            localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken))
            localStorage.setItem("userId", JSON.stringify(response.data.id))
            localStorage.setItem("userRole", JSON.stringify(response.data.role))
        }
        return response.data
    })
}

export const loadRelatedUsers = () => {
    return axiosInstance.get('/related-users-list')
}
