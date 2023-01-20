import { createStore } from 'vuex';
import sessionStore from './modules/sessionStore';

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        sessionStore,
    },
    strict: debug,
});

export default store;
