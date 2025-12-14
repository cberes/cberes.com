import { DateTime } from 'luxon';

export default {
  dateString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'UTC'}).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
};
