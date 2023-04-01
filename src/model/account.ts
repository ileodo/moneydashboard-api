import { Transform } from 'class-transformer'

import moment, { type Moment } from 'moment'
export class Account {
  cognitoId: string
  accountId: string
  providerId: string
  connectionsUserId: string
  accountType: string
  accountNumber: null
  sortCode: null
  balance: number
  accountName: string
  currency: string
  description: null
  logo: string
  providerName: string
  primaryColour: string

  @Transform(({ value }) => moment(value), { toClassOnly: true })
    created: Moment

  @Transform(({ value }) => moment(value), { toClassOnly: true })
    lastUpdateSuccess: Moment

  @Transform(({ value }) => moment(value), { toClassOnly: true })
    lastUpdateAttempt: string

  deactivated: string | null
  alias: string
  lastRefreshStatus: number
  paymentsEnabled: false
  isOffline: false
  @Transform(({ value }) => moment(value), { toClassOnly: true })
    tokenCreatedDate: string

  @Transform(({ value }) => moment(value), { toClassOnly: true })
    tokenRefreshDate: string

  @Transform(({ value }) => moment(value), { toClassOnly: true })
    tokenExpiryDate: string

  closedDate: string | null
  closingBalance: number | null
}
