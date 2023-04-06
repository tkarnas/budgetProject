<template>
  <div class="flex">
    <div class="form-group" v-if="isAdmin">
      <h1>Set roles for users</h1>
      <form class="form-group border">
        <label for="select-field">Select role</label>
        <select id="select-field" v-model="role">
          <option value="isAdmin">Admin</option>
          <option value="isTeamLead">Teamlead</option>
          <option value="isUser">User</option>
        </select>
        <div
          v-if="role === 'isUser' && allTeamsAndProjects.onlyProjecsts.length"
        >
          <div>Add this user to project</div>
          <select id="select-field" v-model="userProject">
            <option
              v-for="(project, index) in allTeamsAndProjects.onlyProjecsts"
              :key="index"
              :value="project"
            >
              {{ project.projectName }}
            </option>
          </select>
        </div>
        <div
          v-if="
            role === 'isTeamLead' &&
            allTeamsAndProjects.teamsWithProjects.length
          "
        >
          <div>Add this team lead to team</div>
          <select id="select-field" v-model="userProject">
            <option
              v-for="(team, index) in allTeamsAndProjects.teamsWithProjects"
              :key="index"
              :value="team"
            >
              {{ team.teamName }}
            </option>
          </select>
        </div>
        <label for="reason-field">Select user</label>
        <select id="select-field" v-model="user">
          <option
            v-for="(user, index) in allUsersArr"
            :key="index"
            :value="user"
          >
            {{ user }}
          </option>
        </select>
        <div
          class="blue-button"
          style="margin-top: 10px"
          @click="setRole(user, role, userProject)"
        >
          Submit
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";

