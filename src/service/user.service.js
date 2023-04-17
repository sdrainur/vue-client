import axiosInstance from "@/service/axios.instance";

export const logIn = (email, password) => {
    console.log('loggining')
    return axiosInstance.post('/login', {
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
