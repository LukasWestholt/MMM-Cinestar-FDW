import type { Config } from "../types/Config";
import type { State } from "../types/State";

interface FrontendModuleProperties
  extends Partial<Module.ModuleProperties<Config>> {
  state?: State;
}

Module.register<Config>("MMM-Cinestar-FDW", {
  defaults: {
    cinemaID: 29,
    updateIntervalInSeconds: 60 * 60 * 5, // 5h
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
      // lastUpdate: moment(this.state?.lastUpdate),
    };
  },

  start() {
    console.log(`${this.name} Start Frontend`);
    console.log(`${this.name} Config: ${this.config}`);
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
      `CINESTAR_FDW_REQUEST-${this.identifier}`,
      this.config,
    );
  },

  socketNotificationReceived(notificationIdentifier: string, payload: State) {
    if (notificationIdentifier === `CINESTAR_FDW_RESPONSE-${this.identifier}`) {
      const lastDate = this.state?.cinestarDate;
      if (payload.cinestarDate !== lastDate) {
        this.state = payload;
        this.updateDom();
        console.log(`${this.name} Data: ${payload}`);
        this.sendSocketNotification(`CINESTAR_FDW_NEW`, this.state);
      } else {
        this.state = payload;
      }
    }
  },
} as FrontendModuleProperties);
