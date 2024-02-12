import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://add-fnadf.fr"
    : "https://add-fnadf.fr";

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
    localStorage.setItem("token", null);
  },
  getConnectedUser({ commit }) {
    let token = localStorage.getItem("token");
    commit("setToken", token);

    if (token !== null) {
      var config = {
        method: "get",
        url: base_url + "/v1/users/" + token,
      };
      return new Promise((resolve, reject) => {
        axios(config)
          .then((res) => {
            let user = res.data.user;
            user.gratitudes = res.data.gratitudes;
            commit("setUser", user);
            commit("setChurch", res.data.church);
            commit("setFees", res.data.fees);
            commit("setLoggedIn", true);
            resolve(res);
          })
          .catch((error) => {
            localStorage.removeItem("token");
            commit("setLoggedIn", false);
            reject(error, 2000);
          });
      });
    }
  },
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
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
