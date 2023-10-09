import { Company, Contact } from './amo-types/embeddedEntities/embeddedEntities';

export type PickedEntities = {
    contacts?: Contact[];
    companies?: Company[];
};
