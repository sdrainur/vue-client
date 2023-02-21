import axiosInstance from "@/service/axios.instance";
import {authToken} from "@/service/auth.service";

const setup = () => {
    axiosInstance.interceptors.request.use(config => {
        const token = authToken
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token
        }
        return config
    }, error => {
        return Promise.reject(error)
    });

    axiosInstance().interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        return Promise.reject(error);
    });
}

module.exports = {
    setup
}