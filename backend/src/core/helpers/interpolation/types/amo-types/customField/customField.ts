export type legalEntity = {
    name?: string;
    entity_type?: number;
    vat_id?: string;
    tax_registration_reason_code?: string;
    address?: string;
    kpp?: string;
    external_uid?: string;
};

export type Customfield = {
    id?: number;
    field_id?: number;
    field_name?: string;
    field_code?: string | null;
    field_type?: string;
    values?: Array<CustomfieldValues>;
};

export type CustomfieldValue = string | boolean | number | legalEntity | undefined;

export type CustomfieldValues = {
    value?: CustomfieldValue;
    enum_id?: number;
    enum?: string;
    enum_code?: string;
};
