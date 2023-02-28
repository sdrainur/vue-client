import axiosInstance from "@/service/axios.instance";

export const loadChatRooms = (userId) => {
    return axiosInstance.get('/chat-list/' + userId)
}