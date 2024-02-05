import { createStore } from "vuex";
import sessionStore from "./modules/sessionStore";
import votesStore from "./modules/votesStore";
import usersStore from "./modules/usersStore";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    sessionStore,
    votesStore,
    usersStore,
  },
  strict: debug,
});

export default store;
