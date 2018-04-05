import { Injectable } from '@angular/core';
import { Group } from '../models/groups/group';
import { Transaction } from '../models/transaction/transaction.model';

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
      { field: 'description', regex: /(ZIGGO|VODAFONE|T-MOBILE|Huismerk|Vaanster|HHNK)/i },
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
    name: 'Savings',
    matches: [
      { field: 'description', regex: /(Hr GA Pereira, L Da Silva Moreira Pereira)/i },
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
export class GroupsService {

  constructor() { }

  getGroups(): Array<Group> {
    return groups.slice();
  }

  getAppliedGroup(transaction: Transaction): Group {
    return this.getGroups().find(group =>
      this.isFromGroup(transaction, group)
    );
  }

  isFromGroup(transaction: Transaction, group: Group): boolean {
    return group.matches.every(rule =>
      rule.regex.test(transaction[rule.field])
    );
  }

}
