import { actions } from './actions';
import { RegexExpressions } from './consts/regexExpressions';
import { BaseEntities, PickedEntities as PickedEntitiesKeys } from './consts/BaseEntities';
import { PickedEntities } from './types/PickedEntities';
import { embedded, LeadData } from './types/amo-types/lead/lead';
import { Contact as EmbeddedContact } from './types/amo-types/embeddedEntities/embeddedEntities';
import { Contact } from './types/amo-types/contacts/contact';
import { Company } from './types/amo-types/companies/company';

class Interpolation {
    public isExistInterpolation = (text: string): boolean => new RegExp(RegexExpressions.SearchInterpolation).test(text);

    public getPickedEntities = (embeddedFields: embedded): PickedEntities => {
        const pickedEntity: PickedEntities = {};
        Object.keys(embeddedFields).forEach((embeddedFieldKey) => {
            switch (embeddedFieldKey) {
                case PickedEntitiesKeys.Contacts:
                    {
                        pickedEntity[PickedEntitiesKeys.Contacts] =
                            pickedEntity[PickedEntitiesKeys.Contacts] || embeddedFields[embeddedFieldKey];
                    }
                    break;
                case PickedEntitiesKeys.Companies:
                    pickedEntity[PickedEntitiesKeys.Companies] =
                        pickedEntity[PickedEntitiesKeys.Companies] || embeddedFields[embeddedFieldKey];
                    break;
                default:
                    break;
            }
        });

        return pickedEntity || null;
    };

    public getMainContact = (contacts: Array<EmbeddedContact>) => contacts.find((contact) => contact.is_main);

    public interpolateText = (text: string, deal: LeadData, contact: Contact | null, company: Company | null): string => {
        let updatedText = text;

        const fieldsMatches = text.match(RegexExpressions.SearchOutsideBrackets);

        if (Array.isArray(fieldsMatches)) {
            fieldsMatches.forEach((field) => {
                field = field.replace(RegexExpressions.SearchEmptySpace, '');

                const [entity, fieldData] = field.split('.');

                if (entity) {
                    const mainEntity: LeadData | Contact | Company | null = this.defineMainEntity(entity, deal, contact, company);

                    updatedText = updatedText.replace(
                        RegexExpressions.SearchLocalBraces,
                        this.changeFieldValue(entity, fieldData, mainEntity)
                    );
                }
            });
        }

        return updatedText;
    };

    private defineMainEntity = (
        entity: string,
        deal: LeadData,
        contact: Contact | null,
        company: Company | null
    ): LeadData | Contact | Company | null => {
        switch (entity) {
            case BaseEntities.Lead:
                return deal;
            case BaseEntities.Contact:
                return contact;
            case BaseEntities.Company:
                return company;
            default:
                return null;
        }
    };

    private changeFieldValue = (entity: string, fieldData: string, mainEntity: LeadData | Contact | Company | null): string => {
        const noDataError = '( Нет данных )';

        if (!actions.hasOwnProperty(entity)) {
            return noDataError;
        }

        if (!actions[entity].hasOwnProperty(fieldData) && !RegexExpressions.SearchCustomField.test(fieldData)) {
            return noDataError;
        }

        if (!mainEntity) {
            return noDataError;
        }

        return (
            (new RegExp(RegexExpressions.SearchCustomField).test(fieldData)
                ? actions.getCustomFieldValue(mainEntity, String([fieldData.match(RegexExpressions.SearchCustomField)]))
                : actions[entity][fieldData](mainEntity) || noDataError) || noDataError
        );
    };
}

export default new Interpolation();
