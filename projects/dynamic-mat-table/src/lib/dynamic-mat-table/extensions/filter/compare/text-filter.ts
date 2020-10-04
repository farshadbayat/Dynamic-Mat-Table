import { AbstractFilter, FilterOperation } from './abstract-filter';
import { TableIntl } from '../../../../international/table-Intl';

const contains = 'a.includes(b)';
const equals = 'a === b';
const startsWith = 'a.startsWith(b)';
const endsWith = 'a.endsWith(b)';
const empty = '!a';
const notEmpty = '!!a';
const operations = [contains, equals, startsWith, endsWith, empty, notEmpty];

export class TextFilter extends AbstractFilter<string> {
  private static sql = ['LIKE "%[*]%"', '= "[*]"', 'LIKE "%[*]"', 'LIKE "[*]%"', 'IS NULL', 'IS NOT NULL'];
  private static operationList: FilterOperation[] = [];

  constructor(public languagePack: TableIntl) {
    super();
    this._selectedIndex = 0;
    if ( TextFilter.operationList.length === 0) { // init for first time
      operations.forEach(fn => {
        TextFilter.operationList.push({ predicate: fn, text: null});
      });
    }
    TextFilter.operationList[0].text = languagePack.filterLabels.TextContains;    // contains //
    TextFilter.operationList[1].text = languagePack.filterLabels.TextEquals;      // equals //
    TextFilter.operationList[2].text = languagePack.filterLabels.TextStartsWith;  // startsWith //
    TextFilter.operationList[3].text = languagePack.filterLabels.TextEndsWith;    // endsWith //
    TextFilter.operationList[4].text = languagePack.filterLabels.TextEmpty;       // empty //
    TextFilter.operationList[5].text = languagePack.filterLabels.TextNotEmpty;    // notEmpty //
  }

  // tslint:disable-next-line:variable-name
  private _selectedIndex: number = null;
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
    this._selectedIndex = value;
    // init filter parameters
    if (value === 0 || value === 1 || value === 2 || value === 3 ) { // contains equals startsWith endsWith
      this.parameters = [{ value: '', text: this.languagePack.filterLabels.Text }];
    } else { // empty notEmpty
      this.parameters = null;
    }
  }

  get selectedValue(): FilterOperation {
    if (this._selectedIndex !== null) {
      return TextFilter.operationList[this._selectedIndex];
    } else {
      return null;
    }
  }

  public getOperations(): FilterOperation[] {
    return TextFilter.operationList;
  }

  public toString(dynamicVariable: any): string {
    const a = '_a$';
    const b = '_b$';
    const predicate = this.selectedValue.predicate.replace('a', a).replace('b', b);
    const statement = predicate.replace(a, `${a}['${dynamicVariable}']?.toLowerCase()`);
    // one static parameters equals  notEquals greaterThan lessThan //
    if (this._selectedIndex === 0 ||
      this._selectedIndex === 1 ||
      this._selectedIndex === 2 ||
      this._selectedIndex === 3 ) {
        const value = '\'' + (this.parameters[0].value !== null ? this.parameters[0].value.toLowerCase() : ' null ') + '\'';
        return statement.replace('_b$', value);
    } else { // without static parameters
      return statement;
    }
  }

  public toPrint(): string {
    return TextFilter.operationList[this._selectedIndex].text + ' ' + this.parameters[0].value + ' ' + (this.type || '') + ' ';
  }

  public toSql(): string {
    return TextFilter.sql[this._selectedIndex].replace('[*]', (this.parameters[0].value || '')) + (this.type || '') + ' ';
  }
}

