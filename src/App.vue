<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-lg navbar-light">
      <a class="navbar-brand" href="/"> </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
      >
        <span class="navbar-toggler-icon" ref_testcafe="hamburgerMenu"></span>
      </button>
      <div class="flex collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="flex navbar-nav mr-auto">
          <li v-if="!currentUser" class="nav-item" ref_testcafe="login">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!currentUser" class="nav-item" ref_testcafe="register">
            <router-link class="nav-link" to="/signup">Signup</router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <a href="#" @click.prevent="logout()" class="nav-link" ref_testcafe="logoutButton">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.flex {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    background-color: white !important;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import store from "@/store.js";
import { firebase } from "@/firebase.js";
import router from "@/router";
import { db } from "@/firebase";

firebase.auth().onAuthStateChanged((user) => {
  const currentRoute = router.currentRoute;
  if (user) {
    store.currentUser = user.email;
    if (!currentRoute.meta.needsUser) {
      router.push({ name: "Home" });
    }
  } else {
    store.currentUser = null;
    if (currentRoute.meta.needsUser) {
      router.push({ name: "Login" });
    }
  }
});

export default {
  data() {
    return store;
  },
  async created() {
    const usersRef = db.collection("users");
    usersRef.onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        const user = doc.data();
        const userRole = doc.data();
        if (store.currentUser === user.user) {
          let userRola;
          if (userRole.isAdmin) {
            userRola = "admin";
          } else if (userRole.isTeamLead) {
            userRola = "teamlead";
          } else {
            userRola = "user";
          }
        }
      });
    });
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    },
  },
};
</script>
