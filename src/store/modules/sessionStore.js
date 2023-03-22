import axios from "axios";

let base_url = 'https://add-fnadf.fr';
if (process.env.NODE_ENV === 'development') {
    base_url = 'http://myloc.me:3000';
}

// initial state
const state = () => ({
    user: {},
    church: {},
    fees: [],
    token: null,
    loggedIn: false,
});

// getters
const getters = {
    getUser: (state) => state.user,
    getChurch: (state) => state.church,
    getToken: (state) => state.token,
    getFees: (state) => state.fees,
    getLoggedIn: (state) => state.loggedIn,
};

// actions
const actions = {
    login({ commit }, credential) {
        var data = new FormData();
        data.append('user[email]', credential.email);
        data.append('user[password]', credential.password);
        var config = {
            method: 'post',
            url: base_url + '/v1/users/sign_in',
            data: data,
        }
        return new Promise((resolve, reject) => {
            axios(config).then((res) => {
                commit('setToken', res.data.token);
                localStorage.setItem('token', res.data.token);
                commit('setLoggedIn', true);
                resolve(res);
            }).catch((error) => {
                commit('setLoggedIn', false);
                reject(error, 2000);
            });
        });
    },
    logout({ commit }) {
        commit('setToken', null);
        commit('setLoggedIn', false);
        localStorage.removeItem('token');
    },
    getConnectedUser({ commit }) {
        let token = localStorage.getItem('token');
        commit('setToken', token);

        if (!token) {
            commit('setLoggedIn', false);
            return;
        }

        var config = {
            method: 'get',
            url: base_url + '/v1/users/' + token,
        };
        return new Promise((resolve, reject) => {
            axios(config).then((res) => {
                commit('setUser', res.data.user);
                commit('setChurch', res.data.church);
                commit('setFees', res.data.fees);
                commit('setLoggedIn', true);
                resolve(res);
            }).catch((error) => {
                localStorage.removeItem('token');
                commit('setLoggedIn', false);
                reject(error, 2000);
            });
        });
    }

};

// mutations
const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    setChurch(state, church) {
        state.church = church;
    },
    setFees(state, fees) {
        state.fees = fees;
    },
    setToken(state, token) {
        state.token = token;
    },
    setLoggedIn(state, payload) {
        state.loggedIn = payload;
    }
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
};