import React from 'react'
import styles from "./page.module.css"
import anilist from '@/app/api/anilistMedias'
import * as MediaCardExpanded from '@/app/components/MediaCards/MediaInfoExpandedWithCover'
import { MangaChapters, MangaInfo, MangaPages } from '@/app/ts/interfaces/apiMangadexDataInterface'
import manga from '@/app/api/consumetManga'
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
import ChaptersPages from './components/ChaptersPages/index'
import ChaptersListContainer from './components/ChaptersListContainer'
import { getClosestMangaResultByTitle } from '@/app/lib/dataFetch/optimizedFetchMangaOptions'
import { stringToUrlFriendly } from '@/app/lib/convertStrings'
import { FetchEpisodeError } from '@/app/components/MediaFetchErrorPage'

export const revalidate = 1800 // revalidate cached data every 30 minutes

export async function generateMetadata({ params, searchParams }: {
    params: Promise<{ id: number }>, // ANILIST MANGA ID
    searchParams: Promise<{ chapter: string, source: string, q: string }> // EPISODE NUMBER, SOURCE, EPISODE ID
}) {
    const Params = await params
    const SearchParams = await searchParams

    const mediaInfo = await anilist.getMediaInfo({ id: Params.id }) as ApiDefaultResult

    return {
        title: !mediaInfo ? "Error | Dantotsu" : `Chapter ${SearchParams.chapter} - ${mediaInfo.title.userPreferred} | Dantotsu`,
        description: `Read ${mediaInfo.title.userPreferred} - Chapter ${SearchParams.chapter}. ${mediaInfo.description && mediaInfo.description}`,
    }
}

async function ReadChapter({ params, searchParams }: {
    params: Promise<{ id: number }>, // ANILIST ANIME ID
    searchParams: Promise<{ chapter: string, source: "mangadex", q: string, page: string }> // EPISODE NUMBER, SOURCE, EPISODE ID, LAST PAGE 
}) {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams

    const mediaInfo = await anilist.getMediaInfo({ id: resolvedParams.id }) as ApiMediaResults

    let currChapterInfo: MangaChapters | undefined = undefined
    let allAvailableChaptersList: MangaChapters[] | undefined = undefined
    let hadFetchError = false

    const currMangaChapters = await manga.getChapterPages({ chapterId: resolvedSearchParams.q }) as MangaPages[]

    const mangaTitleUrlFrindly = stringToUrlFriendly(mediaInfo.title.userPreferred).toLowerCase()

    let mangaInfo = await manga.getInfoFromThisMedia({ id: mangaTitleUrlFrindly }) as MangaInfo

    if (!mangaInfo) {
        const mangaClosestResult = await getClosestMangaResultByTitle(mangaTitleUrlFrindly, mediaInfo)

        mangaInfo = await manga.getInfoFromThisMedia({ id: mangaClosestResult as string }) as MangaInfo

        if (!mangaInfo) hadFetchError = true

    }

    if (hadFetchError) return <FetchEpisodeError mediaId={resolvedParams.id} searchParams={resolvedSearchParams} />

    allAvailableChaptersList = mangaInfo.chapters.filter(item => item.pages != 0)

    currChapterInfo = allAvailableChaptersList.find((item) => item.id == resolvedSearchParams.q)

    if (!currMangaChapters || !allAvailableChaptersList) hadFetchError = true

    if (hadFetchError) return <FetchEpisodeError mediaId={resolvedParams.id} searchParams={resolvedSearchParams} />

    return (
        <main id={styles.container}>

            <div id={styles.heading_container}>

                <h1>
                    <span>{mediaInfo.title.userPreferred}: </span>
                    {currChapterInfo!.title == currChapterInfo!.chapterNumber ? `Chapter ${currChapterInfo!.chapterNumber}` : currChapterInfo!.title}
                </h1>

                <small>{currChapterInfo!.pages} Pages</small>

            </div>

            <ChaptersPages
                chapters={currMangaChapters}
                initialPage={Number(resolvedSearchParams.page) || undefined}
            />

            <div id={styles.all_chapters_container}>

                <MediaCardExpanded.Container
                    mediaInfo={mediaInfo as ApiDefaultResult}

                >

                    <MediaCardExpanded.Description
                        description={mediaInfo.description}
                    />

                </MediaCardExpanded.Container>

                <ChaptersListContainer
                    mediaId={resolvedParams.id}
                    currChapterId={resolvedSearchParams.q}
                    chaptersList={allAvailableChaptersList!}
                />

            </div>

        </main>
    )
}

export default ReadChapter