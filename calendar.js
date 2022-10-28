// @ts-check

const { getDateMask } = require("./utilities");

const MonthIndices = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

class Calendar {
  /** @type {number} */
  #year = 0;
  /** @type {number[]} */
  activeDays = [];
  
  constructor(year) {
    this.#year = year;
  }

  /**
   * @return {number}
   */
  get year() {
    return this.#year;
  }

  /**
   * Set a date as active
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   */
  setDayAsActive(monthIndex, date) {
    let monthActiveDays = this.activeDays[monthIndex];
    if (monthActiveDays === undefined) {
      monthActiveDays = 0;
    }
    const maskStr = getDateMask(this.year, monthIndex, date);
    const mask = parseInt(maskStr, 2);
    this.activeDays[monthIndex] = monthActiveDays | mask;;
  }

  /**
   * Set a date as inactive
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   */
  setDayAsInactive(monthIndex, date) {
    let monthActiveDays = this.activeDays[monthIndex];
    if (monthActiveDays === undefined) {
      monthActiveDays = 0;
    }
    const maskStr = getDateMask(this.year, monthIndex, date, true);
    const mask = parseInt(maskStr, 2);
    this.activeDays[monthIndex] = monthActiveDays & mask;
  }

  /**
   * Validates if a day is configured as active in the calendar
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   * @returns {boolean} True if is active day
   */
  isActive(year, monthIndex, date) {
    const month = this.activeDays[monthIndex];
    if (month === undefined) {
      throw new Error("Unspecified active days of the month");
    }
    const mask = getDateMask(year, monthIndex, date);
    const day = parseInt(mask, 2);
    return (day & month) > 0;

  }
}

module.exports = {
  Calendar,
  MonthIndices,
};