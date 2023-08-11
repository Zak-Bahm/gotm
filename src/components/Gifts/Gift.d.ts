export interface GiftForm {
    title: string;
    description: string;
    store: string;
    url: string;
    cost: number;
}

export interface Gift {
    itemType: "gift";
    itemId: string; // usr.id/events/endTs/gifts/createdTs
    createdTs: number;
    title: string;
    description: string;
    store: string;
    url: string;
    cost: number;
    giverName: string;
    giverId: string;
}
