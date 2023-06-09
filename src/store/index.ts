import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            isLogin: JSON.parse(sessionStorage.getItem('isLogin')) || false
        }
    },
    mutations: {
        userLogin(state) {
            state.isLogin = true
            sessionStorage.setItem('isLogin', JSON.stringify(state.isLogin))
        },
        userLogout(state) {
            state.isLogin = false
            sessionStorage.setItem('isLogin', JSON.stringify(state.isLogin))
        }
    }
})

export default store