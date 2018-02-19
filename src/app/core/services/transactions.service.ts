import { Injectable, group } from '@angular/core';
import { DatabaseService } from './database.service';
import { parse } from "papaparse";
import { IngTransaction } from '../models/transaction/ing-transaction.model';

const groups = [
  {
    name: 'General Market and Food',
    matches: [
      { field: 'description', regex: /(Ekoplaza|Panama Restaurant|Starbucks|SAMBA KITCHEN|Delifrance|DIRK|Vomar|LANGENDIJK|DONER COMPANY|DEEN|McDonald|Wonder\'s|Pjotr|Subway|MOJO|Eazie|Kiosk|Burgerij|Albron Nederland|Buter|CATHARINA HOEVE|WINKEL 43|Smullers|Albert Heijn|AH to go|VOLENDAMMER|Gunay|CHOCOLATE|Tropical|Julia|Salsa Shop|Isikogullari|Pizza)/i },
    ]
  },
  {
    name: 'Phone/Net/Water/Energy',
    matches: [
      { field: 'description', regex: /(ZIGGO|T-MOBILE|Huismerk|Vaanster)/i },
    ]
  },
  {
    name: 'Mobl and Eletronics',
    matches: [
      { field: 'description', regex: /(MM Zaandam)/i },
    ]
  },
  {
    name: 'Church',
    matches: [
      { field: 'description', regex: /(Vida Plena)/i },
    ]
  },
  {
    name: 'Health Care',
    matches: [
      { field: 'description', regex: /(OHRA|Infomedics)/i },
    ]
  },
  {
    name: 'Personal Care',
    matches: [
      { field: 'description', regex: /(KIKO|Beauty Center|Ali\'s Salon)/i },
    ]
  },
  {
    name: 'Recreation',
    matches: [
      { field: 'description', regex: /(J\. van Beek)/i },
    ]
  },
  {
    name: 'Schools',
    matches: [
      { field: 'description', regex: /(Agogo)/i },
    ]
  },
  {
    name: 'Clothes',
    matches: [
      { field: 'description', regex: /(H & M|PRIMARK|Zara|PRENATAL|Van Haren|C&A)/i },
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
      { field: 'description', regex: /(ETOS|Kruidvat|Apotheek)/i },
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

  loadOutbound(...filters) {
    const classify = (outbound) => {
      const categories = groups.map(({ name, matches }) => {
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
        return groups.every(({ matches }) => {
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
      this.inMemoryCache = this.base.ref('transactions')
        .once('value')
        .then(snapshot => snapshot.val())
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

      const month = current.date.format('MMM, YYYY');
      const existent = grouped[month] || 0;

      grouped[month] = existent + current.value;

      return grouped;
    };
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
