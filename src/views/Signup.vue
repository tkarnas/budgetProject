<template>
  <div class="about">
    <div class="container">
      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <form autocomplete=off>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                v-model="username"
              />
              <small id="emailHelp" class="form-text text-muted"
                >We'll never share your email with anyone else.</small
              >
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                v-model="password"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword2"> Repeat password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword2"
                placeholder="Password"
                v-model="passwordRepeat"
              />
            </div>
            <button type="button" @click="signup()" class="btn btn-primary" ref_testcafe="signupButton">
              Submit
            </button>
          </form>
        </div>
        <div class="col-sm"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  color: white;
}
</style>

<script>
import { db, firebase } from "@/firebase.js";

export default {
  name: "SignupComponent",
  data() {
    return {
      username: "",
      password: "",
      passwordRepeat: "",
    };
  },
  methods: {
    signup() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .catch(function (error) {
          this.$alert(error, "Error", "error")
        });

        db.collection("users")
        .add({ user: this.username, isUser: true })
        .catch((error) => {
          this.$alert(error, "Error", "error");
        });
    },
  },
};
</script>
