type PayoutAccount = {
  id: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountType: string;
  isActive: boolean;
}

type Bank = {
  name: string;
  code: string;
}

type Payout = {
  id: string;
  amount: number;
  receipt: string;
  status: string;
  paymentReference: string;
  receiptImageUrl: string;
  transactionType: 'PAYOUT';
  actionType: 'DEBIT' | 'CREDIT';
  settlementAccount: PayoutAccount;
  timeOfAction: string;
  createdAt: string;
  updatedAt: string;
}