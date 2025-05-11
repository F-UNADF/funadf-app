import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://app.addfrance.fr"
    : "http://localhost:3000";

// initial state
const state = () => ({
  items: {},
});

// getters
const getters = {
  getItems: (state) => state.items,
};

// actions
const actions = {
  getItems: function ({ commit }) {
    if (null === localStorage.getItem("token")) {
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .get(base_url + "/api/me/events")
        .then((res) => {
          commit("setItems", res.data.events);
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
  setItems: (state, payload) => (state.items = payload),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
