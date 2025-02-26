import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://add-fnadf.fr"
    : "http://myloc.me:3000";

// initial state
const state = () => ({
  items: {},
  item: {},
  campaign: {},
  structure: {},
  meeting: {},
  motions: {},
  voters: {},
  results: [],
  present: true,
});

// getters
const getters = {
  getItems: (state) => state.items,
  getItem: (state) => state.item,
  getStructure: (state) => state.structure,
  getCampaign: (state) => state.campaign,
  getMotions: (state) => state.motions,
  getVoters: (state) => state.voters,
  getResults: (state) => state.results,
  getMeeting: (state) => state.meeting,
  getPresent: (state) => state.present,
};

// actions
const actions = {
  items: function ({ commit }) {
    if (null === localStorage.getItem("token")) {
      return;
    }
    return new Promise((resolve, reject) => {
      axios
        .get(base_url + "/api/votes")
        .then((res) => {
          commit("setItems", res.data.campaigns);
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  getCampaign: function ({ commit }, id) {
    return new Promise((resolve, reject) => {
      axios
        .get(base_url + "/api/votes/" + id)
        .then((res) => {
          commit("setCampaign", res.data.campaign);
          commit("setMotions", res.data.motions);
          commit("setVoters", res.data.voters);
          commit("setMeeting", res.data.meeting);
          commit("setStructure", res.data.structure);
          commit("setPresent", res.data.present);

          commit("setResults");
          resolve(res);
        })
        .catch((error) => {
          reject(error, 2000);
        });
    });
  },
  vote: function ({ commit }, payload) {
    console.log(commit);
    return new Promise((resolve, reject) => {
      axios
        .post(base_url + "/api/votes", payload)
        .then((res) => {
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
