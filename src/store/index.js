import {createStore} from 'vuex';
import session from './modules/sessionStore'

const debug = process.env.NODE_ENV !== 'production';

const store = createStore({
    modules: {
        session,
    },
    strict : debug,
});

export default store;
