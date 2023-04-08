<template>
  <div>
    <!-- // check -->
    <div v-if="(isAdmin || isTeamLead || isUser) && !noProjectsModal">
      <div class="teams-container" v-for="(team, teamIndex) in teamsArr" :key="teamIndex">
        <div class="team" v-if="teamLeadCanSee(team) || userCanSee(team)">
          <h3 v-if="isAdmin || isTeamLead">
            {{ team.teamName }} - Budget is {{ team.teamBudget }} €
            <s v-if="spentMoney(team) !== 0">{{ spentMoney(team) }} €</s>
          </h3>
          <h3 v-if="(isAdmin || isTeamLead) && team.teamlead !== ''">
            Teamlead is {{ team.teamlead }}
          </h3>
          <h3 v-else-if="(isAdmin || isTeamLead) && team.teamlead === ''">
            There is no teamlead currently
          </h3>
          <ProjectForm @call-get-teams="getTeams" :isAdmin="isAdmin" :isTeamLead="isTeamLead" :isUser="isUser" :team="team"></ProjectForm>
          <Projects
            :teamIndex="teamIndex"
            :teams="teamsArr"
            :rights="rights"
            :isAdmin="isAdmin"
            :isTeamLead="isTeamLead"
            :isUser="isUser"
            :team="team"
            @call-get-teams="getTeams"
            @no-projects="showNoProjectsWindow"
          ></Projects>
        </div>
      </div>
    </div>
    <div class="teams-container" v-if="noProjectsModal">
      Currently there is no projects or teams for you to see, contact
      administrators.
    </div>
  </div>
</template>

<script>
import ProjectForm from "../components/ProjectForm.vue";
import Projects from "../components/Projects.vue";
import { db } from "@/firebase";
import store from "@/store.js";

export default {
  name: "Teams",
  components: {
    Projects,
    ProjectForm,
  },
  props: ["isAdmin", "isTeamLead", "isUser", "teamsArr", "rights"],
  data() {
    return {
      noProjectsModal: false,
    };
  },
  computed: {
    signedUser() {
      return store.currentUser;
    },
  },
  methods: {
    userCanSee(team)
    {
      for (const project of team.projects){
        for(const pep of project.people){
          if (pep === this.signedUser){
            return true;
          }
        }
      }
    },
    showNoProjectsWindow() {
      this.noProjectsModal = true;
    },
    getTeams() {
      this.$emit("call-get-teams");
    },
    teamLeadCanSee(team) {
      if (this.rights === "Admin") {
        return true;
      }
      if (team.teamlead !== null && team.teamlead === this.signedUser) {
        return true;
      }
      // if (this.rights === "Team Lead" && team.teamlead === this.signedUser) {
      //   return true;
      // }
      return false;
    },
    spentMoney(team) {
      let spentMoney = 0;
      for (const project of team.projects) {
        if (project && project.expenses && project.expenses.length) {
          for (const spent of project.expenses) {
            spentMoney += spent.amount;
          }
        }
      }
      return spentMoney;
    },
  },
};
</script>

<style scoped>
.teams-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  flex-wrap: wrap;
}

.team {
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 40%;
  padding: 20px;
  align-items: center;
  justify-content: center;
}
</style>