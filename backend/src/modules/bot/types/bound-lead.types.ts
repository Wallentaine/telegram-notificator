import { LeadData } from '../../../core/helpers/interpolation/types/amo-types/lead/lead';
import { Contact } from '../../../core/helpers/interpolation/types/amo-types/contacts/contact';
import { Company } from '../../../core/helpers/interpolation/types/amo-types/companies/company';

export type BoundLead = {
    lead: LeadData;
    contact: Contact | null;
    company: Company | null;
};
