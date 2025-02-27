export function formatDate(isoString) {
    const date = new Date(isoString);

    // Options for formatting the date
    const options = {
        year: "numeric",
        month: "long", // "short" for abbreviated month
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short"
    };

    return date.toLocaleString("en-US", options);
}