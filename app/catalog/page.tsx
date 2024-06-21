import CatalogComponent from './catalogComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalog | Dantotsu',
  description: "A anime platform that showcases popular and trending animes, mangas and movies. Explore the latest releases, keep watching your favorites, and discover what's popular in the anime world.",
}

export default function Catalog() {
  

  return (
    <div>
      <CatalogComponent/>
    </div>
  );
}
