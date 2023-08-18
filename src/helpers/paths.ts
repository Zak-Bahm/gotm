function encodeEventPath(eventPath: string): string | false {
    // remove leading slash and break into its components
    eventPath.replace(/^\//g, '');
    const pathParts = eventPath.split("/");

    // validate parts
    if (pathParts.length != 3 || pathParts[1] !== 'events') return false;

    // encode other parts and re-assemble
    let fullPath = '';
    try {
        const userId = parseInt(pathParts[0]).toString(36);
        const eventId = parseInt(pathParts[2]).toString(36);

        fullPath = `${userId}/events/${eventId}`;
    } catch (error) {
        return false;
    }

    return fullPath;
}

function decodeEventPath(eventPath: string): string | false {
    // remove leading slash and break into its components
    eventPath.replace(/^\//g, '');
    const pathParts = eventPath.split("/");

    // validate parts
    if (pathParts.length != 3 || pathParts[1] !== 'events') return false;

    // decode other parts and re-assemble
    let fullPath = '';
    try {
        const userId = parseInt(pathParts[0], 36);
        const eventId = parseInt(pathParts[2], 36);

        fullPath = `${userId}/events/${eventId}`;
    } catch (error) {
        return false;
    }

    return fullPath;
}

export { encodeEventPath, decodeEventPath }
