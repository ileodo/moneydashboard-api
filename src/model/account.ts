import { Transform } from 'class-transformer';

import moment from 'moment';
import { Moment } from 'moment';
export class Account {
    cognitoId: string;
    accountId: string;
    providerId: string;
    connectionsUserId: string;
    accountType: string;
    accountNumber: null;
    sortCode: null;
    balance: Number;
    accountName: string;
    currency: string;
    description: null;
    logo: string;
    providerName: string;
    primaryColour: string;

    @Transform(({value})=>moment(value),{toClassOnly:true})
    created: Moment;

    @Transform(({value})=>moment(value),{toClassOnly:true})
    lastUpdateSuccess: Moment;
    @Transform(({value})=>moment(value),{toClassOnly:true})
    lastUpdateAttempt: string;
    deactivated: string|null;
    alias: string;
    lastRefreshStatus: Number;
    paymentsEnabled: false;
    isOffline: false;
    @Transform(({value})=>moment(value),{toClassOnly:true})
    tokenCreatedDate: string;
    @Transform(({value})=>moment(value),{toClassOnly:true})
    tokenRefreshDate: string;
    @Transform(({value})=>moment(value),{toClassOnly:true})
    tokenExpiryDate: string;
    closedDate: string|null;
    closingBalance: Number|null;
}