import axios from "axios";

let base_url = 'https://add-fnadf.fr';
if (process.env.NODE_ENV === 'development') {
  base_url = 'http://myloc.me:3000';
}

// initial state
const state = () => ({
  items: {},
  item: {},
});

// getters
const getters = {
  getItems: (state) => state.items,
  getItem: (state) => state.item,
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
};

// mutations
const mutations = {
  setItems: (state, payload) => state.items = payload,
};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
};