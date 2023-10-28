export type OptionType = {
    id: string;
    name: string;
}

export type TaskTypeOption = {
    color: string;
    icon_id: string;
    id: number;
    option: string;
}

export const TEXT_FIELDS_TYPES = {
    leads: 'leads',
    contacts: 'contacts',
    companies: 'companies',
} as const;

type TextFieldsTypesConstKeys = keyof typeof TEXT_FIELDS_TYPES;

export type TaskTextFields = OptionType & {
    type: (typeof TEXT_FIELDS_TYPES)[TextFieldsTypesConstKeys];
}

export const OPTIONS_CREATE_TASKS_FOR = {
    leads: {
        id: 'leads',
        name: 'Для сделки',
    },
    contacts: {
        id: 'contacts',
        name: 'Для основного контакта',
    },
    companies: {
        id: 'companies',
        name: 'Для компании',
    },
} as const;

export const OPTIONS_TASK_TEXT_FIELDS = {
    all: {
        id: 'all',
        name: 'Все поля',
    },
    leads: {
        id: 'leads',
        name: 'Поля карточки сделки',
    },
    contacts: {
        id: 'contacts',
        name: 'Поля карточки контакта',
    },
    companies: {
        id: 'companies',
        name: 'Поля карточки компании',
    },
} as const;

export type OptionsTaskTextFieldsKeys = keyof typeof OPTIONS_TASK_TEXT_FIELDS;



