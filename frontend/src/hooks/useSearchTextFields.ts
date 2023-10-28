import { useMemo } from 'react';
import { TaskTextFields } from '../types/selectTypes';

export const useSearchTextFields = (taskTextFields: TaskTextFields[], searchQuery: string): TaskTextFields[] => {
    const searchedTaskTextFields = useMemo(() => {
        if (!taskTextFields.length || searchQuery === '') {
            return taskTextFields;
        }

        const treatedSearchQuery = searchQuery.trim().toLowerCase();

        return taskTextFields.filter(item =>
            item.name.toLowerCase().includes(treatedSearchQuery)
        );
    }, [taskTextFields, searchQuery]);

    return searchedTaskTextFields;
}