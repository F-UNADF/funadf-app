import axios from "axios";

let base_url =
  process.env.NODE_ENV === "production"
    ? "https://app.addfrance.fr"
    : "http://localhost:3000";

// initial state
const state = () => ({
  items: {},
  offset: 0,
  loading: false,
  endOfFeed: false,
});

// getters
const getters = {
  getItems: (state) => state.items,
  getOffset: (state) => state.offset,
  getLoading: (state) => state.loading,
  getEndOfFeed: (state) => state.endOfFeed,
};

// actions
const actions = {
  initFeed({ commit }) {
    commit('setItems', {});
    commit('setOffset', 0);
    commit('setLoading', false);
    commit('setEndOfFeed', false);
  },
  fetchFeed({ commit, state }) {
    if (null === localStorage.getItem("token")) {
      return;
    }
    return new Promise((resolve, reject) => {
      axios.get(base_url + '/api/feed?offset=' + state.offset).then((res) => {
        commit('setItems', res.data.posts);
        commit('setOffset', state.offset + 10);
        commit('setEndOfFeed', res.data.posts.length < 10);
        commit('setLoading', false);
        resolve(res);
      }).catch((error) => {
        reject(error, 2000);
      });
    });
  },
  loadMore: function ({
    commit,
    state
  }) {
    commit('setLoading', true);
    return new Promise((resolve, reject) => {
      axios.get(base_url + '/api/feed?offset=' + state.offset, {}).then((res) => {
        commit('pushItems', res.data.posts);
        commit('setOffset', state.offset + 10);
        commit('setLoading', false);
        resolve(res);
      }).catch((error) => {
        reject(error, 2000);
      });
    });
  },
};

// mutations
const mutations = {
  setItems(state, items) { state.items = items; },
  setOffset(state, offset) { state.offset = offset; },
  setLoading(state, loading) { state.loading = loading; },
  pushItems: (state, payload) => state.items.push(...payload),
  setEndOfFeed(state, endOfFeed) { state.endOfFeed = endOfFeed; },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
