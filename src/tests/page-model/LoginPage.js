import { Selector, t } from 'testcafe';

class LoginPage
{
    constructor()
    {
        this.inputUsername = Selector('*').withAttribute('id', 'exampleInputEmail1');
        this.inputPassword = Selector('*').withAttribute('id', 'exampleInputPassword1');
        this.repeatPassword = Selector('*').withAttribute('id', 'exampleInputPassword2');
        this.loginButton = Selector('*').withAttribute('ref_testcafe', 'loginButton');
        this.signupButton = Selector('*').withAttribute('ref_testcafe', 'signupButton');
        this.logoutButton = Selector('*').withAttribute('ref_testcafe', 'logoutButton');
        this.home = Selector('*').withAttribute('ref_testcafe', 'home');
        this.login = Selector('*').withAttribute('ref_testcafe', 'login');
        this.register = Selector('*').withAttribute('ref_testcafe', 'register');
        this.hamburgerMenu = Selector('*').withAttribute('ref_testcafe', 'hamburgerMenu');
    }

    async login()
    {
        await t.expect(this.inputUsername.exists).ok()
            .expect(this.inputPassword.exists).ok()
            .typeText(this.inputUsername, 'admin@admin.com', { paste: true })
            .typeText(this.inputPassword, 'test123', { paste: true });
        await t.click(this.loginButton)
            .expect(this.home.exists).ok();
    }
    
    async logout()
    {
        await t.click(this.logoutButton)
            .expect(this.inputUsername.exists).ok()
            .expect(this.inputPassword.exists).ok();
    }
}

export default new LoginPage();
