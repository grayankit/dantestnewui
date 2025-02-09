import React from 'react'
import styles from "./page.module.css"
import PlaylistItemsResults from './components/PlaylistItemsResults'
import NavigationSideBar from './components/NavigationSideBar'
import SelectSort from '../components/SelectSortInputs'

export async function generateMetadata() {

    return {
        title: `Favourites | Dantotsu`,
        description: `User Watchlist.`,
    }
}

async function PlaylistPage(
    props: { params?: Promise<unknown>, searchParams?: Promise<{ format: string, sort: "title_desc" | "title_asc" }> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;

    return (
        <main id={styles.container}>

            <div id={styles.side_nav_container}>

                <NavigationSideBar
                    params={searchParams}
                />

            </div>

            <section id={styles.main_content_container}>

                <div id={styles.heading_container}>

                    <h1>Favourites</h1>

                    <SelectSort
                        customSelectInputOptions={[
                            { name: "From A to Z", value: "title_asc" },
                            { name: "From Z to A", value: "title_desc" },
                        ]}
                    />

                </div>

                <PlaylistItemsResults
                    params={searchParams}
                />

            </section>

        </main>
    )
}

export default PlaylistPage