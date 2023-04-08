<template>
  <div class="flex" v-if="isAdmin || isTeamLead">
    <div class="form-group">
      <h1>Add expenses</h1>
      <form class="form-group border">
        <label for="select-field">Select Project:</label>
        <select id="select-field" v-model="selectedProject">
          <option
            v-for="(team, index) in allTeamsAndProjects.onlyProjecsts"
            :key="index"
            :value="team"
          >
            {{ team.projectName }}
          </option>
        </select>
        <label style="margin-top: 20px" for="number-field">Money spent:</label>
        <input type="number" id="number-field" v-model="numberValue" />
        <label style="margin-top: 20px" for="reason-field">Reason:</label>
        <input type="text" id="reason-field" v-model="reason" />
        <div
          class="blue-button"
          style="margin-top: 10px"
          @click="
            addExpenses(
              allTeamsAndProjects,
              selectedProject,
              numberValue,
              reason
            )
          "
        >
          Submit
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";
import store from "@/store.js";
import moment from "moment";

export default {
  name: "RoleForm",
  props: ["isAdmin", "isTeamLead", "isUser", "allTeamsAndProjects", "rights"],
  data() {
    return {
      selectedProject: null,
      numberValue: null,
      reason: "",
    };
  },
  methods: {
    getTeams() {
      this.$emit("call-get-teams");
    },
    async addExpenses(
      allTeamsAndProjects,
      selectedProject,
      numberValue,
      reason
    ) {
      if (parseInt(numberValue, 10) < 0) {
        this.$alert("Cannot input negative numbers.", "Warning", "warning");
        return;
      }
      if (!selectedProject || !numberValue || reason === "") {
        this.$alert("Fields cannot be empty.", "Warning", "warning");
        return;
      }

      const team = allTeamsAndProjects.teamsWithProjects.find((team) =>
        team.projects.some(
          (project) =>
            project.projectName === selectedProject.projectName &&
            project.projectBudget === selectedProject.projectBudget
        )
      );

      if (!team) {
        return;
      }

      const project = team.projects.find(
        (project) =>
          project.projectName === selectedProject.projectName &&
          project.projectBudget === selectedProject.projectBudget
      );

      if (!project) {
        return;
      }

      if (parseInt(numberValue, 10) > project.projectBudget) {
        this.$alert("Number too large.", "Warning", "warning");
        return;
      }

      let spentMoney = 0;
      for (const expense of project.expenses) {
        spentMoney += expense.amount;
      }

      if (spentMoney + parseInt(numberValue, 10) > project.projectBudget) {
        this.$alert("Insufficient funds.", "Warning", "warning");
        return;
      }

      db.collection("teams")
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            console.warn("error");
            return;
          }
          let teamId;
          snapshot.forEach((doc) => {
            const teamFromDB = doc.data();
            if (
              teamFromDB.name === team.teamName &&
              teamFromDB.budget === team.teamBudget
            ) {
              teamId = doc.id;
            }
          });
          const projectIndex = team.projects.indexOf(project);
          db.collection("teams")
            .doc(teamId)
            .get()
            .then((doc) => {
              const updatedTeam = doc.data();
              const time = moment().format("DD MM YYYY");
              updatedTeam.projects[projectIndex].expenses.push({
                amount: parseInt(numberValue, 10),
                reason: reason,
                moment: time,
              });

              db.collection("teams").doc(teamId).set(updatedTeam);
              this.getTeams();
              this.$alert("Expense added", "Success", "success");
            });
        });
      this.selectedProject = null;
      this.numberValue = null;
      this.reason = "";
    },
  },
  computed: {
    signedUser() {
      return store.currentUser;
    },
  },
};
</script>

<style scoped>
.blue-button {
  display: block;
  width: 30%;
  padding: 10px;
  text-align: center;
  background-color: rgba(41, 133, 133, 0.3);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.border {
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
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
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>