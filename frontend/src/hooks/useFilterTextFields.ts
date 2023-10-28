import { useMemo } from 'react';
import { OptionsTaskTextFieldsKeys, OPTIONS_TASK_TEXT_FIELDS, TaskTextFields, TEXT_FIELDS_TYPES } from '../types/selectTypes';

export const useFilterTextFields = (taskTextFields: TaskTextFields[], filter: typeof OPTIONS_TASK_TEXT_FIELDS[OptionsTaskTextFieldsKeys]): TaskTextFields[] => {
    const filteredTaskTextFields = useMemo(() => {
        if (!taskTextFields.length) {
            return taskTextFields;
        }

        switch (filter.id) {
            case OPTIONS_TASK_TEXT_FIELDS.all.id:
                return taskTextFields;

            case OPTIONS_TASK_TEXT_FIELDS.companies.id:
                return taskTextFields.filter(item => item.type === TEXT_FIELDS_TYPES.companies);

            case OPTIONS_TASK_TEXT_FIELDS.contacts.id:
                return taskTextFields.filter(item => item.type === TEXT_FIELDS_TYPES.contacts);

            case OPTIONS_TASK_TEXT_FIELDS.leads.id:
                return taskTextFields.filter(item => item.type === TEXT_FIELDS_TYPES.leads);
        }
    }, [taskTextFields, filter]);

    return filteredTaskTextFields;
}