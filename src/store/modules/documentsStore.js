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
        .get(base_url + "/api/documents")
        .then((res) => {
          commit("setItems", res.data);
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
  setItem: (state, payload) => (state.item = payload),
  setCampaign: (state, payload) => (state.campaign = payload),
  setMotions: (state, payload) => (state.motions = payload),
  setVoters: (state, payload) => (state.voters = payload),
  setMeeting: (state, payload) => (state.meeting = payload),
  setStructure: (state, payload) => (state.structure = payload),
  setPresent: (state, payload) => (state.present = payload),
  setResults: (state) => {
    state.results = [];
    state.motions.forEach((element) => {
      state.results.push({
        motion_id: element.id,
        choices: element.choices,
        max_choices: element.max_choice,
        vote: null,
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
