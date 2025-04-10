import { convertToUnix, lastHourOfTheDay } from "@/app/lib/formatDateUnix";
import {
  ApiAiringMidiaResults,
  ApiDefaultResult,
  ApiTrendingMidiaResults,
} from "@/app/ts/interfaces/apiAnilistDataInterface";
import Axios from "axios";
import {
  BASE_ANILIST_URL,
  defaultApiQueryRequest,
  getCurrentSeason,
  mediaAiringApiQueryRequest,
  mediaByIdQueryRequest,
  mediaTrendingApiQueryRequest,
} from "./anilistQueryConstants";
import { cache } from "react";
import axiosRetry from "axios-retry";
import { getHeadersWithAuthorization} from "./anilistUsers";
import { queryMediaWithUserAuthenticated } from "./anilistQueryConstants";
import { ReturnData } from "../types/api";

// returns medias with adult content
function filterMediasWithAdultContent(
  mediasList: ApiDefaultResult[] | ApiAiringMidiaResults[],
  reponseType?: "mediaByFormat"
) {
  if (reponseType == "mediaByFormat") {
    const mediasFiltered = (mediasList as ApiDefaultResult[]).filter(
      (item) => item.isAdult == false
    );

    return mediasFiltered;
  } else {
    const mediasFiltered = (mediasList as ApiAiringMidiaResults[]).filter(
      (item) => item.media.isAdult == false
    );

    return mediasFiltered;
  }
}

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
  retries: 3,
  retryDelay: (retryAttempt) => retryAttempt * 2000,
  retryCondition: (error) =>
    error.response?.status == 500 || error.response?.status == 503,
  onRetry: (retryNumber) =>
    console.log(
      `retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`
    ),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // HOME PAGE
  getNewReleases: cache(
    async ({
      type,
      format,
      sort,
      showAdultContent,
      status,
      page,
      perPage,
      accessToken,
    }: {
      type: string;
      format?: string;
      sort?: string;
      showAdultContent?: boolean;
      status?:
        | "FINISHED"
        | "RELEASING"
        | "NOT_YET_RELEASED"
        | "CANCELLED"
        | "HIATUS";
      page?: number;
      perPage?: number;
      accessToken?: string;
    }) => {
      const season = getCurrentSeason();

      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      try {
        const graphqlQuery = {
          query: defaultApiQueryRequest(
            status ? ", $status: MediaStatus" : undefined,
            status ? ", status: $status" : undefined
          ),
          variables: {
            type: `${type}`,
            format: `${
              (format === "MOVIE" && "MOVIE") ||
              (type === "MANGA" && "MANGA") ||
              (type === "ANIME" && "TV")
            }`,
            page: page || 1,
            sort: sort || "POPULARITY_DESC",
            perPage: perPage || 20,
            season: status ? undefined : `${season}`,
            status: status ? status : undefined,
            seasonYear: `${new Date().getFullYear()}`,
            showAdultContent: showAdultContent || false,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return data.data.Page.media as ApiDefaultResult[];
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),
  getNewReleasesA: cache(
    async ({
      type,
      format,
      sort,
      showAdultContent,
      status,
      page,
      perPage,
      accessToken,
    }: {
      type: string;
      format?: string;
      sort?: string;
      showAdultContent?: boolean;
      status?:
        | "FINISHED"
        | "RELEASING"
        | "NOT_YET_RELEASED"
        | "CANCELLED"
        | "HIATUS";
      page?: number;
      perPage?: number;
      accessToken?: string;
    }) => {
      const season = getCurrentSeason();

      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      try {
        const graphqlQuery = {
          query: defaultApiQueryRequest(
            status ? ", $status: MediaStatus" : undefined,
            status ? ", status: $status" : undefined
          ),
          variables: {
            type: `${type}`,
            format: `${
              (format === "MOVIE" && "MOVIE") ||
              (type === "MANGA" && "MANGA") ||
              (type === "ANIME" && "TV")
            }`,
            page: page || 1,
            sort: sort || "POPULARITY_DESC",
            perPage: perPage || 20,
            season: status ? undefined : `${season}`,
            status: status ? status : undefined,
            seasonYear: `${new Date().getFullYear()}`,
            showAdultContent: showAdultContent || false,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });
        const res: any = {
          currentPage: data.data.Page.pageInfo.currentPage,
          hasNextPage: data.data.Page.pageInfo.hasNextPage,
          results: data.data.Page.media
            .filter((item: any) => item.status !== "NOT_YET_RELEASED")
            .map((item: any) => ({
              id: item.id.toString(),
              malId: item.idMal,
              title: item.title
                ? {
                    romaji: item.title.romaji,
                    english: item.title.english,
                    native: item.title.native,
                    userPreferred: item.title.userPreferred,
                  }
                : item.title?.romaji,
              coverImage:
                item.coverImage.extraLarge ??
                item.coverImage.large ??
                item.coverImage.medium,
              trailer: item.trailer?.id
                ? `https://www.youtube.com/watch?v=${item.trailer?.id}`
                : null,
              description: item.description,
              status: item.status,
              bannerImage:
                item.bannerImage ??
                item.coverImage.extraLarge ??
                item.coverImage.large ??
                item.coverImage.medium,
              rating: item.averageScore,
              meanScore: item.meanScore,
              releaseDate: item.seasonYear,
              startDate: {
                year: item.startDate.year,
                month: item.startDate.month,
                day: item.startDate.day,
              },
              color: item.coverImage?.color,
              genres: item.genres,
              totalEpisodes: isNaN(item.episodes)
                ? 0
                : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
              duration: item.duration,
              format: item.format,
              type: item.type,
              season: item.season,
              nextAiringEpisode: item.nextAiringEpisode,
            })),
        };
        return res as ReturnData;

        // return data.data.Page.media as ApiDefaultResult[];
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),

  //SEARCH
  getSeachResults: cache(
    async ({
      query,
      showAdultContent,
      accessToken,
    }: {
      query: string;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const graphqlQuery = {
          query: defaultApiQueryRequest(
            ", $search: String",
            ", search: $search"
          ),
          variables: {
            page: 1,
            sort: "TRENDING_DESC",
            perPage: 15,
            showAdultContent: showAdultContent == true ? undefined : false,
            search: query,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return showAdultContent
          ? (data.data.Page.media as ApiDefaultResult[])
          : filterMediasWithAdultContent(data.data.Page.media, "mediaByFormat");
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),

  // RELEASING THIS WEEK
  getReleasingThisWeek: cache(
    async ({
      type,
      format,
      page,
      showAdultContent,
      accessToken,
    }: {
      type: string;
      format?: string;
      page?: number;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const thisYear = new Date().getFullYear();

        const graphqlQuery = {
          query: defaultApiQueryRequest(),
          variables: {
            type: type || "ANIME",
            page: page || 1,
            sort: "TRENDING_DESC",
            perPage: 10,
            showAdultContent: showAdultContent || false,
            season: getCurrentSeason(),
            year: thisYear,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return data.data.Page.media as ApiDefaultResult[];
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),

  // RELEASING BY DAYS RANGE
  getReleasingByDaysRange: cache(
    async ({
      type,
      days,
      pageNumber,
      perPage,
      showAdultContent,
      accessToken,
    }: {
      type: string;
      days: 1 | 7 | 30;
      pageNumber?: number;
      perPage?: number;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const dateInUnix = convertToUnix(days);

        const graphqlQuery = {
          query: mediaAiringApiQueryRequest(
            `, $airingAt_greater: Int, $airingAt_lesser: Int`,
            `, airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser`
          ),
          variables: {
            page: pageNumber || 1,
            perPage: perPage || 5,
            type: type,
            sort: "TIME_DESC",
            showAdultContent: showAdultContent == true ? undefined : false,
            airingAt_greater: dateInUnix,
            airingAt_lesser: lastHourOfTheDay(1), // returns today last hour
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return showAdultContent
          ? (data.data.Page.airingSchedules as ApiAiringMidiaResults[])
          : (filterMediasWithAdultContent(
              data.data.Page.airingSchedules
            ) as ApiAiringMidiaResults[]);
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),

  // TRENDING
  getTrendingMedia: cache(
    async ({
      sort,
      showAdultContent,
      accessToken,
    }: {
      sort?: string;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const thisYear = new Date().getFullYear();

        const graphqlQuery = {
          query: mediaTrendingApiQueryRequest(),
          variables: {
            page: 1,
            sort: sort || "TRENDING_DESC",
            perPage: 24,
            showAdultContent: showAdultContent == true ? undefined : false,
            season: getCurrentSeason(),
            year: thisYear,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return data.data.Page.mediaTrends as ApiTrendingMidiaResults[];
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),

  // MEDIAS WITH INDICATED FORMAT
  getMediaForThisFormat: cache(
    async ({
      type,
      sort,
      pageNumber,
      perPage,
      showAdultContent,
      accessToken,
    }: {
      type: string;
      sort?: string;
      pageNumber?: number;
      perPage?: number;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const graphqlQuery = {
          query: defaultApiQueryRequest(),
          variables: {
            page: pageNumber || 1,
            sort: sort || "TRENDING_DESC",
            perPage: perPage || 20,
            showAdultContent: showAdultContent == true ? undefined : false,
            type: type,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });
        return showAdultContent ?
                data.data.Page.media as ApiDefaultResult[] : filterMediasWithAdultContent(data.data.Page.media, "mediaByFormat") as ApiDefaultResult[]
        
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),
  getMediaForThisFormatA: cache(
    async ({
      type,
      sort,
      pageNumber,
      perPage,
      showAdultContent,
      accessToken,
    }: {
      type: string;
      sort?: string;
      pageNumber?: number;
      perPage?: number;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const graphqlQuery = {
          query: defaultApiQueryRequest(),
          variables: {
            page: pageNumber || 1,
            sort: sort || "TRENDING_DESC",
            perPage: perPage || 20,
            showAdultContent: showAdultContent == true ? undefined : false,
            type: type,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });
        const res: any = {
          currentPage: data.data.Page.pageInfo.currentPage,
          hasNextPage: data.data.Page.pageInfo.hasNextPage,
          results: data.data.Page.media
            .filter((item: any) => item.status !== "NOT_YET_RELEASED")
            .map((item: any) => ({
              id: item.id.toString(),
              malId: item.idMal,
              title: {
                romaji: item.title?.romaji ?? "",
                english: item.title?.english ?? "",
                native: item.title?.native ?? "",
                userPreferred: item.title?.userPreferred ?? item.title?.romaji ?? "",
              },
              coverImage:
                item.coverImage.extraLarge ??
                item.coverImage.large ??
                item.coverImage.medium,
              trailer: item.trailer?.id
                ? `https://www.youtube.com/watch?v=${item.trailer?.id}`
                : null,
              description: item.description,
              status: item.status,
              bannerImage:
                item.bannerImage ??
                item.coverImage.extraLarge ??
                item.coverImage.large ??
                item.coverImage.medium,
              rating: item.averageScore,
              meanScore: item.meanScore,
              releaseDate: item.seasonYear,
              startDate: {
                year: item.startDate.year,
                month: item.startDate.month,
                day: item.startDate.day,
              },
              color: item.coverImage?.color,
              genres: item.genres,
              totalEpisodes: isNaN(item.episodes)
                ? 0
                : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
              duration: item.duration,
              format: item.format,
              type: item.type,
              season: item.season,
              nextAiringEpisode: item.nextAiringEpisode,
            })),
        };
        return res as ReturnData;
      } catch (error: any) {
        console.log(error.response.data);

        return null;
      }
    }
  ),

  // GET MEDIA INFO BY ID
  getMediaInfo: cache(async ({ id, accessToken }: { id: number, accessToken?: string }) => {

    try {

        const headersCustom = await getHeadersWithAuthorization({ accessToken: accessToken })

        const graphqlQuery = {
            "query": headersCustom.Authorization ? queryMediaWithUserAuthenticated('$id: Int', 'id: $id') : mediaByIdQueryRequest('$id: Int', 'id: $id'),
            "variables": {
                'id': id
            }
        }

        const { data } = await Axios({
            url: `${BASE_ANILIST_URL}`,
            method: 'POST',
            headers: headersCustom,
            data: graphqlQuery
        })

        return data.data.Media as ApiDefaultResult

    }
    catch (error: any) {

        console.log(error.response.data)

        return null

    }
}),
};
