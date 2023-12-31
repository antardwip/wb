function calculateDaysBetweenDates(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);

      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      return diffDays;
}

// Example usage:
const startDate = '2022-01-01';
const endDate = '2022-01-10';
const daysBetween = calculateDaysBetweenDates(startDate, endDate);
console.log(`Number of days between ${startDate} and ${endDate}: ${daysBetween}`);



