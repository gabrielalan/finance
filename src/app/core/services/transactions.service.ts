import { Injectable, group } from '@angular/core';
import { DatabaseService } from './database.service';
import { parse } from "papaparse";
import { IngTransaction } from '../models/transaction/ing-transaction.model';
import { HttpClient } from '@angular/common/http';
import { GroupsService } from './groups.service';
import { Moment } from 'moment';

import 'rxjs/add/operator/toPromise';

// @TODO move it to a app general config
const PAYDAY = 22;

@Injectable()
export class TransactionsService {

  inMemoryCache: any;

  constructor(
    private base: DatabaseService,
    private http: HttpClient,
    private groups: GroupsService
  ) { }

  loadOutbound(...filters) {
    const classify = (outbound) => {
      const categories = this.groups.getGroups().map(({ name, matches }) => {
        const matchesFilter = item => {
          return matches.every(rule => rule.regex.test(item[rule.field]));
        };

        const allFilters = [matchesFilter, ...filters];

        return {
          name,
          transactions: outbound.filter(this.composedFilter(...allFilters))
        };
      });

      const othersFilter = item => {
        return this.groups.getGroups().every(({ matches }) => {
          return matches.every(rule => !rule.regex.test(item[rule.field]));
        });
      };

      categories.push({
        name: 'Others',
        transactions: outbound.filter(this.composedFilter(othersFilter, ...filters))
      });

      return categories;
    };

    return this.load()
      .then(this.operationFilter('-'))
      .then(classify);
  }

  loadMonthlyInOut() {
    return this.load()
      .then(items => this.sortByDate(items))
      .then(items => this.groupByMonth(items));
  }

  load(): Promise<Array<IngTransaction>> {
    if (!this.inMemoryCache) {
      // this.inMemoryCache = this.base.ref('transactions')
      //   .once('value')
      //   .then(snapshot => snapshot.val())
      //   .then(this.convertToArray);
      this.inMemoryCache = this.http.get('/api/transactions')
        .toPromise()
        .then(this.convertToArray);
    }

    return this.inMemoryCache;
  }

  groupByMonth(transactions) {
    const groupInboundByMonth = this.operationGrouperByMonth('+');
    const groupOutboundByMonth = this.operationGrouperByMonth('-');

    return transactions.reduce((result, current) => {
      const inbound = groupInboundByMonth(result.inbound, current);
      const outbound = groupOutboundByMonth(result.outbound, current);
      return { inbound, outbound };
    }, {
      inbound: {},
      outbound: {}
    });
  }

  operationGrouperByMonth(operation) {
    return (grouped, current) => {
      if (current.operation !== operation) {
        return grouped;
      }

      const month = this.getCorrectMonth(current.date).format('MMM, YYYY');
      const existent = grouped[month] || 0;

      grouped[month] = existent + current.value;

      return grouped;
    };
  }

  getCorrectMonth(date: Moment) {
    const month = date.month();

    return date.date() >= 22
      ? date.clone().month(month + 1)
      : date;
  }

  sortByDate(transactions: Array<IngTransaction>): Array<IngTransaction> {
    return transactions.sort((a, b) => a.date.isBefore(b.date) ? -1 : 1);
  }

  operationFilter(operation) {
    return (data) => data.filter(item => item.operation === operation);
  }

  composedFilter(...filters) {
    return (item) => filters.every(filter => filter(item));
  }

  convertToArray(data): Array<IngTransaction> {
    return Object.keys(data).map(key => IngTransaction.fromDatabase(data[key]));
  }

  importFromCSV(data) {
    const transactions = parse(data, { header: true }).data
      .map(IngTransaction.fromCSVLine)
      .filter(truthy => truthy)
      // .reduce((result, { hash, date, ...rest }) => {
      //   result[hash] = { date: date.valueOf(), ...rest };
      //   return result;
      // }, {})
      ;

    return this.http.post('/api/transactions', transactions);
    // return this.base.ref('transactions').update(transactions);
  }
}
