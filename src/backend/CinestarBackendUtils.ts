import * as cheerio from "cheerio";
import type { Movie } from "../types/Movie";
import type {
  CinestarAtribute,
  CinestarCinema,
  CinestarMovie,
  CinestarUI,
} from "../types/CinestarAPI";

const ApiAppVersion = "1.5.3";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function queryMovieInformation(movieId: number): Promise<Movie> {
  const data = await fetchJson<CinestarMovie>(
    `https://www.cinestar.de/api/show/${movieId}?appVersion=${ApiAppVersion}`,
  );
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
  const ids = idsText.split(",").map(Number); // "192553"
  return await Promise.all(ids.map(queryMovieInformation));
}

export async function getWebpage(url: string): Promise<cheerio.CheerioAPI> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load webpage: ${response.statusText}`);
  }
  const html = await response.text();
  return cheerio.load(html);
}

export function getDateText(webpage: cheerio.CheerioAPI): string {
  return webpage("div.subHeadline").first().text().trim(); // "Vom 01.05. bis 07.05.2025"
}

export async function getFdwIdentifier(): Promise<string> {
  const data = await fetchJson<CinestarAtribute[]>(
    "https://www.cinestar.de/api/attribute/?appVersion=" + ApiAppVersion,
  );
  return data.find((obj) => obj.id === "ET_FILM_DER_WOCHE")?.name; // "Film der Woche"
}

export async function getCinemaSuburl(cinemaID: number): Promise<string> {
  const data = await fetchJson<CinestarCinema[]>(
    "https://www.cinestar.de/api/cinema/?appVersion=" + ApiAppVersion,
  );
  return data.find((obj) => obj.id == cinemaID)?.slug; // "kino-jena"
}

export function assertIsValidHttpsUrl(input: string): asserts input is string {
  let url: URL;
  try {
    url = new URL(input);
  } catch (err) {
    throw new Error(`Invalid HTTPS URL ${input}: ${(err as Error).message}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(
      `Expected URL with 'https:' protocol, got '${url.protocol}'`,
    );
  }
}

export function normalizeToHttpsUrl(input: string): string {
  try {
    const url = new URL(input);
    // Already a full URL
    return url.href;
  } catch {
    // If it's missing protocol, assume it's a domain/path and add https://
    return `https://${input}`;
  }
}

export async function getFdwPageUrl(
  fdwIdentifier: string,
  suburl: string,
  cinemaID: number,
): Promise<string> {
  const data = await fetchJson<CinestarUI[]>(
    `https://www.cinestar.de/aets/flaps/${cinemaID}?appVersion=${ApiAppVersion}`,
  );
  let url = data.find((obj) => obj.title === fdwIdentifier)?.link;
  url = normalizeToHttpsUrl(url);
  assertIsValidHttpsUrl(url);
  return url.replace("/redirect/", `/${suburl}/`); // "https://cinestar.de/kino-jena/film-der-woche"
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
