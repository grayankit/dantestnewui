import React from 'react'
import styles from "./page.module.css"
import MediasContainer from './components/MediasContainer'
import NavigationSideBar from './components/NavigationSideBar'
import { cookies, headers } from 'next/headers'
import anilistUsers from '../api/anilistUsers'
import { ApiDefaultResult } from '../ts/interfaces/apiAnilistDataInterface'
import { checkDeviceIsMobile } from '../lib/checkMobileOrDesktop'

export async function generateMetadata() {

    return {
        title: `My Lists | Dantotsu`,
        description: `User's Medias Lists of Medias Watched, Planned to Watch and much more.`,
    }
}

type FetchListsResultsType = {

    user: {
        id: number,
        name: string
    },
    lists: {
        name: string,
        status: string,
        entries: {
            id: number,
            userId: number,
            mediaId: number,
            media: ApiDefaultResult
        }[]
    }[]

}

async function MyListsPage(
    props: {
        params?: Promise<unknown>,
        searchParams?: Promise<{
            format: string,
            sort: "title_desc" | "title_asc",
            type: "ANIME" | "MANGA" | "tv" | "movie"
        }>
    }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    const accessTokenCookie = (await cookies()).get("access_token")?.value

    const userAuthorization = accessTokenCookie ? JSON.parse(accessTokenCookie).accessToken : undefined

    const isOnMobile = checkDeviceIsMobile(await headers())

    let dataBySearchQuery: FetchListsResultsType | null = null

    if (userAuthorization) {
        const userId = await anilistUsers.getCurrUserData({ accessToken: userAuthorization, getOnlyId: true })


        dataBySearchQuery = await anilistUsers.getCurrUserLists({
            userId: userId,
            accessToken: userAuthorization,
            mediaType: (searchParams?.type == "tv" ? "ANIME" : searchParams?.type || "ANIME") as "ANIME" | "MANGA"
        })
        // console.log(dataBySearchQuery)
        // console.log("yay")
    }

    return (
        <main id={styles.container}>

            <NavigationSideBar
                isOnMobile={isOnMobile}
                mediaFetched={dataBySearchQuery?.lists}
                params={searchParams}
            />

            <section id={styles.main_content_container}>

                <div id={styles.heading_container}>

                    <h1>My Lists</h1>

                </div>

                <MediasContainer
                    mediaFetched={dataBySearchQuery?.lists}
                    params={searchParams}
                />

            </section>

        </main>
    )
}

export default MyListsPage