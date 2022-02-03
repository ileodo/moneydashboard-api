# moneydashboard-api
A node.js version api for money dashboard

## Example Usage

```javascript

import { MoneyDashboard } from 'moneydashboard-api'
const md = new MoneyDashboard();
md.login("USERNAME", "PASSWORD")
    .then((loginMd) => {
        loginMd.listCategories().then(categories => console.log(categories));
    });

```