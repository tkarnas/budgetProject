<template>
  <div class="flex">
    <div class="form-group">
      <h1>Add new team</h1>
      <form class="form-group border" v-if="isAdmin" autocomplete="off">
        <label for="teamName">Team Name</label>
        <input
          type="text"
          id="teamName"
          v-model="teamName"
          placeholder="Enter team name"
        />
        <label for="teamBudget">Team budget</label>
        <input
          type="number"
          id="teamBudget"
          v-model="teamBudget"
          placeholder="Enter team budget"
        />
        <button
          class="blue-button"
          style="margin-top: 10px"
          type="submit"
          @click.prevent="addTeam"
          ref_testcafe="submitAddTeamButton"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";

export default {
  name: "RoleForm",
  props: ["isAdmin", "rights"],
  data() {
    return {
      teamName: "",
      teamBudget: null,
    };
  },
  methods: {
    getTeams() {
      this.$emit("call-get-teams");
    },
    addTeam() {
      if (
        this.teamName !== "" &&
        this.teamBudget !== "" &&
        this.teamName != null &&
        this.teamBudget != null
      ) {
        if (typeof parseInt(this.teamBudget, 10) === "number") {
          db.collection("teams")
            .add({
              name: this.teamName,
              budget: this.teamBudget,
              teamlead: "",
              projects: [],
            })
            .then((doc) => {
              this.getTeams();
              this.$alert(
                `New team ${this.teamName} added`,
                "Success",
                "success"
              );
              this.teamName = "";
              this.teamBudget = "";
            })
            .catch((error) => {
              this.$alert(error, "Error", "error");
            });
        } else {
          this.$alert("Budget needs to be number", "Warning", "warning");
        }
      } else {
        this.$alert("Cant submit empty fields", "Warning", "warning");
      }
    },
  },
};
</script>

<style scoped>
.blue-button {
  display: block;
  width: 40%;
  padding: 10px;
  background-color: rgba(41, 133, 133, 0.3);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
}

.flex {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}

.border {
  border: 1px solid black;
  border-radius: 10px;
  height: 100%;
  padding: 10px;
  margin: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  height: 97%;
  width: 80%;
  justify-content: space-evenly;
  align-items: center;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin: 0px 20px;
}

.form-group input {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group select {
  display: block;
  width: 40%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>