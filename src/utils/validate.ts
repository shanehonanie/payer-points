export const validatePayer = (payer: string) => {
  if (!payer || typeof payer !== 'string') {
    return false;
  }
  return true;
};

export const validateAddPoints = (points: number) => {
  if (points === null || typeof points !== 'number') {
    return false;
  }
  return true;
};

export const validateSpendPoints = (points: number) => {
  if (points === null || typeof points !== 'number' || points < 0) {
    return false;
  }
  return true;
};

// validating the date format would be a nice extra step
export const validateTimestamp = (timestamp: string) => {
  if (!timestamp || typeof timestamp !== 'string') {
    return false;
  }
  return true;
};
