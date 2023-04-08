import { Selector, t } from 'testcafe';

class TeamsPage
{
    constructor()
    {
        this.addTeam = Selector('*').withAttribute('ref_testcafe', 'addTeamForm');
        this.addProject = Selector('*').withAttribute('ref_testcafe', 'addProjectForm');
        this.inputTeamName = Selector('*').withAttribute('id', 'teamName');
        this.inputTeamBudget = Selector('*').withAttribute('id', 'teamBudget');
        this.inputProjectName = Selector('*').withAttribute('id', 'projectName');
        this.inputProjectBudget = Selector('*').withAttribute('id', 'projectBudget');
        this.submitAddTeamButton = Selector('*').withAttribute('ref_testcafe', 'submitAddTeamButton');
        this.submitAddProjectButton = Selector('*').withAttribute('ref_testcafe', 'submitAddProjectButton');
    }
}

export default new TeamsPage();