export default {
  name: "RoleForm",
  props: ["isAdmin", "allTeamsAndProjects", "rights"],
  data() {
    return {
      user: "",
      role: "",
      userProject: "",
      allUsersArr: [],
    };
  },
  created() {
    this.fetchAllUsers();
  },
  methods: {
    getTeams() {
      this.$emit("call-get-teams");
    },
    setRole() {
      if (!this.user || !this.role) {
        this.$alert("Fields cant be empty!", "Warning", "warning");
        return;
      }
      const user = this.user;

      const roleMap = {
        isAdmin: { isAdmin: true },
        isTeamLead: { isTeamLead: true },
        default: { isUser: true },
      };

      let found;
      for (const checkUser of this.allUsersArr) {
        if (checkUser === user) {
          found = true;
          // this.$alert("This user already exists!", "Warning", "warning");
          // return
        }
      }

      if (this.role === 'isUser' && (this.userProject === '' || this.userProject === undefined || this.userProject === null))
      {
        this.$alert("Cant add user to project becasue there projects doesnt exist", "Warning", "warning")
        return;
      }

      if (found) {
        db.collection("users")
          .get()
          .then((query) => {
            query.forEach((doc) => {
              const data = doc.data();
              if (user === data.user) {
                let previousRole = "isUser";
                if (data.isAdmin) {
                  previousRole = "isAdmin";
                } else if (data.isTeamLead) {
                  previousRole = "isTeamLead";
                }
                const userId = doc.id;
                db.collection("users")
                  .doc(userId)
                  .update({
                    [previousRole]: firebase.firestore.FieldValue.delete(),
                    [this.role]: true,
                    user: this.user,
                  });
                  if (this.role === "isTeamLead") {
                  db.collection("teams")
                    .where("name", "==", this.userProject.teamName)
                    .where("budget", "==", this.userProject.teamBudget)
                    .get()
                    .then((snapshot) => {
                      if (snapshot.empty) {
                        return;
                      }
                      snapshot.forEach((doc) => {
                        const teamId = doc.id;
                        db.collection("teams")
                          .doc(teamId)
                          .update({
                            teamlead: this.user,
                          })
                          .then(() => {
                            this.$alert("Added", "Success", "success")
                            this.getTeams()
                          })
                          .catch((error) => {
                            console.error("Error adding project:", error);
                          });
                      });
                    })
                    .catch((error) => {
                      console.error("Error getting team:", error);
                    });
                  }
                  else if (this.role === 'isUser')
                  {
                    db.collection("teams")
                  .get()
                  .then((snapshot) => {
                    if (snapshot.empty) {
                      console.warn("error");
                      return;
                    }
                    snapshot.forEach((doc) => {
                      const team = doc.data();
                      const teamId = doc.id;
                      for (const project of team.projects) {
                        if (
                          project.projectName ===
                            this.userProject.projectName &&
                          project.projectBudget ===
                            this.userProject.projectBudget
                        ) {
                          const projectIndex = team.projects.indexOf(project);

                          db.collection("teams")
                            .doc(teamId)
                            .get()
                            .then((doc) => {
                              const updatedTeam = doc.data();
                              updatedTeam.projects[projectIndex].people.push(
                                user
                              );

                              db.collection("teams")
                                .doc(teamId)
                                .set(updatedTeam);
                                this.$alert("Added", "Success", "success");
                                this.getTeams()
                            });
                        }
                      }
                    });
                  });
                  }
                }
            });
          });
      } else {
        const role = roleMap[this.role] || roleMap.default;
        if (this.role === "isUser") {
          for (const team of this.allTeamsAndProjects.teamsWithProjects) {
            for (const project of team.projects) {
              if (
                project.projectName === this.userProject.projectName &&
                project.projectBudget === this.userProject.projectBudget
              ) {
                db.collection("teams")
                  .get()
                  .then((snapshot) => {
                    if (snapshot.empty) {
                      console.warn("error");
                      return;
                    }
                    snapshot.forEach((doc) => {
                      const team = doc.data();
                      const teamId = doc.id;
                      for (const project of team.projects) {
                        if (
                          project.projectName ===
                            this.userProject.projectName &&
                          project.projectBudget ===
                            this.userProject.projectBudget
                        ) {
                          const projectIndex = team.projects.indexOf(project);

                          db.collection("teams")
                            .doc(teamId)
                            .get()
                            .then((doc) => {
                              const updatedTeam = doc.data();
                              updatedTeam.projects[projectIndex].people.push(
                                user
                              );

                              db.collection("teams")
                                .doc(teamId)
                                .set(updatedTeam);
                                this.$alert("Added", "Success", "success");
                                this.getTeams()
                            });
                        }
                      }
                    });
                  });
              }
            }
          }
        } else if (this.role === "isTeamLead") {
          db.collection("teams")
            .where("name", "==", this.userProject.teamName)
            .where("budget", "==", this.userProject.teamBudget)
            .get()
            .then((snapshot) => {
              if (snapshot.empty) {
                return;
              }
              snapshot.forEach((doc) => {
                const teamId = doc.id;
                db.collection("teams")
                  .doc(teamId)
                  .update({
                    teamlead: this.user,
                  })
                  .then(() => 
                  {
                    this.$alert("Added", "Success", "success")
                    this.getTeams()
                  })
                  .catch((error) => {
                    console.error("Error adding project:", error);
                  });
              });
            })
            .catch((error) => {
              console.error("Error getting team:", error);
            });
        }
        db.collection("users")
          .add({ user: this.user, ...role })
          .then(() => {
            const roleMap = {
              isAdmin: "admin",
              isTeamLead: "teamlead",
              default: "user",
            };
            const rola = roleMap[this.role] || roleMap.default;
            this.$alert(
              `User ${this.user} is set as ${rola}`,
              "Success",
              "success"
            );
            this.user = "";
            this.role = "";
            this.getTeams();
          })
          .catch((error) => {
            this.$alert(error, "Error", "error");
          });
      }
    },
    fetchAllUsers() {
      db.collection("users")
        .get()
        .then((query) => {
          query.forEach((doc) => {
            const data = doc.data();
            const user = data.user;
            this.allUsersArr.push(user);
          });
        });
    },
  },
};
</script>

<style scoped>
.blue-button {
  display: block;
  width: 40%;
  padding: 10px 0;
  text-align: center;
  background-color: rgba(41, 133, 133, 0.3);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
}

.border {
  border: 1px solid black;
  border-radius: 10px;
  height: 100%;
  padding: 10px;
  margin: 10px;
  background-color: rgba(0, 0, 0, 0.1);
}

.flex {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
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
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>