import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://add-fnadf.fr"
    : "http://myloc.me:3000";

// initial state
const state = () => ({
  user: {},
});

// getters
const getters = {
  getUser: (state) => state.user,
};

// actions
const actions = {
  // create save action
  save: function ({ commit }, { id, payload }) {
    return new Promise((resolve, reject) => {
      axios
        .patch(base_url + "/api/users/" + id, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          commit("setUser", res.data.user);
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
  setUser(state, user) {
    state.user = user;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
