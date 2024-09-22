const numeralValues = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

// Credit for Bloom
/**
 * Decodes a roman numeral into it's respective number. Eg VII -> 7, LII -> 52 etc.
 * Returns null if the numeral is invalid.
 * Supported symbols: I, V, X, L, C, D, M
 * @param {String} numeral
 * @returns {Number | null}
 */
export const decodeNumeral = (numeral) => {
  if (!numeral.match(/^[IVXLCDM]+$/)) return null;
  let sum = 0;
  for (let i = 0; i < numeral.length; i++) {
    let curr = numeralValues[numeral[i]];
    let next = i < numeral.length - 1 ? numeralValues[numeral[i + 1]] : 0;

    if (curr < next) {
      sum += next - curr;
      i++;
      continue;
    }
    sum += curr;
  }
  return sum;
};
