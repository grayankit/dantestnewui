"use client";

import {
  Book,
  // FlameIcon,
  HomeIcon,
  BookOpen,
  // Menu,
  SettingsIcon,
  Ellipsis,
  // StarIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";
import { ModeToggle } from "./ThemeToggle";
import useDeviceDetector from "../hooks/useDeviceDetector";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";
import Image from "next/image";

export default function SideBar() {
  const device = useDeviceDetector();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(device === "mobile");
  }, [device]);

  return (
    <>
      {!isMobile ? (
        <div className="fixed z-[999999] flex h-full flex-col items-center justify-center gap-2 px-1 pt-10">
          <div className="flex flex-col gap-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Link href="/">
                      <Button variant={"outline"} size={"icon"}>
                        <HomeIcon />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col gap-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Link href="/manga">
                      <Button variant={"outline"} size={"icon"}>
                        <BookOpen />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Manga</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* <div className='flex flex-col gap-2'>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link href='/trending'>
                      <Button variant={'outline'} size='icon'>
                        <FlameIcon className='hover:fill-slate-200' />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Trending</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link href='/popular'>
                      <Button variant={'outline'} size='icon'>
                        <StarIcon className='hover:fill-slate-200' />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Popular</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
          </div> */}
          <Separator className="my-2" />
          <div className="mb-2 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link href="/settings">
                      <Button variant={"outline"} size="icon">
                        <SettingsIcon />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link href="/catalog">
                      <Button variant={"outline"} size="icon">
                        <Book className="hover:fill-slate-200" />
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Catalog</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div>
                    <Link href="/waifu">
                      <Button variant={"outline"} size="icon">
                      <Image src="/waifu.png" alt="waifu" width={24} height={24}/>
                      </Button>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Waifu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div className="z-[999999] flex h-auto flex-row bg-gray-100 fixed bottom-6 left-[22%] rounded-xl dark:bg-gray-800">
          <div className="flex flex-row gap-4 p-2">
            <Link href="/">
              <Button variant={"outline"} size={"icon"}>
                <HomeIcon />
              </Button>
            </Link>
            <ModeToggle />
            <Link href="/manga">
              <Button variant={"outline"} size={"icon"}>
                <BookOpen />
              </Button>
            </Link>
            <Drawer>
              <DrawerTrigger>
                <Button variant="ghost">
                  <Ellipsis />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <Link href="/settings">
                  <Button variant={"outline"} size="icon">
                    <SettingsIcon />
                  </Button>
                </Link>{' '}
                <Link href="/catalog">
                  <Button variant={"outline"} size="icon">
                    <Book />
                  </Button>
                </Link>{' '}
                <Link href="/Waifu">
                  <Button variant={"outline"} size="icon">
                    <Image src="/waifu.png" alt="waifu" width={24} height={24}/>
                  </Button>
                </Link>{' '}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </>
  );
}
