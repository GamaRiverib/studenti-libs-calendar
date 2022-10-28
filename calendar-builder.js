// @ts-check

const { getDaysInMonth } = require("./utilities");
const { Calendar } = require("./calendar");

/**
 * Calendar builder class.
 */
class CalendarBuilder {
  /** @type {Calendar[]} */
  #calendars = [];

  constructor() {}

  /**
   * Get calendar by year
   * @param {number} year Year
   * @returns {Calendar|undefined}
   */
  #getCalendar(year) {
    return this.#calendars.find((c) => c.year === year);
  }

  /**
   * Create a new calendar object and sort the calendar list
   * @param {number} year Year
   * @returns {Calendar}
   */
  #createCalendar(year) {
    const calendar = new Calendar(year);
    this.#calendars.push(calendar);
    this.#calendars.sort((a, b) => {
      return a.year - b.year;
    });
    return calendar;
  }

  /**
   * Get the calendar if it exists or create it if it doesn't exist
   * @param {number} year
   * @returns {Calendar}
   */
  #getOrCreateCalendar(year) {
    let calendar = this.#getCalendar(year);
    if (calendar === undefined) {
      calendar = this.#createCalendar(year);
    }
    return calendar;
  }

  /**
   * Get the active days of the month as a string of ones and zeros
   * @param {number} daysInMonth Number of days
   * @param {boolean} active  If true all days active, else all days inactive
   * @returns
   */
  #getMonthActiveDays(daysInMonth, active) {
    const days = [];
    const a = active ? "1" : "0";
    for (let i = 0; i < daysInMonth; i++) {
      days[i] = a;
    }
    return days.join("");
  }

  /**
   * Add year calendar
   * @param {number} year Year
   * @returns {CalendarBuilder}
   */
  addYearCalendar(year) {
    this.#getOrCreateCalendar(year);
    return this;
  }

  /**
   * Initialize calendar with all inactive days
   * @param {number} year Year
   * @returns
   */
  initYearAllDaysInactive(year) {
    const calendar = this.#getOrCreateCalendar(year);
    for (let i = 0; i < 12; i++) {
      calendar.activeDays[i] = 0;
    }
    return this;
  }

  /**
   * Initialize calendar with all active days
   * @param {number} year Year
   * @returns
   */
  initYearAllDaysActive(year) {
    const calendar = this.#getOrCreateCalendar(year);
    for (let i = 0; i < 12; i++) {
      const daysInMonth = getDaysInMonth(year, i);
      const monthActiveDaysString = this.#getMonthActiveDays(daysInMonth, true);
      calendar.activeDays[i] = parseInt(monthActiveDaysString, 2);
    }
    return this;
  }

  /**
   * Initialize calendar with inactive weekends and the rest of the active days
   * @param {number} year Year
   * @returns {CalendarBuilder}
   */
   initYearWeekendInactive(year) {
    this.#getOrCreateCalendar(year);
    for (let i = 0; i < 12; i++) {
      this.initMonthWeekendInactive(year, i);
    }
    return this;
  }

  /**
   * Initialize month with all inactive days
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {CalendarBuilder}
   */
  initMonthAllDaysInactive(year, monthIndex) {
    const calendar = this.#getOrCreateCalendar(year);
    calendar.activeDays[monthIndex] = 0;
    return this;
  }

  /**
   * Initialize month with all active days
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {CalendarBuilder}
   */
  initMonthAllDaysActive(year, monthIndex) {
    const calendar = this.#getOrCreateCalendar(year);
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const monthActiveDaysString = this.#getMonthActiveDays(daysInMonth, true);
    calendar.activeDays[monthIndex] = parseInt(monthActiveDaysString, 2);
    return this;
  }

  /**
   * Initialize month with inactive weekends and the rest of the active days
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {CalendarBuilder}
   */
  initMonthWeekendInactive(year, monthIndex) {
    const calendar = this.#getOrCreateCalendar(year);
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const monthActiveDaysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, monthIndex, i);
      const day = d.getDay();
      if (day === 0 || day === 6) {
        monthActiveDaysArray.unshift("0");
      } else {
        monthActiveDaysArray.unshift("1");
      }
    }
    const monthActiveDaysString = monthActiveDaysArray.join("");
    calendar.activeDays[monthIndex] = parseInt(monthActiveDaysString, 2);
    return this;
  }

  /**
   * Set a date as active
   * @param {Date} date Date
   * @returns {CalendarBuilder}
   */
  seDayAsActiveDayFromDate(date) {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = date.getDate();
    return this.setDayAsActive(year, monthIndex, day);
  }

  /**
   * Set a date as active
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   */
  setDayAsActive(year, monthIndex, date) {
    const calendar = this.#getOrCreateCalendar(year);
    calendar.setDayAsActive(monthIndex, date);
    return this;
  }

  /**
   * Set a date as inactive
   * @param {Date} date Date
   * @returns {CalendarBuilder}
   */
  setDayAsInactiveDayFromDate(date) {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = date.getDate();
    return this.setDayAsActive(year, monthIndex, day);
  }

  /**
   * Set a date as inactive
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   */
  setDayAsInactive(year, monthIndex, date) {
    const calendar = this.#getOrCreateCalendar(year);
    calendar.setDayAsInactive(monthIndex, date);
    return this;
  }

  /**
   * Set a range as active
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} start Start date (same month)
   * @param {number} end End date (same month)
   * @returns {CalendarBuilder}
   */
  setRangeAsActive(year, monthIndex, start, end) {
    if (start > end) {
      throw new Error("Start date must be less than the end date");
    }
    for (let i = start; i <= end; i++) {
      this.setDayAsActive(year, monthIndex, i);
    }
    return this;
  }

  /**
   * Set a range as inactive
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} start Start date (same month)
   * @param {number} end End date (same month)
   * @returns {CalendarBuilder}
   */
   setRangeAsInactive(year, monthIndex, start, end) {
    if (start > end) {
      throw new Error("Start date must be less than the end date");
    }
    for (let i = start; i <= end; i++) {
      this.setDayAsInactive(year, monthIndex, i);
    }
    return this;
  }

  /**
   * Build all calendars
   * @returns {Calendar[]}
   */
  buildAll() {
    return this.#calendars;
  }

  /**
   * Build a calendar by year
   * @param {number} year Year
   * @returns {Calendar}
   */
  build(year) {
    return this.#getOrCreateCalendar(year);
  }
}

module.exports = {
  CalendarBuilder,
};
