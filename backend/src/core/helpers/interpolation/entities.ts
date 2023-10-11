import { BaseFieldsNames } from './consts/BaseFieldsNames';
import { LeadData } from './types/amo-types/lead/lead';
import { Contact } from './types/amo-types/contacts/contact';
import { Company } from './types/amo-types/companies/company';

const lead = {
    [BaseFieldsNames.Lead.Id]: (lead: LeadData) => lead.id,
    [BaseFieldsNames.Lead.Name]: (lead: LeadData) => lead.name,
    [BaseFieldsNames.Lead.Price]: (lead: LeadData) => lead.price || '0',
};

const contact = {
    [BaseFieldsNames.Contact.Id]: (contact: Contact) => contact.id,
    [BaseFieldsNames.Contact.Name]: (contact: Contact) => contact.name,
};

const company = {
    [BaseFieldsNames.Company.Id]: (company: Company) => company.id,
    [BaseFieldsNames.Company.Name]: (company: Company) => company.name,
};

export { lead, contact, company };
