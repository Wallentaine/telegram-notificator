import {
    OptionsTaskTextFieldsKeys,
    OPTIONS_TASK_TEXT_FIELDS,
    TaskTextFields,
} from '../types/selectTypes';
import { useFilterTextFields } from './useFilterTextFields';
import { useSearchTextFields } from './useSearchTextFields';

export const useSearchFilterTextFields = (taskTextFields: TaskTextFields[], searchQuery: string, filter: typeof OPTIONS_TASK_TEXT_FIELDS[OptionsTaskTextFieldsKeys]): TaskTextFields[] => {
    const searchedTextFields = useSearchTextFields(taskTextFields, searchQuery);
    const searchedFilteredTextFields = useFilterTextFields(searchedTextFields, filter);

    return searchedFilteredTextFields;
}