import axios from "axios";

let base_url = 'https://add-fnadf.fr';
if (process.env.NODE_ENV === 'development') {
  base_url = 'http://myloc.me:3000';
}

// initial state
const state = () => ({
  items: {},
  item: {},
  campaign: {},
  motions: {},
  voters: {},
  results: [],
});

// getters
const getters = {
  getItems: (state) => state.items,
  getItem: (state) => state.item,
  getCampaign: (state) => state.campaign,
  getMotions: (state) => state.motions,
  getVoters: (state) => state.voters,
  getResults: (state) => state.results,
};

// actions
const actions = {
  items: function ({ commit }) {
    let token = sessionStorage.getItem('token');
    let params = new URLSearchParams([['token', token]]);

    return new Promise((resolve, reject) => {
      axios.get(base_url + '/v1/votes', { params }).then((res) => {
        commit('setItems', res.data.campaigns);
        resolve(res);
      }).catch((error) => {
        reject(error, 2000);
      });
    });
  },
  getCampaign: function ({ commit }, id) {
    let token = sessionStorage.getItem('token');
    let params = new URLSearchParams([['token', token]]);

    return new Promise((resolve, reject) => {
      axios.get(base_url + '/v1/votes/' + id, { params }).then((res) => {
        commit('setCampaign', res.data.campaign);
        commit('setMotions', res.data.motions);
        commit('setVoters', res.data.voters);
        commit('setResults');
        resolve(res);
      }).catch((error) => {
        reject(error, 2000);
      });
    });
  },
  vote: function ({ commit }, payload) {
    let token = sessionStorage.getItem('token');
    let params = new URLSearchParams([['token', token]]);

    console.log(payload);

    return new Promise((resolve, reject) => {
      axios.post(base_url + '/v1/votes', payload, { params }).then((res) => {
        resolve(res);
        console.log(commit);
      }).catch((error) => {
        reject(error, 2000);
      });
    });
  }
};

// mutations
const mutations = {
  setItems: (state, payload) => state.items = payload,
  setItem: (state, payload) => state.item = payload,
  setCampaign: (state, payload) => state.campaign = payload,
  setMotions: (state, payload) => state.motions = payload,
  setVoters: (state, payload) => state.voters = payload,
  setResults: (state) => {
    state.results = [];
    state.motions.forEach(element => {
      state.results.push({
        motion_id: element.id,
        vote: null,
      });
    });
  },
};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
};