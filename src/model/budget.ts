import { Type, Transform, Expose } from 'class-transformer';
import { Amount } from './amount';
import { Transaction, TransactionCollection } from './transaction';
import moment from 'moment';
import { Moment } from 'moment';


export class Budget {

    budgetId: string;
    userId: string;
    name: string;
    @Type(() => Amount)
    amount: Amount;
    color: string;
    @Transform(({value})=>moment(value),{toClassOnly:true})
    createdAt: Moment;
    @Transform(({value})=>moment(value),{toClassOnly:true})
    lastModifiedAt: Moment;
    categories: string[];
    @Type(() => Transaction)
    transactions: TransactionCollection;
    amountLeftToSpend: Number;


    totalTransactionAmount():{[key:string]:number}{
        return this.transactions.reduce((acc:{[key:string]:number}, cur:Transaction)=>{
            const amountWithSign = cur.amountWithSign();
            acc[amountWithSign.currency] = (acc[amountWithSign.currency] || 0) + amountWithSign.amount;
            return acc;
        }, {})
    }

    amountByMonth(): {[key:string]:number[]}{
        return this.transactions.reduce((acc:{[key:string]:number[]}, cur:Transaction)=>{
            const amountWithSign = cur.amountWithSign();
            const currency = amountWithSign.currency;
            const amount = amountWithSign.amount;

            if (!acc.hasOwnProperty(currency)){
                acc[currency] = new Array(12).fill(0);
            }
            const transactionMonth = cur.created.month();
            
            acc[currency][transactionMonth] += amountWithSign.amount;
            return acc;
        }, {})
    }

}