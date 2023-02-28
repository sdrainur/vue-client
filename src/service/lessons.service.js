import axiosInstance from "@/service/axios.instance";

export const loadPlan = (role, id) => {
    return axiosInstance.get('/lesson/plan/' + role + '/' + id)
}