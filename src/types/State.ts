import type { Movie } from "./Movie";

export interface State {
  lastUpdate: number;
  cinestarDate: string;
  movies: Movie[];
}
