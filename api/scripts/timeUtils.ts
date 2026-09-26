import { config } from "../config";

class TimeUtils {
  dateUK(date: Date | string) {
    date = new Date(date);
    return config.dateFmt.format(date)
  }
}

const timeUtils = new TimeUtils();

export { timeUtils };
