import axiosInstance from "@/service/axios.instance";

export const loadMessages = (uuid) => {
    return axiosInstance.get('/messages/' + uuid)
}

