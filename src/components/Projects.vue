<template>
  <div>
    <ul v-if="isAdmin || isTeamLead || isUser">
      <li v-for="(project, projectIndex) in team.projects" :key="projectIndex">
        <div class="projects" v-if="userCanSee(project)">
          Project Name: {{ project.projectName }}
          <div v-if="!isUser">
            Project Budget: {{ project.projectBudget }} €
            <br />
            <b
              >Left:
              {{
                project.projectBudget -
                project.expenses.reduce((a, b) => a + (b["amount"] || 0), 0)
              }}
              €</b
            >
          </div>
          <div
            class="button"
            v-if="project.expenses.length && !isUser"
            @click="isClicked = !isClicked"
          >
            Check expenses
            <div v-if="isClicked">
              <div v-for="(expense, index) in project.expenses" :key="index">
                {{ expense.moment }} - {{ expense.amount }} € - Reason:
                {{ expense.reason }}
              </div>
            </div>
          </div>
          <div
            class="expand"
            v-if="project.people.length"
            @click="isClicked2 = !isClicked2"
          >
            Project members
            <div v-if="isClicked2">
              <div v-for="(people, index) in project.people" :key="index">
                {{ people }}
              </div>
            </div>
          </div>
          <div v-if="!isUser">
            <Graph :project="project"></Graph>
          </div>
          <div
            class="red-button"
            v-if="isAdmin"
            @click="deleteProject(teamIndex, projectIndex, project)"
          >
            Delete
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
import Graph from "../components/Graph.vue";
import { db } from "@/firebase";
import store from "@/store.js";

export default {
  name: "RoleForm",
  components: {
    Graph,
  },
  props: [
    "isAdmin",
    "isTeamLead",
    "isUser",
    "team",
    "rights",
    "teamIndex",
    "teams",
  ],
  data() {
    return {
      isClicked: false,
      isClicked2: false,
    };
  },
  methods: {
    getTeams() {
      this.$emit("call-get-teams");
    },
    showNoProjectsWindow() {
      this.$emit("no-projects");
    },
    userCanSee(project) {
      if (this.rights === "Admin" || this.rights === "Team Lead") {
        return true;
      }
      if (project.people && project.people.length) {
        let found;
        for (const user of project.people) {
          if (user === this.signedUser) {
            found = true;
            if (!found) {
              this.showNoProjectsWindow();
            }
          }
          return true;
        }
      }
      return false;
    },
    deleteProject(teamIndex, projectIndex, project) {
      this.$confirm("Are you sure?").then(() => {
        const team = this.teams[teamIndex];
        db.collection("teams")
          .where("name", "==", team.teamName)
          .where("budget", "==", team.teamBudget)
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              return;
            }
            snapshot.forEach((doc) => {
              const teamId = doc.id;
              let projects = doc.data().projects;
              projects = projects.filter(
                (project, index) => index !== projectIndex
              );
              db.collection("teams")
                .doc(teamId)
                .update({
                  projects: projects,
                })
                .then(() => {
                  this.$alert(
                    `Project ${project.projectName} deleted`,
                    "Success",
                    "success"
                  );
                  this.getTeams();
                })
                .catch((error) => {
                  this.$alert(error, "Error", "error");
                });
            });
          })
          .catch((error) => {
            this.$alert(error, "Error", "error");
          });
      });
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
.red-button {
  display: block;
  padding-left: 15px;
  width: 30%;
  background-color: rgba(255, 0, 0, 0.13);
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
  border: 1px solid black;
}

.button {
  display: block;
  padding-left: 15px;
  width: 30%;
  background-color: rgba(136, 238, 69, 0.288);
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
  border: 1px solid black;
}

.expand {
  display: block;
  padding-left: 15px;
  width: 30%;
  background-color: rgba(43, 146, 172, 0.438);
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px;
  border: 1px solid black;
}

.projects {
  margin-top: 20px;
  background-color: rgba(240, 230, 140, 0.2);
  max-width: 100%;
  border: 1px solid black;
  border-radius: 4px;
  padding: 5px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 10px 0;
}
</style>