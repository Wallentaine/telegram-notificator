import { AmoFieldTypes } from './consts/amoFieldTypes';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Customfield, CustomfieldValue, legalEntity } from './types/amo-types/customField/customField';

dayjs.extend(utc);

const THOUSAND_MILLI_SECONDS = 1000;

class FieldOperations {
    getCustomFieldById = (customFields: Array<Customfield> | null | undefined, fieldId: string): Customfield | undefined | null =>
        customFields ? customFields.find((item) => String(item.field_id || item.id) === String(fieldId)) : null;

    getValueByFieldType = (customField: Customfield): string | null => {
        switch (customField.field_type) {
            case AmoFieldTypes.Text:
            case AmoFieldTypes.Multitext:
            case AmoFieldTypes.Url:
            case AmoFieldTypes.Streetaddress: {
                return <string>this.getFieldValue(customField);
            }
            case AmoFieldTypes.Numeric: {
                return String(this.getFieldValue(customField) ? <number>this.getFieldValue(customField) : '0');
            }
            case AmoFieldTypes.DateTime: {
                return this.getFieldValue(customField)
                    ? String(<string>this.getHumanizeDateTimeFromUnix(<number>this.getFieldValue(customField)))
                    : null;
            }
            case AmoFieldTypes.Date:
            case AmoFieldTypes.Birthday: {
                return this.getFieldValue(customField)
                    ? <string>this.getHumanizeDateFromUnix(<number>this.getFieldValue(customField))
                    : null;
            }
            case AmoFieldTypes.SmartAddress:
            case AmoFieldTypes.Multiselect:
            case AmoFieldTypes.Select:
            case AmoFieldTypes.Radiobutton: {
                return this.getFieldValues(customField) && this.getFieldValues(customField).length > 1
                    ? <string>this.getFieldValues(customField).join(', ')
                    : String(<string>this.getFieldValues(customField).join(', '));
            }
            case AmoFieldTypes.Checkbox: {
                return this.getFieldValue(customField) ? 'Да' : 'Нет';
            }
            case AmoFieldTypes.LegalEntity: {
                return <legalEntity>this.getFieldValue(customField) &&
                    Object.values(<legalEntity>this.getFieldValue(customField)).length > 1
                    ? String([Object.values(<legalEntity>this.getFieldValue(customField))])
                    : Object.values(<legalEntity>this.getFieldValue(customField)).join(', ');
            }
            default:
                return null;
        }
    };

    private getHumanizeDateFromUnix = (unixTimeStamp: number): string => {
        const time = unixTimeStamp * THOUSAND_MILLI_SECONDS;
        return dayjs(time).utcOffset(3).format('DD.MM.YYYY');
    };

    private getHumanizeDateTimeFromUnix = (unixTimeStamp: number): string => {
        const time = unixTimeStamp * THOUSAND_MILLI_SECONDS;
        return dayjs(time).utcOffset(3).format('DD.MM.YYYY HH:mm');
    };

    private getFieldValue = (field: Customfield): CustomfieldValue | null => {
        if (field && field.values && field.values.length) {
            const [fieldValue] = field.values;
            return fieldValue.value || null;
        }
        return null;
    };

    private getFieldValues = (field: Customfield): CustomfieldValue[] => {
        if (field && field.values && field.values.length) {
            return field ? field.values.map((item) => item.value) : [];
        }
        return [];
    };
}

export default new FieldOperations();
