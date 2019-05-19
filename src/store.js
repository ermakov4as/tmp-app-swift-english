import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        _user: null,
        _token: null
    },
    mutations: {
        token(state, token) {
            state._token = token;
            Cookies.set('se_token', token);
        },
        user(state, user) {
            state._user = user;
        }
    },
    getters: {
        token(state) {
            return state._token || Cookies.get('se_token');
        },
        user(state) {
            return state._user;
        },
        is_logged(state) {
            return state._user !== null
        }
    },
    actions: {
        logout(context) {
            context.commit('token', null);
            Cookies.remove('se_token');
            context.commit('user', null);
        }
    }
});