import { Selector, t } from 'testcafe';

class UsersPage
{
    constructor()
    {
        this.setRolesForm = Selector('*').withAttribute('ref_testcafe', 'setRolesForm');
    }
}

export default new UsersPage();
