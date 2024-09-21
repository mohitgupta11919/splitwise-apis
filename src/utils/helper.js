class HelperUtils{
    static  validateDateRange(start_date, end_date) {
        const start = new Date(start_date);
        const end = new Date(end_date);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error('Invalid date format.');
        }
        return { start, end };
      }
}

module.exports = HelperUtils;