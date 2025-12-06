import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { GotmEvent } from "./Event";

async function saveEvent(event: GotmEvent): Promise<GotmEvent> {
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: event
    });
    await window.ddb.send(command);

    return event;
}

export { saveEvent };
