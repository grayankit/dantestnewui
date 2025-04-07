import React from 'react'
import styles from "./page.module.css"
import KeepWatchingResults from './components/KeepWatchingResults'
import NavigationSideBar from './components/NavigationSideBar'
import SelectSort from '../components/SelectSortInputs'

export async function generateMetadata() {

    return {
        title: `History | Dantotsu`,
        description: `User History of Medias Watched.`,
    }
}

async function HistoryPage({ searchParams }: { searchParams: Promise<{ format: string, sort: "title_desc" | "title_asc" }> } ) {
    const Params = await searchParams

    return (
        <main id={styles.container}>

            <div id={styles.side_nav_container}>

                <NavigationSideBar
                    params={Params}
                />

            </div>

            <section id={styles.main_content_container}>

                <div id={styles.heading_container}>

                    <h1>Latests Watched</h1>

                    <SelectSort
                        customSelectInputOptions={[
                            { name: "From A to Z", value: "title_asc" },
                            { name: "From Z to A", value: "title_desc" },
                        ]}
                    />

                </div>

                <KeepWatchingResults params={Params} />

            </section>

        </main>
    )
}

export default HistoryPage