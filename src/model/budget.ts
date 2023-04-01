import { Type, Transform } from 'class-transformer'
import { Amount } from './amount'
import { Transaction, type TransactionCollection } from './transaction'
import moment, { type Moment } from 'moment'

export class Budget {
  budgetId: string
  userId: string
  name: string
  @Type(() => Amount)
    amount: Amount

  color: string
  @Transform(({ value }) => moment(value), { toClassOnly: true })
    createdAt: Moment

  @Transform(({ value }) => moment(value), { toClassOnly: true })
    lastModifiedAt: Moment

  categories: string[]
  @Type(() => Transaction)
    transactions: TransactionCollection

  amountLeftToSpend: number

  totalTransactionAmount (): Record<string, number> {
    return this.transactions.reduce((acc: Record<string, number>, cur: Transaction) => {
      const amountWithSign = cur.amountWithSign()
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      acc[amountWithSign.currency] = (acc[amountWithSign.currency] || 0) + amountWithSign.amount
      return acc
    }, {})
  }

  amountByMonth (): Record<string, number[]> {
    return this.transactions.reduce((acc: Record<string, number[]>, cur: Transaction) => {
      const amountWithSign = cur.amountWithSign()
      const currency = amountWithSign.currency
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amount = amountWithSign.amount

      // eslint-disable-next-line no-prototype-builtins
      if (!acc.hasOwnProperty(currency)) {
        acc[currency] = new Array(12).fill(0)
      }
      const transactionMonth = cur.created.month()

      acc[currency][transactionMonth] += amountWithSign.amount
      return acc
    }, {})
  }
}
