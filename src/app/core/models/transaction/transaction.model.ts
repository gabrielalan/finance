import { Moment } from "moment";

/**
 * Base model for transactions types
 */
export abstract class Transaction {
  value: Number;
  operation: String;
  code: String;
  date: Moment;
  nature: String;
  description: String;
  account: String;
  metadata: String;
  hash: String;
}
