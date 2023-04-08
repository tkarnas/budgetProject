<template>
  <div>
    <form v-if="isAdmin || isTeamLead">
        <div class="form-group" ref_testcafe="addProjectForm">
            <label for="projectName">Project Name</label>
            <input
            type="text"
            id="projectName"
            v-model="projectName"
            placeholder="Enter project name"
            />
            <label for="projectBudget">Project budget</label>
            <input
            type="number"
            id="projectBudget"
            v-model="projectBudget"
            placeholder="Enter project budget"
            />
        </div>
        <button
            class="blue-button"
            type="submit"
            @click.prevent="addProject(team)"
            ref_testcafe="submitAddProjectButton"
        >
            Add Project
        </button>
        <button
            class="red-button"
            type="submit"
            v-if="isAdmin"
            @click.prevent="deleteTeam(team)"
        >
            Delete Team
        </button>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase";

export default {
  name: "ProjectForm",
  props: ["isAdmin", "isTeamLead", "isUser", "team"],
  data() {
    return {
      projectName: "",
      projectBudget: null,
    };
  },
  methods:
  {
    getTeams() {
      this.$emit("call-get-teams");
    },
    async addProject(team) {
      if (
        this.projectName != null &&
        this.projectBudget != null &&
        this.projectName != "" &&
        this.projectBudget != ""
      ) {
        if (typeof parseInt(this.projectBudget, 10) === "number") {
          if (parseInt(this.projectBudget, 10) > team.teamBudget) {
            this.$alert("Number over the budget", "Warning", "warning");
            return;
          }
          let projectAlreadyLost = 0;
          for (const project of team.projects) {
            projectAlreadyLost += parseInt(project.projectBudget, 10);
          }
          if (
            projectAlreadyLost + parseInt(this.projectBudget, 10) >
            team.teamBudget
          ) {
            this.$alert("insufficient funds", "Warning", "warning");
            return;
          }

          db.collection("teams")
            .where("name", "==", team.teamName)
            .where("budget", "==", team.teamBudget)
            .get()
            .then((snapshot) => {
              if (snapshot.empty) {
                return;
              }
              snapshot.forEach((doc) => {
                const projectId = doc.id;
                let projects = doc.data().projects;
                projects.push({
                  projectName: this.projectName,
                  projectBudget: this.projectBudget,
                  expenses: [],
                  people: [],
                });
                db.collection("teams")
                  .doc(projectId)
                  .update({
                    projects: projects,
                  })
                  .then(() => {
                    this.getTeams();
                    this.$alert(
                      `New project ${this.projectName} added`,
                      "Success",
                      "success"
                    );
                    this.projectName = "";
                    this.projectBudget = "";
                  })
                  .catch((error) => {
                    console.error("Error adding project:", error);
                  });
              });
            })
            .catch((error) => {
              console.error("Error getting team:", error);
            });
        } else {
          this.$alert("Budget needs to be number", "Warning", "warning");
        }
      } else {
        this.$alert("Cant submit empty fields", "Warning", "warning");
      }
    },
    deleteTeam(team) {
      this.$confirm("Are you sure?").then(() => {
        db.collection("teams")
          .get()
          .then((query) => {
            query.forEach((doc) => {
              const data = doc.data();
              const id = doc.id;
              if (
                data.name === team.teamName &&
                data.budget === team.teamBudget
              ) {
                db.collection("teams")
                  .doc(id)
                  .delete()
                  .then(() => {
                    this.$alert(
                      `Team ${team.teamName} deleted`,
                      "Success",
                      "success"
                    );
                    this.getTeams();
                  })
                  .catch((error) => {
                    console.error("Error removing team: ", error);
                  });
              }
            });
          });
      });
    },
  }
};
</script>

<style scoped>

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
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
  width: 30%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.blue-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: rgba(41, 133, 133, 0.3);
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
}

.red-button {
  display: block;
  width: 40%;
  background-color: rgba(255, 0, 0, 0.25);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
  border: 1px solid black;
}
</style>