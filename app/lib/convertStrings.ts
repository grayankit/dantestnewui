// REMOVES ANY CHAR BESIDES ALPHABETIC
export function stringToUrlFriendly(text: string) {

    const newText = text.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()

    return newText

}

// REMOVES ANY CHAR BESIDES ALPHABETIC and ADDS SPACE BETWEEN
export default function stringToOnlyAlphabetic(text: string) {

    const newText = text.replace(/[^a-zA-Z ]/g, " ");
    const supnewText = newText.replace(/" "/g,"-");

    return supnewText

}