const numBase = 36;

function encodeEventPath(eventPath: string): string | false {
    // remove leading slash and break into its components
    eventPath = eventPath.replace(/^\//g, '');
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
    eventPath = eventPath.replace(/^\//g, '');
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

function checkOwnerShip(itemPath: string = ''): boolean {
    // if itemPath is empty, use current path
    if (itemPath === '') itemPath = window.location.pathname;

    // remove leading slash and break into its components
    itemPath = itemPath.replace(/^\//g, '');
    const pathParts = itemPath.split("/");

    // ensure at least 1 part exists
    if (pathParts.length < 1) return false;

    // decode user-id part if necessary
    let idStr = pathParts[0];
    if (/[a-zA-Z]/.test(idStr)) {
        idStr = parseBigInt(pathParts[0]).toString();
    }

    return idStr === window.usr?.id;
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

export { encodeEventPath, decodeEventPath, checkOwnerShip }
