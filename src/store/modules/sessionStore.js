import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://add-fnadf.fr"
    : "http://myloc.me:3000";

// si on a un token dans le local storage ou en session on le met dans le header par defaut de axios
const token = sessionStorage.getItem('token') || localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
    let url = base_url + "/users/sign_in";
    let formData = new FormData();
    formData.append("email", credential.email);
    formData.append("password", credential.password);
    return new Promise((resolve, reject) => {
      axios
        .post(url, formData)
        .then((res) => {
          commit("setToken", res.data.token);
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
          commit("setLoggedIn", true);
          resolve(res);
        })
        .catch((error) => {
          commit("setLoggedIn", false);
          reject(error, 2000);
        });
    });
  },
  logout({ commit }) {
    commit("setToken", null);
    commit("setLoggedIn", false);
    localStorage.removeItem("token");
  },
  async fetchUser({ commit }) {
    try {
      const response = await axios.get(base_url + '/api/current_user');
      commit('setCurrentUser', response.data.user);
    } catch (error) {
      commit('setCurrentUser', null);
    }
  },
};

// mutations
const mutations = {
  setCurrentUser(state, user) { state.user = user; },
  setChurch(state, church) { state.church = church; },
  setFees(state, fees) { state.fees = fees; },
  setToken(state, token) { state.token = token; },
  setLoggedIn(state, payload) { state.loggedIn = payload; },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
