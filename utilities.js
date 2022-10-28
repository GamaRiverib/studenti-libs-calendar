/**
 * Get the number of days in a month
 * @param {number} year Year
 * @param {number} monthIndex Month index (base 0)
 * @returns {number}  Number of days in the indicated month
 */
function getDaysInMonth(year, monthIndex) {
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error("Month index out of range");
  }
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Get date mask string
 * @param {number} year Year
 * @param {number} monthIndex Month index (base 0)
 * @param {number} date Date
 * @param {boolean} [inactive] Active
 * @returns {string} Date mask
 */
function getDateMask(year, monthIndex, date, inactive) {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const maskArray = [];
  for (let i = 1; i <= daysInMonth; i++) {
    if (i === date) {
      maskArray.unshift(inactive ? "0" : "1");
    } else {
      maskArray.unshift(inactive ? "1" : "0");
    }
  }
  return maskArray.join("");
}

module.exports = {
  getDaysInMonth,
  getDateMask,
};
