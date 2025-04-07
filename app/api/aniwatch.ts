import { EpisodeLinksAnimeWatch, EpisodesFetchedAnimeWatch, MediaInfoFetchedAnimeWatch } from "@/app/ts/interfaces/apiAnimewatchInterface";
import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_ANIWATCH_API_URL  // Use a proxy server if needed

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 2000,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`)
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // SEARCH MEDIA
    searchMedia: cache(async ({ query, page }: { query: string, page?: number }) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/api/v2/hianime/search?q=${query}${page ? `&page=${page}` : ""}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return data as MediaInfoFetchedAnimeWatch

        }
        catch (error: any) {

            console.log(error)

            return null

        }
    }),

    // GET EPISODES, NO LINKS INCLUDED
    getEpisodes: cache(async ({ episodeId }: { episodeId: string }) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/api/v2/hianime/anime/${episodeId}/episodes`,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })

            return data as EpisodesFetchedAnimeWatch

        }
        catch (error: any) {

            console.log(error)

            return null

        }
    }),

    // GET EPISODES, NO LINKS INCLUDED
    episodesLinks: cache(async ({ episodeId, server, category }: { episodeId: string, server?: string, category?: "dub" | "sub" }) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}${server ? `&server=${server}` : ""}${category ? `&category=${category}` : ""}`,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })

            return data as EpisodeLinksAnimeWatch

        }
        catch (error: any) {

            console.log(error)

            return null

        }
    })

}