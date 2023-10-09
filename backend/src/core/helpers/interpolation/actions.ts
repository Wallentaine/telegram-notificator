import { BaseEntities } from './consts/BaseEntities';
import fieldOperations from './fieldOperations';
import { company, contact, lead } from './entities';
import { LeadData } from './types/amo-types/lead/lead';
import { Contact } from './types/amo-types/contacts/contact';
import { Company } from './types/amo-types/companies/company';

const actions = {
    [BaseEntities.Lead]: lead,
    [BaseEntities.Contact]: contact,
    [BaseEntities.Company]: company,
    getCustomFieldValue: (entity: LeadData | Contact | Company | null, fieldId: string): string | null => {
        const customField = fieldOperations.getCustomFieldById(entity?.custom_fields_values, fieldId);
        return customField ? fieldOperations.getValueByFieldType(customField) : null;
    },
};

export { actions };
