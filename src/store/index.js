import { createStore } from "vuex";
import sessionStore from "./modules/sessionStore";
import votesStore from "./modules/votesStore";
import usersStore from "./modules/usersStore";
import feedStore from "./modules/feedStore";
import profilStore from "./modules/profilStore";
import documentsStore from "./modules/documentsStore";

const debug = process.env.NODE_ENV !== "production";

const store = createStore({
  modules: {
    sessionStore,
    votesStore,
    usersStore,
    profilStore,
    feedStore,
    documentsStore,
  },
  strict: debug,
});

export default store;
