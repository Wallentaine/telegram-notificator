import React, {useState} from 'react';
import SelectPrimeItem from "../UI/select/select-prime-item/SelectPrimeItem";
import {OPTIONS_TASK_TEXT_FIELDS, OptionsTaskTextFieldsKeys, TaskTextFields} from "../../types/selectTypes";
import InputPrime from "../UI/input/input-prime/InputPrime";
import cl from "../../views/dp-settings/dpSettings.module.scss";
import {useSearchFilterTextFields} from "../../hooks/useSearcFilterTaskTextFields";

type AddInterpolationFieldProp = {
    taskTextFields: TaskTextFields[];
    handleInputChange: (value: string) => void;
    messageText: string;
}

function AddInterpolationField({handleInputChange, messageText, taskTextFields}: AddInterpolationFieldProp) {
    const [searchQueryTaskFields, setSearchQueryTaskFields] = useState<string>('');
    const [selectedTaskFields, setSelectedTaskFields] = useState<typeof OPTIONS_TASK_TEXT_FIELDS[OptionsTaskTextFieldsKeys]>(OPTIONS_TASK_TEXT_FIELDS.all);

    const handleChangeSelectedTaskFields = (key: OptionsTaskTextFieldsKeys): void => {
        setSelectedTaskFields(OPTIONS_TASK_TEXT_FIELDS[key]);
    }

    const searchedFilteredTaskFields = useSearchFilterTextFields(taskTextFields, searchQueryTaskFields, selectedTaskFields);

    const preparedFields = searchedFilteredTaskFields.filter(({id}) => id !== 'id').map(({id, name, type}) => {
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

    return (
        <>
            <SelectPrimeItem<typeof OPTIONS_TASK_TEXT_FIELDS>
                changeSelect={handleChangeSelectedTaskFields}
                options={OPTIONS_TASK_TEXT_FIELDS}
                selected={selectedTaskFields}
            />
            <InputPrime
                name='searchQueryTaskFields'
                type='text'
                value={searchQueryTaskFields}
                onChange={setSearchQueryTaskFields}
                placeholder='Начните вводить название поля ...'
            />

            <div className={cl['dp-settings__vars-container']}>
                {
                    preparedFields.map(({name, type, id}) => {
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

                        const macros = `{{ ${preparedType}.${isNaN(+id) ? id : 'cf(' + id + ')'} }}`;

                        return (
                            <span
                                onClick={() => handleInputChange(`${messageText}${macros}`)}
                            >
                                {name}
                            </span>
                        )
                    })
                }
            </div>
        </>
    );
}

export default AddInterpolationField;
