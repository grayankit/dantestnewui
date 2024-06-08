import styles from "./page.module.css";
import Link from "next/link";
import React from "react";
import HeroCarousel from "./components/HomePage/HeroCarouselHomePage";
import anilist from './api/anilistMedias';
import NavigationThroughMedias from "./components/HomePage/NavigationThroughMedias";
import parse from "html-react-parser"
import NewestMediaSection from "./components/HomePage/NewestMediaSection";
import MediaRankingSection from "./components/HomePage/MediaRankingSection";
import { Slider } from "./components/shared/Slider";
import { ApiAiringMidiaResults, ApiDefaultResult } from "./ts/interfaces/apiAnilistDataInterface";
import { Metadata } from "next";
import * as AddToPlaylistButton from "./components/Buttons/AddToFavourites";
import { checkDeviceIsMobile } from "./lib/checkMobileOrDesktop";
import { cookies, headers } from "next/headers";
import KeepWatchingSection from "./components/HomePage/KeepWatchingSection";
import PopularMediaSection from "./components/HomePage/PopularMediaSection";
import { ReturnData } from "./types/api";

export const revalidate = 21600 // revalidate cached data every 6 hours

export const metadata: Metadata = {
  title: 'Home | AniProject',
  description: "A anime platform that showcases popular and trending animes, mangas and movies. Explore the latest releases, keep watching your favorites, and discover what's popular in the anime world.",
}

export default async function Home() {

  const isOnMobileScreen = checkDeviceIsMobile(headers())

  const accessTokenCookie = cookies().get("access_token")?.value

  const userAuthorization = accessTokenCookie ? JSON.parse(accessTokenCookie).accessToken : undefined

  // section 3
  const listAnimesTrending = await anilist.getMediaForThisFormat({
    type: "ANIME",
    accessToken: userAuthorization


  }) as ApiDefaultResult[]
  const listAnimesTrendingA = await anilist.getMediaForThisFormatA({
    type:"ANIME",
    accessToken:userAuthorization
  }) as ReturnData

  // section 1
  // console.log(listAnimesTrending)
  const listAnimesTrendingWithBackground = listAnimesTrending.filter(item => item.bannerImage)
  console.log(listAnimesTrendingWithBackground)

  // section 2
  const listAnimesReleasingByPopularity = await anilist.getNewReleases({
    type: "ANIME",
    showAdultContent: false,
    status: "RELEASING",
    page: 1,
    perPage: 12,
    accessToken: userAuthorization
  }).then(
    res => (res as ApiDefaultResult[])
  )

  // section 3
  const listMediasToBannerSection = await anilist.getMediaForThisFormat({
    type: "ANIME",
    sort: "SCORE_DESC",
    accessToken: userAuthorization
  }).then(
    res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
  )

  const randomIndexForBannerSection = Math.floor(Math.random() * (listMediasToBannerSection?.length || 10)) + 1

  // section 4 data
  const listMediasReleasedToday = await anilist.getReleasingByDaysRange({
    type: "ANIME",
    days: 1,
    perPage: 11,
    accessToken: userAuthorization
  }).then(
    res => ((res as ApiAiringMidiaResults[]).sort((a, b) => a.media.popularity - b.media.popularity).reverse())
  ).then(res => res.map((item) => item.media))

  return (
    <>
      <div className='absolute top-0'>
        {/* <SideBar /> */}
      </div>
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        {/* <Hero data={trending} /> */}
        <div className='mt-20 pr-4'>
          {/* <ContinueWatching /> */}
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            {/* <Flame className='size-9' /> <span>Trending Now</span> */}
          </h1>
          <Slider data={listAnimesTrendingA} title='trending' />
        </div>
        <div className='mt-20 pr-4'>
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            {/* <Star className='size-9' /> All Time Popular */}
          </h1>
          {/* <Slider data={popular} title='popular' /> */}
        </div>
        <div className='flex w-full flex-col justify-between pr-4 md:flex-row lg:flex-row'>
          {/* <ColumnCard media={upcoming?.results?.slice(0, 10)!} /> */}
          {/* <ColumnCard
            media={seasonal?.results.slice(0, 10)!}
            title='Releasing This Season'
          /> */}
        </div>
      </div>
    </>
  );
}
