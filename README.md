# moneydashboard-api

[![Deploy Github Page](https://github.com/ileodo/moneydashboard-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/ileodo/moneydashboard-api/actions/workflows/node.js.yml)


![npm type definitions](https://img.shields.io/npm/types/moneydashboard-api)
![NPM](https://img.shields.io/npm/l/moneydashboard-api)
[![npm](https://img.shields.io/npm/v/moneydashboard-api)](https://www.npmjs.com/package/moneydashboard-api)
![npm](https://img.shields.io/npm/dw/moneydashboard-api)

<a href="https://www.buymeacoffee.com/Ileodo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

A node.js version api for [Money Dashboard (Neon)](https://app.moneydashboard.com/login)


# Get Started

```bash
npm install moneydashboard-api
```

```javascript

import { MoneyDashboard } from 'moneydashboard-api'
const md = new MoneyDashboard();
md.login("USERNAME", "PASSWORD")
    .then((loginMd) => {
        loginMd.listCategories().then(categories => console.log(categories));
    });

```


# Contribution

All contributions are welcomed, especially the following aspects:

- Standardise the repo
- Standardise the build/test/linting process
