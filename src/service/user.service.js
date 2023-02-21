import axios from "axios";

export function logIn(email, password) {
    return axios.post('http://localhost:4000/login', {
        'email': email,
        'password': password
    }).then(response => {
        if(response){
            localStorage.setItem("accessToken", JSON.stringify(response.data))
        }
        return response.data
    })
}
