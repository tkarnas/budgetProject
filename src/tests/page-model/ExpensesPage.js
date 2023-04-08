import { Selector, t } from 'testcafe';

class ExpensesPage
{
    constructor()
    {
        this.addExpensesForm = Selector('*').withAttribute('ref_testcafe', 'addExpensesForm');
    }

}

export default new ExpensesPage();
