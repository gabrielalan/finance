import { Transaction } from "./transaction.model";
import { SHA256 } from "crypto-js";
import * as moment from 'moment';

/**
 * Bij: "Af"
  Bedrag (EUR): "12,58"
  Code: "BA"
  Datum: "20170227"
  Mededelingen: "Pasvolgnr:001 25-02-2017 19:48 Transactie:7010S5 Term:921VBL"
  MutatieSoort: "Betaalautomaat"
  Naam / Omschrijving: "ALBERT HEIJN 1493 AMSTERDAM NLD"
  Rekening: "NL97INGB0651982804"
  Tegenrekening: ""
*/
export class IngTransaction extends Transaction {
  ingMetadata: String;

  static fromDatabase(data: any): IngTransaction {
    const instance = new IngTransaction();

    return Object.assign(instance, data, { date: moment(data.date) });
  }

  static fromCSVLine(data: any): IngTransaction {
    if (!data['Bedrag (EUR)']) {
      return undefined;
    }

    const instance = new IngTransaction();
    const dataToHash = data['Mededelingen'] + data['Naam / Omschrijving'] + data['Bedrag (EUR)'] + data['Rekening'];

    instance.hash = `${data['Datum']}-${SHA256(dataToHash).toString()}`;
    instance.operation = data['Af Bij'] === 'Af' ? '-' : '+';
    instance.value = parseFloat(data['Bedrag (EUR)'].replace(',', '.'));
    instance.code = data['Code'];
    instance.ingMetadata = data['Mededelingen'];
    instance.nature = data['MutatieSoort'];
    instance.description = data['Naam / Omschrijving'];
    instance.account = data['Rekening'];
    instance.metadata = data['Tegenrekening'];
    instance.date = moment(data['Datum'], "YYYYMMDD");
    return instance;
  }
}
