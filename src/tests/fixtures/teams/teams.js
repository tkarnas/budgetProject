import { fixture, test } from 'testcafe';
import TeamsPage from '../../page-model/TeamsPage';
import LoginPage from '../../page-model/LoginPage';

fixture('TEAMS AND PROJECTS')
    .page('http://localhost:8080/')
    .meta({ author: 'Tomislav' })
    .beforeEach(async (t) =>
    {
        await LoginPage.login()
        await t.wait(10000)
    })
    .afterEach(async (t) =>
    {
        await LoginPage.logout()
    });

test('Create random team', async (t) =>
{
    await t.expect(TeamsPage.addTeam.exists).ok()
        .click(TeamsPage.addTeam)

    const randomNum = Math.floor(Math.random()*(9999-100+1)+100);

    await t.typeText(TeamsPage.inputTeamName, `Team ${randomNum}`, { paste: true })
        .typeText(TeamsPage.inputTeamBudget, randomNum, { paste: true });
    await t.expect(TeamsPage.submitAddTeamButton.exists).ok()
        .click(TeamsPage.submitAddTeamButton)
    // expect team
});

test('Create random project', async (t) =>
{
    await t.expect(TeamsPage.addProject.exists).ok()

    const randomNum = Math.floor(Math.random()*(9999-100+1)+100);
    const randomBudget = Math.floor(Math.random()*(999-100+1)+100);

    await t.typeText(TeamsPage.inputProjectName, `Project ${randomNum}`, { paste: true })
        .typeText(TeamsPage.inputProjectBudget, randomBudget, { paste: true });
    await t.expect(TeamsPage.submitAddProjectButton.exists).ok()
        .click(TeamsPage.submitAddProjectButton)
    // expect project
});