import axios from "axios";

// initial state
const state = () => ({
    user   : {},
    church : {},
    token: null,
});

// getters
const getters = {
    getUser : (state) => state.user,
    getChurch : (state) => state.church,
    getToken : (state) => state.token,
};

// actions
const actions = {
    login({commit}, credential){

        var data = new FormData();
        data.append('user[email]', credential.email);
        data.append('user[password]',  credential.password);

        var config = {
            method: 'post',
            url: 'https://add-fnadf.fr/v1/users/sign_in',
            data: data,
        };

        axios(config).then((res) => {
            sessionStorage.setItem('token', res.data.token);
            commit('setToken', res.data);
        })
        .catch((error) => {
            console.log(error, 2000);
        });
    },
    getConnectedUser({commit}){
        let token = sessionStorage.getItem('token');
        var config = {
            method: 'get',
            url: 'https://add-fnadf.fr/v1/users/'+token
        };

        axios(config).then((res) => {
            console.log(res.data);
            commit('setUser', res.data.user);
            commit('setChurch', res.data.church);
        })
        .catch((error) => {
            console.log(error, 2000);
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
    setToken(state, token) {
        state.token = token;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};