import React, {useState} from 'react';
import CheckboxPrime from "../UI/checkbox/checkbox-prime/CheckboxPrime";
import {MultiSelect} from "react-multi-select-component";
import {TaskTextFields} from "../../types/selectTypes";
import cl from "../../views/dp-settings/dpSettings.module.scss";

type SelectFillFieldsProp = {
    formInputFields: { [x: string]: HTMLInputElement };
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
    placeholder: string;
    messageRef: React.RefObject<HTMLTextAreaElement>;
    taskTextFields: TaskTextFields[];
}

type OptionType = {
    value: any;
    label: string;
    key?: string;
    disabled?: boolean;
}

const overrideStrings = {
    allItemsAreSelected: 'Все варианты выбраны',
    clearSearch: 'Очистить поиск',
    clearSelected: 'Очистить выбранное',
    noOptions: 'Нет вариантов',
    search: 'Поиск',
    selectAll: 'Выбрать всё',
    selectAllFiltered: 'Выбрать всё (с фильтром)',
    selectSomeItems: '',
    create: 'Создать',
}

const options = [
    {label: "Переговоры", value: "4"},
    {label: "Принимают решение", value: "5"},
    {label: "Согласование договора", value: "6"},
];

const getFillFields = (fields: TaskTextFields[]) => {
    const preparedFields = fields.filter(({id}) => id !== 'id').map(({id, name, type}) => {
        const preparedField = {
            id,
            name: name.replace(/ контакта| компании| сделки/gm, ''),
            type
        };
        switch (type) {
            case "leads":
                return {
                    ...preparedField,
                    name: preparedField.name + ' сделки',
                }
            case "contacts":
                return {
                    ...preparedField,
                    name: preparedField.name + ' контакта',
                }
            case "companies":
                return {
                    ...preparedField,
                    name: preparedField.name + ' компании',
                }
        }
    })

    return preparedFields.map(({id, name, type}) => {
        let preparedType;

        switch (type) {
            case 'leads':
                preparedType = 'lead';
                break;
            case 'contacts':
                preparedType = 'contact';
                break;
            case 'companies':
                preparedType = 'company';
                break;
        }

        return {
            value: `${preparedType}.${id}`,
            label: name,
        }
    })
}

const getSelectedFillFields = (jsonValue: string, allFields: OptionType[]): OptionType[] => {
    const parsedValue: {fields: {fieldId: string; fieldName: string}[]} = JSON.parse(jsonValue || '{"fields":[]}');

    return allFields.filter(({value, label}) => parsedValue.fields.find(({fieldId}) => fieldId === value));
}

const SelectFillFields = ({formInputFields, setIsChanged, placeholder, messageRef, taskTextFields}: SelectFillFieldsProp) => {
    const [isRequiredFillFields, setIsRequiredFillFields] = useState<boolean>(formInputFields.requiredFillFields.value === 'true');
    const [isRequiredFillFieldsOnce, setIsRequiredFillFieldsOnce] = useState<boolean>(formInputFields.requiredFillFieldsOnce.value === 'true');
    const [fillFields, setFillFields] = useState<OptionType[]>(getFillFields(taskTextFields));
    const [selectedFillFields, setSelectedFillFields] = useState<OptionType[]>(getSelectedFillFields(formInputFields.requestFillFields.value, getFillFields(taskTextFields)));

    const handleEditRequiredFillFields = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRequiredFillFields(event.target.checked);
        formInputFields.requiredFillFields.value = String(event.target.checked);
        setIsChanged(true);
    }

    const handleEditRequiredFillFieldsOnce = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRequiredFillFieldsOnce(event.target.checked);
        formInputFields.requiredFillFieldsOnce.value = String(event.target.checked);
        setIsChanged(true);
    }

    const handleSelectFillFields = (value: OptionType[]) => {
        setSelectedFillFields(value);

        const preparedFillFields: {fields: {fieldId: string; fieldName: string}[]} = {fields: []};

        value.forEach(({value, label}) => {
            preparedFillFields.fields.push({
                fieldId: value,
                fieldName: label,
            })
        })

        formInputFields.requestFillFields.value = JSON.stringify(preparedFillFields);

        if (messageRef?.current) {
            messageRef.current.dispatchEvent(new Event('change', {bubbles: true}));
        }

        setIsChanged(true);
    }

    return (
        <>
            <CheckboxPrime
                name='isRequiredFillFields'
                title='Заполнять поля'
                isActive={isRequiredFillFields}
                onChange={handleEditRequiredFillFields}
            />

            {isRequiredFillFields &&
                <>
                    <MultiSelect
                        options={fillFields}
                        value={selectedFillFields}
                        onChange={handleSelectFillFields}
                        labelledBy="Select fill fields"
                        overrideStrings={{...overrideStrings, selectSomeItems: placeholder}}
                    />
                    <div className={cl['dp-settings__check-once']}>
                        <CheckboxPrime
                            name='isRequiredFillFieldsOnce'
                            title='Заполнять каждое поле единожды'
                            isActive={isRequiredFillFieldsOnce}
                            onChange={handleEditRequiredFillFieldsOnce}
                        />
                    </div>
                </>
            }
        </>
    );
};

export default SelectFillFields;
