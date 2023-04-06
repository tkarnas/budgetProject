import { fixture, test } from 'testcafe';
import ExpensesPage from '../../page-model/ExpensesPage';
import LoginPage from '../../page-model/LoginPage';

fixture('EXPENSES')
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

test('Add expenses to random project', async (t) =>
{

});