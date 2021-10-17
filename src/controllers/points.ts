import express from 'express';

import {
  AddPointsRecord,
  SpendPointsTransaction,
  SpendPointsPayload,
  HashMap,
} from '../types/payer';
import { MinimumHeap } from '../utils/minHeap';
import { getPayerIndex } from '../utils/utils';
import {
  validatePayer,
  validateAddPoints,
  validateSpendPoints,
  validateTimestamp,
} from '../utils/validate';
import {
  INTERNAL_SERVER_ERROR_ERROR_MSG,
  INVALID_PAYER_ERROR_MSG,
  INVALID_ADD_POINTS_ERROR_MSG,
  INVALID_SPEND_POINTS_ERROR_MSG,
  INVALID_TIMESTAMP_ERROR_MSG,
  TOO_MANY_POINTS_TO_SPEND_ERROR_MSG,
} from '../utils/errors';

const payerMap: HashMap = {};
const minHeap: MinimumHeap = new MinimumHeap();

// the general idea here is to use 2 data structures.
// 1. use a hash table for keeping track of total points by payer
// 2. use a min heap for insertions / removals / min timestamp lookup & retrievel for each available point redemption
export const add = (req: express.Request, res: express.Response) => {
  try {
    const payer = req.body.payer;
    const points = req.body.points;
    const timestamp = req.body.timestamp;
    const validationErrors = [];

    // input validation
    if (!validatePayer(payer)) {
      validationErrors.push(INVALID_PAYER_ERROR_MSG);
    }
    if (!validateAddPoints(points)) {
      validationErrors.push(INVALID_ADD_POINTS_ERROR_MSG);
    }
    if (!validateTimestamp(timestamp)) {
      validationErrors.push(INVALID_TIMESTAMP_ERROR_MSG);
    }

    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    // add all unique payers to the hashmap or update the current points
    if (!payerMap.hasOwnProperty(payer)) {
      payerMap[payer] = points;
    } else {
      payerMap[payer] += points;
    }

    const addPointsRecord: AddPointsRecord = {
      payer,
      points,
      timestamp,
    };

    minHeap.insert(addPointsRecord);

    return res.status(201).send();
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};

export const spend = (req: express.Request, res: express.Response) => {
  try {
    const pointsSpentTransactions: Array<SpendPointsTransaction> = [];
    const validationErrors = [];
    let pointsToSpend = req.body.points;

    // input validation
    if (!validateSpendPoints(pointsToSpend)) {
      validationErrors.push(INVALID_SPEND_POINTS_ERROR_MSG);
    }
    if (pointsToSpend > minHeap.getTotalPoints()) {
      validationErrors.push(TOO_MANY_POINTS_TO_SPEND_ERROR_MSG);
    }

    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    // redeem points by min timestamp while there are points to spend and user has points to redeem
    while (pointsToSpend > 0 && minHeap.getTotalPoints() > 0) {
      const minTransactionItem: SpendPointsPayload = minHeap.peek();
      const payerIndex: number = getPayerIndex(
        minTransactionItem.payer,
        pointsSpentTransactions,
      );

      // determine if this is a partial redemption or a full redemption
      if (pointsToSpend < minTransactionItem.points) {
        // use payerIndex to determine if we add a new transaction or update a previous one by payer
        if (payerIndex !== -1) {
          pointsSpentTransactions[payerIndex].points += 0 - pointsToSpend;
        } else {
          const SpendPointsTransaction: SpendPointsTransaction = {
            payer: minTransactionItem.payer,
            points: 0 - pointsToSpend,
          };

          pointsSpentTransactions.push(SpendPointsTransaction);
        }

        minHeap.changePointsForMinItem(pointsToSpend); // partial redemption
        payerMap[minTransactionItem.payer] -= pointsToSpend;
        pointsToSpend = 0;
      } else {
        const transactionItem: SpendPointsPayload = minHeap.remove(); // full redemption

        // use payerIndex to determine if we add a new transaction or update a previous one by payer
        if (payerIndex !== -1) {
          pointsSpentTransactions[payerIndex].points +=
            0 - transactionItem.points;
        } else {
          const SpendPointsTransaction: SpendPointsTransaction = {
            payer: transactionItem.payer,
            points: 0 - transactionItem.points,
          };

          pointsSpentTransactions.push(SpendPointsTransaction);
        }

        payerMap[transactionItem.payer] -= transactionItem.points;
        pointsToSpend -= transactionItem.points;
      }
    }

    return res.send(pointsSpentTransactions);
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};

export const points = (req: express.Request, res: express.Response) => {
  return res.send(payerMap);
};
