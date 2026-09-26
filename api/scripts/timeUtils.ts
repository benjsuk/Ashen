import { config } from "../config";

class TimeUtils {
  dateUK(date: Date | string) {
    date = new Date(date);
    return config.dateFmt.format(date);
  }
}

export const timeUtils = new TimeUtils();
