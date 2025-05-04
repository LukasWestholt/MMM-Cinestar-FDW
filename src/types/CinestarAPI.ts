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

export interface CinestarMovie {
  _type: string;
  id: number;
  cinema: number;
  title: string;
  subtitle: string;
  hasTrailer: boolean;
  attributes: string[];
  fsk: number;
  showtimes: Showtime[];
  poster_preload: string;
  poster: string;
  date: string;
  movie: number;
  duration: number;
  trailer: number;
  detailLink: string;
}

export interface Showtime {
  id: number;
  name: string;
  cinema: number;
  datetime: string;
  emv: number;
  fsk: number;
  systemId: string;
  system: string;
  show: number;
  attributes: string[];
  screen: number;
}
