import {
  getFDW,
  getFdwIdentifier,
  getCinemaSuburl,
  getFdwPageUrl,
  getWebpage,
  getDateText,
} from "../src/backend/CinestarBackendUtils";

describe("FDW Utility Functions - Real API Calls", () => {
  test("getFdwIdentifier should return 'Film der Woche'", async () => {
    const result = await getFdwIdentifier();
    expect(result).toBe("Film der Woche");
  });

  test("getCinemaSuburl should return 'kino-jena'", async () => {
    const result = await getCinemaSuburl(29); // Example cinemaID
    expect(result).toBe("kino-jena");
  });

  test("getFdwPageUrl should return correct URL", async () => {
    const fdwIdentifier = "Film der Woche";
    const suburl = "kino-jena";
    const cinemaID = 29;

    const result = await getFdwPageUrl(fdwIdentifier, suburl, cinemaID);
    expect(result).toBe("https://cinestar.de/kino-jena/film-der-woche");
  });

  test("getDateText should extract correct date", async () => {
    const url = "https://www.cinestar.de/kino-jena/film-der-woche";
    const webpage = await getWebpage(url);
    const date = getDateText(webpage);
    expect(date).toMatch(/^Vom \d{2}\.\d{2}\. bis \d{2}\.\d{2}\.\d{4}$/);
  });

  test("getFDW should return correct structure", async () => {
    const cinemaID = 29;

    // Running real tests for the entire pipeline
    const result = await getFDW(cinemaID);

    expect(result.date).toMatch(/^Vom \d{2}\.\d{2}\. bis \d{2}\.\d{2}\.\d{4}$/); // Example date format
    expect(result.movies).toHaveLength(1); // Example length
    expect(result.movies[0]).toHaveProperty("movie_id");
    expect(result.movies[0]).toHaveProperty("title");
    expect(result.movies[0]).toHaveProperty("poster_url");
  });
});
