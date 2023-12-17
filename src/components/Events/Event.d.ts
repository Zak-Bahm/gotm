export interface EventFormType {
    title: string;
    description: string;
    endDate: number;
    public: boolean;
}

export interface GotmEvent {
    itemType: "event";
    itemId: string; // usr.id/events/endTs
    endTs: number;
    name: string;
    ownerId: string;
    createdTs: number;
    title: string;
    description: string;
    public: boolean;
    groupEventId: string // usr.id/group-events/endTs
}
