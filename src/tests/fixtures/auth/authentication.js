import { fixture, test } from 'testcafe';
import LoginPage from '../../page-model/LoginPage';

fixture('AUTHENTICATION')
    .page('http://localhost:8080/')
    .meta({ author: 'Tomislav' })

test('Unsuccessful login', async (t) =>
{
    await t.expect(LoginPage.inputUsername.exists).ok()
        .expect(LoginPage.inputPassword.exists).ok()
        .typeText(LoginPage.inputUsername, 'ShouldntExist', { paste: true })
        .typeText(LoginPage.inputPassword, 'password123', { paste: true });
    await t.setNativeDialogHandler(() => true);
    await t.click(LoginPage.loginButton)
});

test('Sucessful login and logout', async (t) =>
{
    await t.expect(LoginPage.inputUsername.exists).ok()
        .expect(LoginPage.inputPassword.exists).ok()
        .typeText(LoginPage.inputUsername, 'admin@admin.com', { paste: true })
        .typeText(LoginPage.inputPassword, 'test123', { paste: true });
    await t.click(LoginPage.loginButton)
        .expect(LoginPage.home.exists).ok();
});

test('Sucessful register user', async (t) =>
{
    if (await LoginPage.hamburgerMenu.exists)
    {
        await t.click(LoginPage.hamburgerMenu)
    }
    await t.click(LoginPage.register)
    const randomNum = Math.floor(Math.random()*(9999-100+1)+100);
    await t.typeText(LoginPage.inputUsername, `test${randomNum}@test.com`, { paste: true })
        .typeText(LoginPage.inputPassword, 'test123', { paste: true })
        .typeText(LoginPage.repeatPassword, 'test123', { paste: true })
        .click(LoginPage.signupButton)
    await t.expect(LoginPage.home.exists).ok();
});
