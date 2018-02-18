import { Injectable, group } from '@angular/core';
import { DatabaseService } from './database.service';
import { parse } from "papaparse";
import { IngTransaction } from '../models/transaction/ing-transaction.model';

const groups = [
  {
    name: 'General Market and Food',
    matches: [
      { field: 'description', regex: /(CATHARINA HOEVE|WINKEL 43|Smullers|Albert Heijn|AH to go|VOLENDAMMER|Gunay|CHOCOLATE|Tropical|Julia|Salsa Shop|OP IS OP|Action|Isikogullari|Pizza)/i },
    ]
  },
  {
    name: 'Phone/Net/Water/Energy',
    matches: [
      { field: 'description', regex: /(ZIGGO|T-MOBILE|Huismerk|Vaanster)/i },
    ]
  },
  {
    name: 'Health Care',
    matches: [
      { field: 'description', regex: /(OHRA)/i },
    ]
  },
  {
    name: 'Clothes',
    matches: [
      { field: 'description', regex: /(H & M|PRIMARK)/i },
    ]
  },
  {
    name: 'Online services',
    matches: [
      { field: 'description', regex: /(NETFLIX)/i },
    ]
  },
  {
    name: 'Credit card',
    matches: [
      { field: 'description', regex: /(AMERICAN EXPRESS)/i },
    ]
  },
  {
    name: 'Farmacy',
    matches: [
      { field: 'description', regex: /(ETOS|Kruidvat)/i },
    ]
  },
  {
    name: 'TransferWise',
    matches: [
      { field: 'description', regex: /(Adyen)/i },
    ]
  },
  {
    name: 'Transportation',
    matches: [
      { field: 'description', regex: /(NS-|EBS Servicewinkel)/i },
    ]
  },
  {
    name: 'Rent',
    matches: [
      { field: 'description', regex: /(HBhousing)/i },
    ]
  },
  {
    name: 'Loans',
    matches: [
      { field: 'description', regex: /(Harald Janssen)/i },
    ]
  }
];

@Injectable()
export class TransactionsService {

  inMemoryCache: any;

  constructor(private base: DatabaseService) { }

  loadOutbound() {
    const classify = (outbound) => {
      return groups.map(({ name, matches }) => {
        return {
          name,
          transactions: outbound.filter(item => {
            return matches.every(rule => rule.regex.test(item[rule.field]));
          })
        };
      });
    };

    return this.load()
      .then(this.operationFilter('-'))
      .then(classify);
  }

  load(): Promise<Array<IngTransaction>> {
    if (!this.inMemoryCache) {
      this.inMemoryCache = this.base.ref('transactions')
        .once('value')
        .then(snapshot => snapshot.val())
        .then(this.convertToArray);
    }

    return this.inMemoryCache;
  }

  operationFilter(operation) {
    return (data) => data.filter(item => item.operation === operation);
  }

  convertToArray(data) {
    return Object.keys(data).map(key => IngTransaction.fromDatabase(data[key]));
  }

  importFromCSV(data) {
    const transactions = parse(data, { header: true }).data
      .map(IngTransaction.fromCSVLine)
      .filter(truthy => truthy)
      .reduce((result, { hash, date, ...data }) => {
        result[hash] = { date: date.valueOf(), ...data };
        return result;
      }, {});

    return this.base.ref('transactions').update(transactions);
  }
}
