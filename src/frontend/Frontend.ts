import type { Config } from "../types/Config";
import type { State } from "../types/State";

// Global or injected variable declarations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const moment: any;

Module.register<Config>("MMM-Cinestar-FWD", {
  defaults: {
    cinemaID: 29,
    updateIntervalInSeconds: 60 * 60 * 5, // 5h
  },

  getScripts() {
    return ["moment.js"];
  },

  getStyles() {
    return ["MMM-Cinestar-FDW.css"];
  },

  getTemplate() {
    return "templates/MMM-Cinestar-FDW.njk";
  },

  getTemplateData() {
    return {
      config: this.config,
      movies: this.state?.movies,
      lastUpdate: moment(this.state?.lastUpdate),
    };
  },

  start() {
    this.loadData();
    this.scheduleUpdate();
    this.updateDom();
  },

  scheduleUpdate() {
    this.config.updateIntervalInSeconds =
      this.config.updateIntervalInSeconds < 120
        ? 120
        : this.config.updateIntervalInSeconds;
    setInterval(() => {
      this.loadData();
    }, this.config.updateIntervalInSeconds * 1000);
  },

  loadData() {
    this.sendSocketNotification(
      `CINESTAR_FWD_REQUEST-${this.identifier}`,
      this.config,
    );
  },

  socketNotificationReceived(notificationIdentifier: string, payload: State) {
    if (notificationIdentifier === `CINESTAR_FWD_RESPONSE-${this.identifier}`) {
      const lastDate = this.state.cinestarDate;
      if (payload.cinestarDate !== lastDate) {
        this.state = payload;
        this.updateDom();
        console.log("data", payload);
        this.sendSocketNotification(`CINESTAR_FWD_NEW`, this.state);
      } else {
        this.state = payload;
      }
    }
  },
});
