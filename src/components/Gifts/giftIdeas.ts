import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Gift, GiftIdea } from "./Gift";

function newGiftIdeaId(createdTs: number): string {
    const userId = window.usr?.id || '';
    return `${userId}/gift-ideas/${createdTs}`;
}

function buildGiftIdea(payload: Partial<Omit<GiftIdea, 'itemType' | 'itemId' | 'createdTs' | 'creatorId'>>): GiftIdea {
    const createdTs = Date.now();
    return {
        itemType: "gift-idea",
        itemId: newGiftIdeaId(createdTs),
        createdTs,
        creatorId: window.usr?.id || '',
        title: payload.title || '',
        description: payload.description || '',
        store: payload.store || '',
        url: payload.url || '',
        cost: typeof payload.cost === 'number' ? payload.cost : 0
    };
}

function buildGiftIdeaFromGift(gift: Gift): GiftIdea {
    return buildGiftIdea({
        title: gift.title,
        description: gift.description,
        store: gift.store,
        url: gift.url,
        cost: gift.cost
    });
}

function buildGiftIdeaFromTitle(title: string): GiftIdea {
    return buildGiftIdea({ title });
}

function giftIdeaToGift(eventId: string, idea: GiftIdea): Gift {
    const createdTs = Date.now();
    return {
        itemType: "gift",
        itemId: `${eventId}/gifts/${createdTs}`,
        createdTs,
        creatorId: window.usr?.id || '',
        title: idea.title || '',
        description: idea.description || '',
        store: idea.store || '',
        url: idea.url || '',
        cost: typeof idea.cost === 'number' ? idea.cost : 0,
        giverName: '',
        giverId: ''
    };
}

async function saveGiftIdea(idea: GiftIdea): Promise<GiftIdea> {
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: idea
    });
    await window.ddb.send(command);
    return idea;
}

async function deleteGiftIdea(itemId: string): Promise<boolean> {
    const command = new DeleteCommand({
        TableName: window.app.tableName,
        Key: {
            itemType: "gift-idea",
            itemId
        }
    });
    const resp = await window.ddb.send(command);
    return resp.$metadata.httpStatusCode === 200;
}

export { buildGiftIdeaFromGift, buildGiftIdeaFromTitle, saveGiftIdea, deleteGiftIdea, giftIdeaToGift };
