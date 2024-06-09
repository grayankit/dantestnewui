"use client";

import { Media } from "@/app/types/api";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
// import { Button } from '../ui/button';
import Link from "next/link";
import { RelationData } from "@/app/lib/info";
import { ApiDefaultResult } from "@/app/ts/interfaces/apiAnilistDataInterface";
import { Image } from "@nextui-org/react";
// import { Info, Play } from 'lucide-react';

export const SliderCard = ({ anime }: { anime: Media | ApiDefaultResult }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mediaSelect, setMediaSelected] = useState<ApiDefaultResult | null>(
    null
  );

  // if (media) {
  //   setSelectedId(media);
  //   setMediaSelected(
  //     mediaList.find(
  //       (item) => item.id == media
  //     ) as SetStateAction<ApiDefaultResult | null>
  //   );

  //   return;
  // }

  // setSelectedId(null);
  // setIsTrailerBeeingShown(false);
  // setMediaSelected(null);

  return (
    <Link className="relative z-50" href={`/media/${anime.id}`}>
      <div
        className="relative hover:cursor-pointer hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Image
            src={
              (anime as Media).coverImage
                ? (anime as Media).coverImage!
                : (anime as ApiDefaultResult).image!
            }
            alt={
              anime.title.userPreferred! ??
              anime.title.english! ??
              anime.title.romaji! ??
              anime.title.native!
            }
            height={400}
            isBlurred
            radius="none"
            width={300}
            className="max-h-[205px] min-h-[205px] min-w-[165px] max-w-[165px] object-cover"
          />
        </motion.div>
        {/* {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='absolute inset-0 flex items-center justify-center gap-4'
        >
          <Link
            className='relative z-50'
            href={`/info/${anime.id}?releasing=${anime.status === 'RELEASING'}`}
          >
            <Button className='cursor-pointer'>
              <Tooltip content='Info'>
                <Info />
              </Tooltip>
            </Button>
          </Link>
          <Link
            className='relative z-50'
            href={`/info/${anime.id}?releasing=${anime.status === 'RELEASING'}#watch`}
          >
            <Button className='cursor-pointer' variant={'secondary'}>
              <Tooltip content='Watch'>
                <Play />
              </Tooltip>
            </Button>
          </Link>
        </motion.div>
      )} */}
        <div className="absolute inset-0 top-0 z-[10]">
          <div className="flex justify-between">
            <Badge>{anime.status}</Badge>
            <Badge variant={"secondary"}>
              {(anime as Media).format
                ? (anime as Media).format
                : (anime as ApiDefaultResult).relationType}
            </Badge>
          </div>
        </div>
        <motion.h1 className="max-w-[165px] truncate font-semibold">
          {anime.title.english ??
            anime.title.userPreferred ??
            anime.title.romaji ??
            anime.title.native ??
            ""}
        </motion.h1>
        <div className="flex gap-2 text-xs font-bold">
          <p>{(anime as Media).totalEpisodes}</p>{" "}
          <div className="h-4 w-[1px] bg-gray-400" />
          <p>
            {(anime as Media).season
              ? (anime as Media).season
              : (anime as ApiDefaultResult).status}
          </p>
          <div className="h-4 w-[1px] bg-gray-400" />
          <p>{anime.type}</p>
        </div>
      </div>
      //{" "}
    </Link>
  );
};
