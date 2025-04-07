import React from 'react';
import { use } from 'react';
// import {
//     getUpcomingAnime,
//     getSeasonalAnime,
// } from '@/app/lib/anime';
// import {
//   getTrendingManga,
//   getPopularManga,
// } from '@/app/lib/manga'
import { Flame, Heart, Star } from 'lucide-react';
import { SliderM } from '@/app/components/shared/SliderM';
import { Metadata } from 'next';
import { cookies, headers } from "next/headers";
import anilist from '@/app/api/anilistMedias';
import { ReturnData } from '../types/api';
// import { ColumnCard } from '@/components/shared/ColumnCard';
// import dynamic from 'next/dynamic';
// const SideBar = dynamic(() => import('@/components/SideBar'), { ssr: false });
// import getAnifyInfo from "@/lib/anify/info";
// import { redis } from "@/lib/redis";
// import getMangaId from "@/lib/anify/getMangaId";
// import { mediaInfoQuery } from "@/lib/graphql/query";

export const revalidate = 30;
export const metadata: Metadata = {
  title: 'Home | Dantotsu',
  description: "A anime platform that showcases popular and trending animes, mangas and movies. Explore the latest releases, keep watching your favorites, and discover what's popular in the anime world.",
}
export default async function Manga() {

    // const trending = use(getTrendingManga(1, 69));
    // const popular = use(getPopularManga());
    // const upcoming = use(getUpcomingAnime());
    // const seasonal = use(getSeasonalAnime());
    const cookieStore = await cookies()
    const accessTokenCookie = cookieStore.get("access_token")?.value

    const userAuthorization = accessTokenCookie ? JSON.parse(accessTokenCookie).accessToken : undefined
    const listAnimesTrendingA = await anilist.getMediaForThisFormatA({
      type:"MANGA",
      accessToken:userAuthorization,
      sort:"TRENDING_DESC"
    }) as ReturnData


    const listAnimesReleasingByPopularity = await anilist.getMediaForThisFormatA({
      type: "MANGA",
      showAdultContent: true,
      accessToken: userAuthorization,
      sort:"POPULARITY_DESC"
    }) as ReturnData

    const listAnimesReleasingByFAVOURITES = await anilist.getMediaForThisFormatA({
      type: "MANGA",
      showAdultContent: true,
      accessToken: userAuthorization,
      sort:"FAVOURITES_DESC"
    }) as ReturnData

    // console.log(listAnimesReleasingByPopularity)


    return (
        <>
      <div className='absolute top-0 min-h-screen'>
      </div>
      <div className='ml-0 md:ml-16 lg:ml-16 xl:ml-16 2xl:ml-16'>
        <div className='mt-20 pr-4'>

        {/* add continue reading here */}

          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            <Flame className='size-9' /> <span>Trending Now - Manga</span>
          </h1>
          <SliderM data={listAnimesTrendingA} title='trending' />
        </div>
        <div className='mt-20 pr-4'>
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            <Star className='size-9' /> All Time Popular - Manga
          </h1>
          <SliderM data={listAnimesReleasingByPopularity} title='popular' />
        </div>
        <div className='mt-20 pr-4'>
          <h1 className='mb-4 flex gap-1 text-3xl font-bold'>
            <Heart className='size-9' /> Most favorites - Manga
          </h1>
          <SliderM data={listAnimesReleasingByFAVOURITES} title='Favourites' />
        </div>
        {/* <div className='flex w-full flex-col justify-between pr-4 md:flex-row lg:flex-row'>
          <ColumnCard media={upcoming?.results?.slice(0, 10)!} />
          <ColumnCard
            media={seasonal?.results.slice(0, 10)!}
            title='Releasing This Season'
          />
        </div> */}
      </div>
    </>
    )
}
