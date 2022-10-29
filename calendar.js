// @ts-check

const { getDateMask } = require("./utilities");

class Calendar {
  /** @type {number} */
  year = 0;
  /** @type {(number|null)[]} */
  activeDays = [];
  
  /**
   * Calendar constructor
   * @param {number} year Year
   */
  constructor(year) {
    const y = typeof year === "string" ? parseInt(year) : year;
    Object.defineProperty(this, "year", {
      value: y,
      writable: false
    });
  }

  /**
   * Validates if a day is configured as active in the calendar
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   * @returns {boolean} True if is active day
   */
  isActive(monthIndex, date) {
    const month = this.activeDays[monthIndex];
    if (!month) {
      const error = `Unspecified active days of the month index: ${monthIndex}`;
      throw new Error(error);
    }
    const mask = getDateMask(this.year, monthIndex, date);
    return (mask & month) > 0;
  }

  toJSON() {
    const json = {};
    json[this.year] = this.activeDays;
    return json;
  }
}

module.exports = {
  Calendar,
};