import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://app.addfrance.fr"
    : "http://localhost:3000";

// L'API renvoie les événements à venir par pages de 5 (paramètre offset).
const PAGE_SIZE = 5;

// initial state
const state = () => ({
  items: [],
  offset: 0,
  endOfFeed: false,
});

// getters
const getters = {
  getItems: (state) => state.items,
  getEndOfFeed: (state) => state.endOfFeed,
};

// actions
const actions = {
  // Première page (ou rechargement complet si reset)
  getItems: function ({ commit }) {
    if (null === localStorage.getItem("token")) {
      return Promise.resolve();
    }
    return axios
      .get(base_url + "/api/me/events", { params: { offset: 0 } })
      .then((res) => {
        const events = res.data.events || [];
        commit("setItems", events);
        commit("setOffset", events.length);
        commit("setEndOfFeed", events.length < PAGE_SIZE);
        return res;
      });
  },
  // Page suivante
  loadMore: function ({ commit, state }) {
    return axios
      .get(base_url + "/api/me/events", { params: { offset: state.offset } })
      .then((res) => {
        const events = res.data.events || [];
        commit("pushItems", events);
        commit("setOffset", state.offset + events.length);
        commit("setEndOfFeed", events.length < PAGE_SIZE);
        return res;
      });
  },
};

// mutations
const mutations = {
  setItems: (state, payload) => (state.items = payload),
  pushItems: (state, payload) => state.items.push(...payload),
  setOffset: (state, payload) => (state.offset = payload),
  setEndOfFeed: (state, payload) => (state.endOfFeed = payload),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
