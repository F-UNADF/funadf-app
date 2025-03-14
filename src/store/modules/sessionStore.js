import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://add-fnadf.fr"
    : "http://app.localhost:3000";

// si on a un token dans le local storage ou en session on le met dans le header par defaut de axios
const token = localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// initial state
const state = () => ({
  user: { id: 0 },
  church: {},
  fees: [],
});

// getters
const getters = {
  getUser: (state) => state.user,
  getChurch: (state) => state.church,
  getFees: (state) => state.fees,
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
          let token = res.data.token;
          localStorage.setItem("token", token);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          commit("setLoggedIn", true);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  logout({ commit }) {
    commit("setToken", null);
    localStorage.removeItem("token");
  },
  async fetchUser({ commit }) {
    if (null === localStorage.getItem("token")) {
      return;
    }
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
