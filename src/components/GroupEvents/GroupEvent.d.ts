export interface GroupEventFormType {
    title: string;
    description: string;
    endDate: number;
    public: boolean;
}

export interface GroupEvent {
    itemType: "group-event";
    itemId: string; // usr.id/group-events/endTs
    endTs: number;
    createdTs: number;
    name: string;
    ownerId: string;
    title: string;
    description: string;
    public: boolean;
    events: string[]; // list of GotmEvent ids
}
