const numBase = 36;

function encodeEventPath(eventPath: string): string | false {
    // remove leading slash and break into its components
    eventPath.replace(/^\//g, '');
    const pathParts = eventPath.split("/");

    // validate parts
    if (pathParts.length != 3 || pathParts[1] !== 'events') return false;

    // encode other parts and re-assemble
    let fullPath = '';
    try {
        const userId = BigInt(pathParts[0]).toString(numBase);
        const eventId = BigInt(pathParts[2]).toString(numBase);

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
        const userId = parseBigInt(pathParts[0]).toString();
        const eventId = parseBigInt(pathParts[2]).toString();

        fullPath = `${userId}/events/${eventId}`;
    } catch (error) {
        return false;
    }

    return fullPath;
}

function parseBigInt(numberString: string, keyspace = "0123456789abcdefghijklmnopqrstuvwxyz", ) {
    let result = 0n;
    const keyspaceLength = BigInt(keyspace.length);
    for (let i = 0; i < numberString.length; i++) {
        const value = keyspace.indexOf(numberString[i]);
        if (value === -1) throw new Error("invalid string");
        result = result * keyspaceLength + BigInt(value);
    }
    return result;
}

export { encodeEventPath, decodeEventPath }
