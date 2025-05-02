import * as NodeHelper from "node_helper";
import * as Log from "logger";
import type { State } from "../types/State";
import * as CinestarBackendUtils from "./CinestarBackendUtils";
import type { Config } from "../types/Config";

module.exports = NodeHelper.create({
  start() {
    Log.log(`${this.name} helper method started...`);
  },

  async socketNotificationReceived(notification, payload: Config) {
    Log.log(
      `${this.name} received a socket notification: ` +
        notification +
        " - Payload: " +
        payload,
    );
    if (notification.includes("CINESTAR_FDW_REQUEST")) {
      const identifier = notification.substring(
        "CINESTAR_FDW_REQUEST".length + 1,
      );
      const { movies, date } = await CinestarBackendUtils.getFDW(
        payload.cinemaID,
      );

      const response: State = {
        lastUpdate: Date.now(),
        cinestarDate: date,
        movies: movies,
      };

      Log.log(`${this.name}: Response ${response}`);

      this.sendSocketNotification(
        `CINESTAR_FDW_RESPONSE-${identifier}`,
        response,
      );
    } else {
      Log.warn(`${notification} is invalid notification`);
    }
  },
});
