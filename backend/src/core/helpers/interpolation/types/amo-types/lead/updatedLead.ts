type UpdatedDealItemResponse = {
    id: number;
    updated_at: number;
    request_id: string;
};

export type UpdatedDealResponse = {
    _links: {
        self: {
            href: string;
        }
    },
    _embedded: {
        leads: UpdatedDealItemResponse[];
    }
}