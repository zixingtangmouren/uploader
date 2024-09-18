import { FileItem } from '../FileItem';

export interface Rule {
  error: string;
  validate: (file: FileItem) => Promise<boolean>;
}

export class Validator {
  rules: Rule[];

  constructor(rules: Rule[]) {
    this.rules = [...rules];
  }

  async validate(file: FileItem, otherRules: Rule[] = []): Promise<string> {
    const rules = [...this.rules, ...otherRules];
    for (const rule of rules) {
      const isOk = await rule.validate(file);
      if (!isOk) {
        return rule.error;
      }
    }
    return '';
  }
}
