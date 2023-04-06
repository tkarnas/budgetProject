import { fixture, test } from 'testcafe';
import UsersPage from '../../page-model/UsersPage';
import LoginPage from '../../page-model/LoginPage';

fixture('USERS')
    .page('http://localhost:8080/')
    .meta({ author: 'Tomislav' })
    .beforeEach(async (t) =>
    {
        await LoginPage.login()
    })
    .afterEach(async (t) =>
    {
        await LoginPage.logout()
    });
    
test('Add user to project', async (t) =>
{

});

test('Add teamlead to team', async (t) =>
{

});