
export declare type Match = {
  field: any;
  regex: RegExp;
};

export class Group {
  name: String;
  matches: Array<Match>
}
