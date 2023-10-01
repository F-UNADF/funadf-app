import { createStore } from 'vuex';
import sessionStore from './modules/sessionStore';
import votesStore from './modules/votesStore';

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        sessionStore,
        votesStore,
    },
    namespaced: true,
    strict: debug,
});

export default store;
