import {MoneyDashboard} from '../../src/index';

test('login failed when no username and password', () => {
    const md = new MoneyDashboard("");
    return md.login("", "").catch((e: any) => expect(e));

});

