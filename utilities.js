// @ts-check

/**
 * Get the number of days in a month
 * @param {number} year Year
 * @param {number} monthIndex Month index (base 0)
 * @returns {number}  Number of days in the indicated month
 */
function getDaysInMonth(year, monthIndex) {
  if (monthIndex < 0 || monthIndex > 11) {
    const error = `Month index out of range: ${monthIndex}`;
    throw new Error(error);
  }
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Get date mask string
 * @param {number} year Year
 * @param {number} monthIndex Month index (base 0)
 * @param {number} date Date
 * @param {boolean} [inactive] Active
 * @returns {number} Date mask
 */
function getDateMask(year, monthIndex, date, inactive) {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  let mask = 1 << date - 1;
  if (inactive) {
    const ones = (~(1 << 31)) >>> (31 - daysInMonth);
    mask = ~mask & ones;
  }
  return mask;
}

module.exports = {
  getDaysInMonth,
  getDateMask,
};
