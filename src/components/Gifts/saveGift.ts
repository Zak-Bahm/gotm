import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Gift } from "./Gift";

async function saveGift(gift: Gift): Promise<Gift> {
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: gift
    });
    await window.ddb.send(command);

    return gift;
}

export { saveGift };
