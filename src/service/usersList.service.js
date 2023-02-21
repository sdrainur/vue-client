import axiosInstance from "@/service/axios.instance";

export const loadUsers = choice => {
    return axiosInstance.get('/' + choice + '/get')
}

