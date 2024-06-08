import Axios from "axios";
import { cache } from "react";
import { BASE_ANILIST_URL } from "./anilistQueryConstants";
import { createNewUserDocument } from "../lib/firebaseUserActions/userLoginActions";
import userSettingsActions from "./userSettingsActions";

export async function getHeadersWithAuthorization({ accessToken }: { accessToken?: string }) {

    if (accessToken) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        }
    }

    try {

        const { data } = await Axios({
            url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`,
            method: "GET"
        })

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.access_token}`,
            'Accept': 'application/json',
        }

    }
    catch (err) {

        return {
            'Content-Type': 'application/json',
        }

    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    getUserDataByID: cache(async ({ userId }: { userId: number }) => {

        try {

            const graphqlQuery = {
                "query": `
                    query($id: Int) {
                        User(id: $id){
                            id
                            name
                            bannerImage
                            createdAt
                            avatar {
                                large
                                medium
                            }
                            favourites {
                                anime {
                                    nodes {
                                        title {
                                            romaji
                                            english
                                            native
                                        }
                                    }
                                }
                                manga {
                                    nodes {
                                        title {
                                            romaji
                                            english
                                            native
                                        }
                                    }
                                }
                            }
                            statistics {
                                anime {
                                    minutesWatched
                                }
                                manga {
                                    chaptersRead
                                }
                            }
                        }
                    }
                `,
                "variables": {
                    'id': userId
                }
            }

            const { data } = await Axios({
                url: `${BASE_ANILIST_URL}`,
                method: 'POST',
                headers: await getHeadersWithAuthorization({ accessToken: undefined }),
                data: graphqlQuery
            })

            return data

        }
        catch (err) {

            console.log(err)

            return err

        }

    }),

    getCurrUserData: cache(async ({ accessToken }: { accessToken?: string }) => {

        try {

            const graphqlQuery = {
                "query": `
                    query {

                        Viewer {
                            id
                            name
                            about
                            bannerImage
                            createdAt
                            avatar {
                                large
                                medium
                            }
                            options {
                                titleLanguage 
                                displayAdultContent
                                activityMergeTime
                            }
                            favourites {
                                anime {
                                    nodes {
                                        id
                                        title {
                                            romaji
                                        }
                                        format
                                        description
                                        coverImage {
                                            extraLarge
                                            large
                                        }
                                    }
                                }
                                manga {
                                    nodes {
                                        id
                                        title {
                                            romaji
                                        }
                                        format
                                        description
                                        coverImage {
                                            extraLarge
                                            large
                                        }
                                    }
                                }
                            }
                            statistics {
                                anime {
                                    minutesWatched
                                }
                                manga {
                                    chaptersRead
                                }
                            }
                        }

                    }
                `,
            }

            const { data } = await Axios({
                url: `${BASE_ANILIST_URL}`,
                method: 'POST',
                headers: await getHeadersWithAuthorization({ accessToken: accessToken }),
                data: graphqlQuery
            })

            const userDataFromAnilist = data.data.Viewer

            const userDocFetchedOrCreated = await createNewUserDocument({ userAnilist: userDataFromAnilist }) as UserAnilist

            return userDocFetchedOrCreated || undefined

        }
        catch (err) {

            console.log(err)

            return undefined

        }

    }),

    handleMediaTitleLanguageSetting: async ({ lang }: { lang?: string }) => {

        try {

            const cookieSetResult = await userSettingsActions.setMediaTitleLanguageCookie({ lang: lang })

            const graphqlQuery = {
                "query": `mutation ($lang: UserTitleLanguage) {
                    UpdateUser (titleLanguage: $lang){
                        options{
                            titleLanguage
                        }
                    }
                }`,
                "variables": {
                    'lang': lang?.toUpperCase()
                }
            }

            const { data } = await Axios({
                url: `${BASE_ANILIST_URL}`,
                method: 'POST',
                headers: await getHeadersWithAuthorization({}),
                data: graphqlQuery
            })

            return cookieSetResult
        }
        catch (err) {

            console.log(err)

            return null

        }
    },

    handleAdultContentSetting: async ({ isEnabled }: { isEnabled?: string }) => {

        try {

            const cookieSetResult = await userSettingsActions.setAdultContentCookie({ isEnabled: isEnabled })

            const graphqlQuery = {
                "query": `mutation ($isEnabled: Boolean) {
                    UpdateUser (displayAdultContent: $isEnabled){
                        options{
                            displayAdultContent
                        }
                    }
                }`,
                "variables": {
                    'isEnabled': isEnabled == "true"
                }
            }

            await Axios({
                url: `${BASE_ANILIST_URL}`,
                method: 'POST',
                headers: await getHeadersWithAuthorization({}),
                data: graphqlQuery
            })

            return cookieSetResult

        }
        catch (err) {

            console.log(err)

            return null

        }

    },

    handleSubtitleLanguageSetting: async ({ lang }: { lang?: string }) => {

        try {

            const cookieSetResult = await userSettingsActions.setSubtitleLanguageCookie({ lang: lang })

            return cookieSetResult

        }
        catch (err) {

            console.log(err)

            return null

        }

    },

    handlePlayWrongMediaSetting: async ({ isEnabled }: { isEnabled?: string }) => {

        try {

            const cookieSetResult = await userSettingsActions.setPlayWrongMediaCookie({ playWrongMedia: isEnabled })

            return cookieSetResult

        }
        catch (err) {

            console.log(err)

            return null

        }

    },

}