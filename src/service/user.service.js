import axios from "axios";

export function logIn(email, password) {
    return axios.post('http://localhost:4000/login', {
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
