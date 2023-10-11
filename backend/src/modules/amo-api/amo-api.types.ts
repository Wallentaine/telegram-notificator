export type TokensResponse = {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
};

export type AmoAccount = {
    id: number;
    name: string;
    subdomain: string;
    created_at: number;
    created_by: number;
    updated_at: number;
    updated_by: number;
    current_user_id: number;
    country: string;
    customers_mode: string;
    is_unsorted_on: boolean;
    is_loss_reason_enabled: boolean;
    is_helpbot_enabled: boolean;
    is_technical_account: boolean;
    contact_name_display_order: number;
    amojo_id: string;
    uuid: string;
    version: number;
};

type CustomFieldValues = {
    value?: string | boolean | number;
    enum_id?: number;
    enum?: string;
    enum_code?: string;
};

export type CustomField = {
    field_id?: number;
    field_name?: string;
    field_code?: string | null;
    field_type?: string;
    values?: CustomFieldValues[];
};

export type CreatedLeadEmbedded = {
    id: number;
    request_id: string;
    _links: {
        self: {
            href: string;
        };
    };
};

export type CreatedLead = {
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        leads?: CreatedLeadEmbedded[];
    };
};

type Tag = {
    id: number;
    name: string;
    color: string | null;
};

type EmbeddedLead = {
    id: number;
    _links?: {
        self: {
            href: string;
        };
    };
};

type EmbeddedContact = {
    id?: number;
    is_main?: boolean | null;
    _links?: {
        self: {
            href: string;
        };
    };
};

type EmbeddedCompany = {
    id: number;
    _links?: {
        self: {
            href: string;
        };
    };
};

type AmoLeadEmbedded = {
    tags?: Tag[] | null;
    leads?: EmbeddedLead[];
    contacts?: EmbeddedContact[];
    companies?: EmbeddedCompany[];
};

export type AmoLead = {
    id?: number;
    name?: string;
    price?: number;
    responsible_user_id?: number;
    group_id?: number;
    status_id?: number;
    pipeline_id?: number;
    loss_reason_id?: number | null;
    created_by?: number;
    updated_by?: number;
    created_at?: number;
    updated_at?: number;
    closed_at?: number | null;
    closest_task_at?: null;
    is_deleted?: boolean;
    custom_fields_values?: CustomField[] | null;
    score?: number | null;
    source_id?: number | null;
    account_id?: number;
    labor_cost?: number | null;
    is_price_computed?: boolean;
    is_price_modified_by_robot?: boolean;
    _links?: {
        self: {
            href: string;
        };
    };
    _embedded?: AmoLeadEmbedded;
};

export type AmoContact = {
    id?: number;
    name?: string;
    first_name?: string;
    last_name?: string;
    responsible_user_id?: number;
    group_id?: number;
    created_by?: number;
    updated_by?: number;
    created_at?: number;
    updated_at?: number;
    is_deleted?: boolean;
    is_unsorted?: boolean;
    closest_task_at?: number | null;
    custom_fields_values?: CustomField[] | null;
    account_id?: number;
    _links?: {
        self: {
            href: string;
        };
    };
    _embedded?: {
        tags?: Tag[];
        companies?: EmbeddedCompany[];
        contacts?: EmbeddedContact[];
    };
};

export type CreatedContactEmbedded = {
    id?: number;
    request_id?: string;
    _links?: {
        self: {
            href: string;
        };
    };
};

export type CreatedContact = {
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        contacts: CreatedContactEmbedded[];
    };
};

export type CommonType = {
    text: string;
};

export type CallinType = {
    uniq: string;
    duration: number;
    source: string;
    link: string;
    phone: string;
};

export type CallOutType = {
    uniq: string;
    duration: number;
    source: string;
    link: string;
    phone: string;
};

export type ServiceMessageType = {
    service: string;
    text: string;
};

export type MessageCshierType = {
    status: string;
    text: string;
};

export type GeolocationType = {
    text: string;
    address: string;
    longitude: string;
    latitude: string;
};

export type SmsInType = {
    text: string;
    phone: string;
};

export type SmsOutType = {
    text: string;
    phone: string;
};

export type Note = {
    id: number;
    entity_id: number;
    created_by: number;
    updated_by: number;
    created_at: number;
    updated_at: number;
    responsible_user_id: number;
    group_id: number;
    note_type: string;
    params: CommonType | CallinType | CallOutType | ServiceMessageType | MessageCshierType | GeolocationType | SmsInType | SmsOutType;
    account_id: number;
    _links: {
        self: {
            href: string;
        };
    };
};

export type NoteList = {
    _page: number;
    _links: {
        self: {
            href: string;
        };
        next?: {
            href: string;
        };
    };
    _embedded: {
        notes: Note[] | null;
    };
};

export type CreatedNote = {
    entity_id?: number;
    created_by?: number;
    note_type: string;
    params: CommonType;
    request_id?: string;
    is_need_to_trigger_digital_pipeline?: boolean;
};

export type UnsortedLead = {
    uid: string;
    source_uid: null;
    source_name: string;
    category: string;
    pipeline_id: number;
    created_at: number;
    metadata: {
        from: string;
        phone: number;
        called_at: number;
        duration: string;
        link: string | null;
        service_code: string;
    };
    account_id: number;
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        contacts: [
            {
                id: number;
                _links: {
                    self: {
                        href: string;
                    };
                };
            },
        ];
        leads: [
            {
                id: number;
                _links: {
                    self: {
                        href: string;
                    };
                };
            },
        ];
        companies: [
            {
                id: number;
                _links: {
                    self: {
                        href: string;
                    };
                };
            },
        ];
    };
};

export type UnsortedData = {
    _page: number;
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        unsorted: UnsortedLead[];
    };
};
