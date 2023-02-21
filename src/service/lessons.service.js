import axiosInstance from "@/service/axios.instance";

export const loadPlan = (role, id) => {
    console.log('you loh')
    return axiosInstance.get('/lesson/plan/' + role + '/' + id)
}