import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://app.addfrance.fr"
    : "http://localhost:3000";

// initial state
const state = () => ({
  notifications: [],
});

// getters
const getters = {
  getNotifications: (state) => state.notifications,
};

// actions
const actions = {
  getNotifications: function ({ commit }) {
    if (null === localStorage.getItem("token")) {
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .get(base_url + "/api/notifications")
        .then((res) => {
          commit("setNotifications", res.data.notifications);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
};

// mutations
const mutations = {
  setNotifications: (state, payload) => (state.notifications = payload),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
