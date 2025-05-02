import axios from 'axios';
import * as cheerio from 'cheerio';
import { Movie } from '../types/Movie';

export default class CinestarBackendUtils {
  static async queryMovieInformation(movieId: number): Promise<Movie> {
    const response = await axios.get(`https://www.cinestar.de/api/show/${movieId}?appVersion=1.5.3`);
    const data = response.data;
    const title = data.title;
    const poster_url = data.poster.replace('/poster_tile/', '/web_l/');
    return {
      movie_id: movieId,
      title: title,
      poster_url: poster_url
    };
  }

  static async getFdw(webpage: cheerio.CheerioAPI): Promise<Movie[]> {
    const idsText = webpage('[data-show-ids]').attr('data-show-ids')!;
    const ids = idsText.split(',').map(Number);
    return await Promise.all(ids.map(CinestarBackendUtils.queryMovieInformation));
  }

  static async getWebpage(url: string): Promise<cheerio.CheerioAPI> {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  static getDateText(webpage: cheerio.CheerioAPI): string {
    return webpage('div.subHeadline').first().text().trim();
  }

  static async getFdwIdentifier(): Promise<string> {
    const response = await axios.get("https://www.cinestar.de/api/attribute/?appVersion=1.5.3");
    const data = response.data;
    return data.find((obj: any) => obj.id === 'ET_FILM_DER_WOCHE').name;
  }

  static async getCinemaSuburl(cinemaID: number): Promise<string> {
    const response = await axios.get("https://www.cinestar.de/api/cinema/?appVersion=1.5.3");
    const data = response.data;
    return data.find((obj: any) => obj.id == cinemaID).slug;
  }

  static async getFdwPageUrl(fdwIdentifier: string, suburl: string, cinemaID: number): Promise<string> {
    const response = await axios.get(`https://www.cinestar.de/aets/flaps/${cinemaID}?appVersion=1.5.3`);
    const data = response.data;
    const url = data.find((obj: any) => obj.title === fdwIdentifier).link;
    return url.replace('/redirect/', `/${suburl}/`);
  }

  static async getFDW(cinemaID: number) {
    const fdwIdentifier = await CinestarBackendUtils.getFdwIdentifier();
    const suburl = await CinestarBackendUtils.getCinemaSuburl(cinemaID);
    const fdwPageUrl = await CinestarBackendUtils.getFdwPageUrl(fdwIdentifier, suburl, cinemaID);

    const webpage = await CinestarBackendUtils.getWebpage(fdwPageUrl);
    const date = CinestarBackendUtils.getDateText(webpage);

    return {
      movies: await CinestarBackendUtils.getFdw(webpage),
      date: date
    };
  }
}
