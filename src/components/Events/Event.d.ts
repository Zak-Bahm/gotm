export interface EventForm {
    title: string;
    description: string;
    endDate: number;
    public: boolean;
}

export interface GotmEvent {
    itemType: string;
    itemId: string;
    endTs: number;
    name: string;
    ownerId: string;
    createdTs: number;
    title: string;
    description: string;
    public: boolean;
}
