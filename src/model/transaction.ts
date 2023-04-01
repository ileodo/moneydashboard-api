import { Type, Transform } from 'class-transformer'
import { Amount } from './amount'
import { CategorisationResult, type CategorisationResultCollection } from './category'
import moment, { type Moment } from 'moment'

export class Transaction {
  id: string
  @Transform(({ value }) => moment(value), { toClassOnly: true })
    created: Moment

  accountId: string
  customerId: string
  isPredicted: null
  providerTransactionId: null
  @Type(() => Amount)
    amount: Amount

  @Type(() => Amount)
    sourceAmount: Amount

  status: string
  deactivated: null
  type: string
  description: string
  seriesId: null
  @Transform(({ value }) => moment(value), { toClassOnly: true })
    savedDate: Moment

  merchant: string
  transactionBatchId: string
  excludeFromSpendCalculations: false
  @Transform(({ value }) => moment(value), { toClassOnly: true })
    originalTransactionDate: Moment

  originalTransactionDescription: string
  // ProprietaryProviderDetails: any //ignore

  @Type(() => CategorisationResult)
    categorisation: CategorisationResultCollection

  bookedTransactionId: null
  merchantLogo: null
  capabilities: null
  isSplit: null
  deactivationSource: null
  parentTransactionId: null
  source: null

  amountWithSign (): Amount {
    const amount = this.amount
    if (this.type === 'Credit') { amount.amount = amount.amount * (-1) }
    return amount
  }
}

export class TransactionCollection extends Array<Transaction> {

}
