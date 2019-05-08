const Moment = require('moment');
export const name = 'Closest Date';

export default ({ Handlebars }) => {

    Handlebars.registerHelper('closestDate', (date, arrayOfDates) => {
      const dateToCompare = Moment.utc(date);
      let closestDate = null;
      let lowestDifference = Infinity;

      if (Array.isArray(arrayOfDates)){
        if (arrayOfDates.length > 0){
          arrayOfDates.forEach((tempDate) => {

            const momentTempDate = Moment.utc(tempDate);
            const dateDiff = Math.abs(dateToCompare.diff(momentTempDate));
            if (dateDiff < lowestDifference){
              lowestDifference = dateDiff;
              closestDate = momentTempDate;
            }
          });
        }
      }
      return closestDate._i;
    });
};
