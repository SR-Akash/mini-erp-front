
export interface Account {
    accountId: number;
    code: string;
    description: string;
    parentAccountId?: number; 
    isActive: boolean;
  }
  

  export interface JournalEntry {
    entryId: number;
    date: string;
    narration: string;
    voucherType: string;
    account: string;
    relatedParty: string;
    debit: number;
    credit: number;
  }
  

  export interface CreateJournalVoucherPayload {
    date: string;
    narration: string;
    voucherType: string;
    entries: JournalEntry[];
  }
  