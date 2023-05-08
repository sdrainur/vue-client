import { defineStore } from "pinia";
import { logIn } from "@/service/user.service";
import router from "@/router/router";

const token = JSON.parse(localStorage.getItem("accessToken"));
const userId = JSON.parse(localStorage.getItem("userId"));
const userRole = JSON.parse(localStorage.getItem("userRole"));
const initialState = token
  ? {
      loggedIn: true,
      token,
      userId,
      userRole,
    }
  : {
      loggedIn: false,
      token: null,
      userId: null,
      userRole: null,
    };

export const useAuthenticationStore = defineStore("authentication", {
  state: () => initialState,
  getters: {
    getAccessToken: (state) => state.token,
    isLoggedIn: (state) => state.loggedIn,
    getUserId: (state) => state.userId,
  },
  actions: {
    login(email, password) {
      return logIn(email, password).then((result) => {
        console.log(result.accessToken);
        this.loggedIn = true;
        this.token = result.accessToken;
        this.userId = result.id;
        this.userRole = result.role;
        router.push("/user");
      });
    },
    logout() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      location.reload();
    },
  },
});
