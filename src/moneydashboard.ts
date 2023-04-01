import axios from 'axios'
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'
import moment from 'moment'
import { plainToInstance } from 'class-transformer'
import { Account } from './model/account'
import { Transaction } from './model/transaction'
import { Budget } from './model/budget'
import { Category } from './model/category'

const AWS_COGNITO_CONFIG = {
  IDENTITY_POOL_ID: 'eu-west-2:f739e3a9-95bb-4bd9-8238-d9a6777ffeac',
  USER_POOLS_ID: 'eu-west-2_oXtK9cXqF',
  USER_POOLS_CLIENT_ID: 'vj841jhgqv528ogqu71397g4',
  REGION: 'eu-west-2'
}

const API_ENDPOINT = 'https://neonapiprod.moneydashboard.com/v1'

/**
 * A MoneyDashboard API (Neon Version)
 */
export class MoneyDashboard {
  accessToken: string

  /**
     *
     * @param token
     */
  constructor (token: string = '') {
    this.accessToken = token
  }

  /**
     *
     * Logs in using the provided credentials
     *
     * @param username MoneyDashboard username
     * @param password MoneyDashboard password
     * @return {Promise<MoneyDashboard>} return the Moneydashbord hanle `this`
     */
  async login (username: string, password: string): Promise<MoneyDashboard> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this: this = this

    return await new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      })

      const userPool = new CognitoUserPool({
        UserPoolId: AWS_COGNITO_CONFIG.USER_POOLS_ID,
        ClientId: AWS_COGNITO_CONFIG.USER_POOLS_CLIENT_ID
      })

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      })

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: AWS_COGNITO_CONFIG.IDENTITY_POOL_ID,
            Logins: {
              [`cognito-idp.${AWS_COGNITO_CONFIG.REGION}.amazonaws.com/${AWS_COGNITO_CONFIG.USER_POOLS_ID}`]: result
                .getIdToken()
                .getJwtToken()
            }
          })
          _this.accessToken = result.getIdToken().getJwtToken()
          resolve(_this)
        },
        onFailure: function (err) {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          console.log(err.message || JSON.stringify(err))
          reject(err)
        }
      })
    })
  }

  /**
     * Get a lis of accounts attached to the current login user.
     *
     * @returns  {Promise<Account[]} a list of Account under the login user
     */
  async listAccounts (): Promise<Account[]> {
    const endPoint = `${API_ENDPOINT}/accounts`
    console.log(`getAccounts: GET ${endPoint}`)

    const response = await axios.get(endPoint, {
      headers: {
        accept: '*/*',
        'x-auth': this.accessToken
        // 'Referer': 'https://app.moneydashboard.com/',
        // 'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    })

    const _accounts: any[] = response.data
    return plainToInstance(Account, _accounts)
  }

  /**
     * Get a lis of transactions under certains accounts between a given date range.
     *
     * @param accountIds {String[]} list of the account ids.
     * @param startDate {String} start date (inclusive) in the format YYYY-MM-DD
     * @param endDate  {String} end date (inclusive) in the format YYYY-MM-DD
     * @returns {Promise<Transaction[]} a list of transactions
     */
  async getTransactions (accountIds: string[], startDate: string, endDate: string): Promise<Transaction[]> {
    const endPoint = `${API_ENDPOINT}/transactions/filter`
    const body = {
      accounts: accountIds,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD')
    }
    console.log(`getTransactions: POST ${endPoint} body=${JSON.stringify(body)}`)

    const response = await axios.post(endPoint, body, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-auth': this.accessToken
        // 'Referer': 'https://app.moneydashboard.com/',
        // 'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    })
    const _transactions: any[] = response.data
    return plainToInstance(Transaction, _transactions)
  }

  /**
     * Get budgets statistic
     *
     * @param fromDate {String} start date (inclusive) in the format YYYY-MM-DD
     * @param toDate  {String} end date (inclusive) in the format YYYY-MM-DD
     * @returns {Promise<Budget[]} a list of Budget
     */
  async getBudgets (fromDate: string, toDate: string): Promise<Budget[]> {
    const endPoint = `${API_ENDPOINT}/budgets`
    const params = {
      fromDate: moment(fromDate).format('YYYY-MM-DD'),
      toDate: moment(toDate).format('YYYY-MM-DD')
    }
    console.log(`getBudgets: GET ${endPoint} params=${JSON.stringify(params)}`)

    const response = await axios.get(endPoint, {
      params,
      headers: {
        accept: '*/*',
        'x-auth': this.accessToken
        // 'Referer': 'https://app.moneydashboard.com/',
        // 'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    })
    const _budgets: any[] = response.data

    return plainToInstance(Budget, _budgets)
  }

  /**
     * List all categories in the system
     *
     * @returns {Promise<Category[]} a list of categories.
     */
  async listCategories (): Promise<Category[]> {
    const endPoint = `${API_ENDPOINT}/categories/system`

    console.log(`getCategoryList: GET ${endPoint}`)

    const response = await axios.get(endPoint, {
      headers: {
        accept: '*/*',
        'x-auth': this.accessToken
        // 'Referer': 'https://app.moneydashboard.com/',
        // 'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    })
    const _categories: any = response.data
    const categories: Category[] = []
    for (const [, value] of Object.entries(_categories)) {
      categories.push(plainToInstance(Category, value))
    }

    return categories
  }

  /**
     * Refresh all linked accounts in MoneyDashboard
     * @returns {Promise<Boolean>}
     */
  async refreshAccounts (): Promise<void> {
    const endPoint = `${API_ENDPOINT}/accounts/refresh`
    console.log(`endPoint: GET ${endPoint}`)

    await axios.get(endPoint, {
      headers: {
        accept: '*/*',
        'x-auth': this.accessToken
        // 'Referer': 'https://app.moneydashboard.com/',
        // 'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    })
  }
}
