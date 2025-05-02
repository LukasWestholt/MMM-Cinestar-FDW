import axios from "axios";
import * as cheerio from "cheerio";
import type { Movie } from "../types/Movie";
import type {
  CinestarAtribute,
  CinestarCinema,
  CinestarUI,
} from "../types/CinestarAPI";

export async function queryMovieInformation(movieId: number): Promise<Movie> {
  const response = await axios.get(
    `https://www.cinestar.de/api/show/${movieId}?appVersion=1.5.3`,
  );
  const data = response.data;
  const title = data.title;
  const poster_url = data.poster.replace("/poster_tile/", "/web_l/");
  return {
    movie_id: movieId,
    title: title,
    poster_url: poster_url,
  };
}

export async function getFdw(webpage: cheerio.CheerioAPI): Promise<Movie[]> {
  const idsText = webpage("[data-show-ids]").attr("data-show-ids");
  const ids = idsText.split(",").map(Number);
  return await Promise.all(ids.map(queryMovieInformation));
}

export async function getWebpage(url: string): Promise<cheerio.CheerioAPI> {
  const response = await axios.get(url);
  return cheerio.load(response.data);
}

export function getDateText(webpage: cheerio.CheerioAPI): string {
  return webpage("div.subHeadline").first().text().trim();
}

export async function getFdwIdentifier(): Promise<string> {
  const response = await axios.get<CinestarAtribute[]>(
    "https://www.cinestar.de/api/attribute/?appVersion=1.5.3",
  );
  const data = response.data;
  return data.find((obj: CinestarAtribute) => obj.id === "ET_FILM_DER_WOCHE")
    .name;
}

export async function getCinemaSuburl(cinemaID: number): Promise<string> {
  const response = await axios.get<CinestarCinema[]>(
    "https://www.cinestar.de/api/cinema/?appVersion=1.5.3",
  );
  const data = response.data;
  return data.find((obj: CinestarCinema) => obj.id == cinemaID).slug;
}

export async function getFdwPageUrl(
  fdwIdentifier: string,
  suburl: string,
  cinemaID: number,
): Promise<string> {
  const response = await axios.get<CinestarUI[]>(
    `https://www.cinestar.de/aets/flaps/${cinemaID}?appVersion=1.5.3`,
  );
  const data = response.data;
  const url = data.find((obj: CinestarUI) => obj.title === fdwIdentifier).link;
  return url.replace("/redirect/", `/${suburl}/`);
}

export async function getFDW(cinemaID: number) {
  const fdwIdentifier = await getFdwIdentifier();
  const suburl = await getCinemaSuburl(cinemaID);
  const fdwPageUrl = await getFdwPageUrl(fdwIdentifier, suburl, cinemaID);

  const webpage = await getWebpage(fdwPageUrl);
  const date = getDateText(webpage);

  return {
    movies: await getFdw(webpage),
    date: date,
  };
}
