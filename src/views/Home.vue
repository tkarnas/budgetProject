<template>
  <div ref_testcafe="home">
    <div class="flex" v-if="isAdmin || isTeamLead">
      <button
        class="button"
        :class="{ clicked: expandRoleForm }"
        v-if="isAdmin"
        @click="expandRoleForm = !expandRoleForm;expandCreateForm=false;expandExpensesForm=false"
        ref_testcafe="setRolesForm"
      >
        Set roles
      </button>
      <button
        class="button"
        :class="{ clicked: expandExpensesForm }"
        @click="expandExpensesForm = !expandExpensesForm;expandCreateForm=false;expandRoleForm=false"
        ref_testcafe="addExpensesForm"
      >
        Add new expenses
      </button>
      <button
        v-if="isAdmin"
        class="button"
        :class="{ clicked: expandCreateForm }"
        @click="expandCreateForm = !expandCreateForm;expandExpensesForm=false;expandRoleForm=false"
        ref_testcafe="addTeamForm"
      >
        Add team
      </button>
    </div>
    <div class="boxes">
      <div class="box" v-if="expandRoleForm">
        <RoleForm
          :rights="rights"
          :isAdmin="isAdmin"
          @call-get-teams="getTeams"
          :allTeamsAndProjects="allTeamsAndProjects"
        ></RoleForm>
      </div>
      <div class="box" v-if="expandExpensesForm">
        <ExpensesForm
          :rights="rights"
          :isAdmin="isAdmin"
          :isTeamLead="isTeamLead"
          :isUser="isUser"
          :allTeamsAndProjects="allTeamsAndProjects"
          @call-get-teams="getTeams"
        ></ExpensesForm>
      </div>
      <div class="box" v-if="expandCreateForm">
        <TeamForm
          :rights="rights"
          :isAdmin="isAdmin"
          @call-get-teams="getTeams"
        ></TeamForm>
      </div>
    </div>
    <Teams
      :rights="rights"
      :isAdmin="isAdmin"
      :isTeamLead="isTeamLead"
      :isUser="isUser"
      :teamsArr="teamsArr"
      @call-get-teams="getTeams"
    ></Teams>
  </div>
</template>

<script>
import { db } from "@/firebase";
import store from "@/store.js";
import RoleForm from "../components/RoleForm.vue";
import TeamForm from "../components/TeamForm.vue";
import ExpensesForm from "../components/ExpensesForm.vue";
import Teams from "../components/Teams.vue";

export default {
  name: "HomeComponent",
  components: {
    ExpensesForm,
    TeamForm,
    RoleForm,
    Teams,
  },
  data() {
    return {
      isAdmin: false,
      isTeamLead: false,
      isUser: false,
      teamsArr: [],
      expandRoleForm: false,
      expandCreateForm: false,
      expandExpensesForm: false,
    };
  },
  created() {
    this.setPageByRoles();
    this.getTeams();
  },
  computed: {
    allTeamsAndProjects() {
      let arr = {};
      const arr2 = [];
      const arr3 = [];
      for (const team of this.teamsArr) {
        let project = {
          teamName: team.teamName,
          teamBudget: team.teamBudget,
          projects: team.projects,
          teamlead: team.teamlead,
        };
        arr2.push(project);
        if (team.projects.length) {
          for (const project of team.projects) {
            arr3.push(project);
          }
        }
      }
      arr = {
        teamsWithProjects: arr2,
        onlyProjecsts: arr3,
      };
      return arr;
    },
    rights() {
      let rights;
      if (this.isAdmin) {
        rights = "Admin";
      } else if (this.isTeamLead) {
        rights = "Team Lead";
      } else if (this.isUser) {
        rights = "User";
      }
      return rights;
    },
  },
  methods: {
    setPageByRoles() {
      db.collection("users")
        .get()
        .then((query) => {
          const users = [];
          query.forEach((doc) => {
            const data = doc.data();
            users.push({
              data,
            });
            for (const user of users) {
              if (user.data.user === store.currentUser) {
                if (user.data.isAdmin) {
                  this.isAdmin = true;
                } else if (user.data.isTeamLead) {
                  this.isTeamLead = true;
                } else {
                  this.isUser = true;
                }
              }
            }
          });
        });
    },
    async getTeams() {
      db.collection("teams")
        .get()
        .then((query) => {
          this.teamsArr = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.teamsArr.push({
              teamName: data.name,
              teamBudget: data.budget,
              teamlead: data.teamlead,
              projects: data.projects,
            });
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
div {
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
}

.box {
  width: 33%;
  padding: 10px;
  border-radius: 10px;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
}

.boxes {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.flex {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.expanded {
  background-color: lightgray;
}

.button {
  width: 20%;
  background-color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
}

.button {
  &:hover {
    background-color: lightgray;
    &::after {
      content: "";
      display: block;
      width: 20%;
      margin: 0 auto;
      height: 3px;
      background-color: lightgray;
    }
  }
  &:focus {
    outline: none;
  }
}

.clicked {
  &::after {
    content: "";
    display: block;
    width: 20%;
    margin: 0 auto;
    height: 3px;
    background-color: rgba(250, 64, 64, 0.596);
  }
}
</style>