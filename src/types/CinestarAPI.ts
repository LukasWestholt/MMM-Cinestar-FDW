export interface CinestarAtribute {
  id: string;
  icon: null | string;
  name: null | string;
}

export interface CinestarCinema {
  id: number;
  cinemaNumber: number;
  name: string;
  shortName: string;
  city: string;
  ticketing: Ticketing;
  ticketingLink: string;
  lat: number;
  lng: number;
  discountDay: null;
  slug: string;
  nearByCinemas: number[];
}

export enum Ticketing {
  Compeso = "compeso",
  Vista = "vista",
}

export interface CinestarUI {
  title: string;
  textColor: string;
  backgroundColor: string;
  borderColor: null | string;
  borderImage: null | string;
  icon: null | string;
  badge: null | string;
  link: null | string;
  linkText: null | string;
  linkTarget: LinkTarget;
  movies: number[];
  events: number[];
}

export enum LinkTarget {
  Self = "_self",
}
