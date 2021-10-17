import { SpendPointsTransaction } from '../types/payer';

export const getPayerIndex = (
  payerName: string,
  transactionArr: Array<SpendPointsTransaction>,
) => {
  return transactionArr.findIndex((t) => t.payer === payerName);
};

export const calcEpoch = (timestamp: string) => {
  return Date.parse(timestamp) / 1000;
};
