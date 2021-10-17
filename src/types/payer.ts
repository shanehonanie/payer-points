export interface AddPointsRecord {
  payer: string;
  points: number;
  timestamp: string;
}

export interface SpendPointsTransaction {
  payer: string;
  points: number;
}

export interface SpendPointsPayload {
  payer: string;
  points: number;
  timestamp: string;
}

export interface HashMap {
  [payer: string]: number;
}
