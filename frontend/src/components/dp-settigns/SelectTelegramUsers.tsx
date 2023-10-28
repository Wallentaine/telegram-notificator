import React, {useEffect, useState} from 'react';
import {MultiSelect} from "react-multi-select-component";
import {fetchUsers} from "../../api/telegramUsersAPI";

type OptionType = {
    value: any;
    label: string;
    key?: string;
    disabled?: boolean;
}

type SelectTelegramUsersProp = {
    placeholder: string;
    formInputFields: { [x: string]: HTMLInputElement };
    messageRef: React.RefObject<HTMLTextAreaElement>;
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

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

function SelectTelegramUsers({placeholder, formInputFields, messageRef, setIsChanged}: SelectTelegramUsersProp): JSX.Element {
    const [telegramUsers, setTelegramUsers] = useState<OptionType[]>([]);
    const [selectedTelegramUsers, setSelectedTelegramUsers] = useState<OptionType[]>([])

    const getUsers = async () => {
        const users = await fetchUsers();
        const preparedUsers: OptionType[] =  users.map(({telegramId, telegramUserName, amoUserName}) => {
            return {
                label: amoUserName ? amoUserName : telegramUserName,
                value: String(telegramId)
            }
        })

        setTelegramUsers(preparedUsers);
        setSelectedTelegramUsers(preparedUsers.filter(({value}) => formInputFields.subscribers.value.split(',').includes(value)));
    }

    const handleSelectedTelegramUsers = (value: OptionType[]) => {
        setSelectedTelegramUsers(value);
        formInputFields.subscribers.value = value.map(({value}) => value).join(',');

        if (messageRef?.current) {
            messageRef.current.dispatchEvent(new Event('change', {bubbles: true}));
        }
        setIsChanged(true);
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <MultiSelect
            options={telegramUsers}
            value={selectedTelegramUsers}
            onChange={handleSelectedTelegramUsers}
            labelledBy="Select"
            overrideStrings={{...overrideStrings, selectSomeItems: placeholder}}
        />
    );
}

export default SelectTelegramUsers;
