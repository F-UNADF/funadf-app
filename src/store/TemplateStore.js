import api from "../utils/api";

// initial state
const state = () => ({
    item          : {},
    items              : [],
    loadingDatas  : false,
    updateDatabase: false,
});

// Getters
const getters = {
    item          : (state) => {
        return state.item;
    },
    loadingDatas  : (state) => {
        return state.loadingDatas;
    },
    updateDatabase: (state) => {
        return state.updateDatabase;
    },
};

// Actions
const actions = {
    getItem({commit}, id, query) {
        return new Promise((resolve, reject) => {
            commit("setLoadingDatas", true);
            api.get("template.item", {"template": id}, query, response => {
                commit("setItem", response.data);
                commit("setLoadingDatas", false);
                resolve("getItem");
            }, error => {
                commit("setLoadingDatas", false);
                reject("getItem");
            });
        });
    },
    update({commit, dispatch}, {id, formData}) {
        return new Promise((resolve, reject) => {
            commit("setUpdateDatabase", true);
            api.put("template.update", {'template': id}, formData, (response) => {
                commit("setItemInItemsById", response.data);
                commit("setUpdateDatabase", false);
                resolve(response);
            }, (error) => {
                // Si on a une réponse, et que dans les datas, on a une property item
                if (error.response && error.response.hasOwnProperty('data') && error.response.data.hasOwnProperty('item')) {
                    commit("setItemInItemsById", error.response.data['item']);
                }
                commit("setUpdateDatabase", false);
                reject(error);
            });
        });
    },
};

// Mutations
const mutations = {
    setItem               : (state, payload) => state.item = payload,
    setItems              : (state, payload) => state.items = payload,
    setItemInItemsById(state, item) {

        if (typeof item !== 'object') {
            item = JSON.parse(item);
        }

        if (item.hasOwnProperty('id') && state.items.hasOwnProperty(item['id'])) {
            // On utilise Object.assign, ce qui mettra à jour seulement les attributs en commun
            // On ne perd pas les autres attributs
            Object.assign(state.items[item['id']], item);
        }
    },
    setLoadingDatas(state, loading) {
        state.loadingDatas = loading;
    },
    setUpdateDatabase(state, updateDatabase) {
        state.updateDatabase = updateDatabase;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};