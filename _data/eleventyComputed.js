import { DateTime } from 'luxon';

const locale = 'en-us';

export default {
  dateString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'UTC'})
    .setLocale(locale)
    .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
  dateStringShort: ({page}) => DateTime.fromJSDate(page.date, {zone: 'UTC'})
    .setLocale(locale)
    .toLocaleString(DateTime.DATE_SHORT),
};
