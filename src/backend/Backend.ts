import * as NodeHelper from "node_helper";
import * as Log from "logger";
import { State } from "../types/State";
import CinestarBackendUtils from "./CinestarBackendUtils";
import { Config } from "../types/Config";

module.exports = NodeHelper.create({
  start() {
    Log.log(`${this.name} helper method started...`);
  },

  async socketNotificationReceived(notification, payload: Config) {
    if (notification.includes("FDW_REQUEST")) {
      const identifier = notification.substring("FDW_REQUEST".length + 1);
      const { movies, date } = await CinestarBackendUtils.getFDW(
        payload.cinemaID,
      );

      const response: State = {
        lastUpdate: Date.now(),
        cinestarDate: date,
        movies: movies,
      };

      this.sendSocketNotification(`FDW_RESPONSE-${identifier}`, response);
    } else {
      Log.warn(`${notification} is invalid notification`);
    }
  },
});
