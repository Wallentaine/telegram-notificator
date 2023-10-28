import React, {memo, useEffect, useRef, useState} from 'react';
import cl from './dpSettings.module.scss';
import {
    TaskTextFields
} from '../../types/selectTypes';
import SelectTelegramUsers from "../../components/dp-settigns/SelectTelegramUsers";
import AddInterpolationField from "../../components/dp-settigns/AddInterpolationField";
import RequiredDescription from "../../components/dp-settigns/RequiredDescription";
import SelectSwapStage from "../../components/dp-settigns/SelectSwapStage";
import SelectFillFields from "../../components/dp-settigns/SelectFillFields";
import {Button} from "@mui/material";

type DPSettingsProps = {
    taskTextFields: TaskTextFields[],
    formInputFields: { [x: string]: HTMLInputElement },
    saveButton: HTMLButtonElement,
    currentStageId: string
}


const DPSettings = memo(({formInputFields, saveButton, taskTextFields, currentStageId}: DPSettingsProps): JSX.Element => {
    const [messageText, setMessageText] = useState<string>(formInputFields.message.value);

    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);

    const [isChanged, setIsChanged] = useState<boolean>(false);

    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (value: string) => {
        if (messageRef?.current) {
            messageRef.current.value = value;
            messageRef.current.dispatchEvent(new Event('change', {bubbles: true}));
        }
        setMessageText(value);
        formInputFields.message.value = value;
    }

    const handleEditMessageText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(event.target.value);
        formInputFields.message.value = event.target.value;
        if (messageRef?.current) {
            messageRef.current.dispatchEvent(new Event('change', {bubbles: true}));
        }
        setIsChanged(true);
    }

    const handleFormatButtonClick = (buttonName: string) => {
        if (selectionStart === selectionEnd) {
            return;
        }

        let formattedText = '';
        switch (buttonName) {
            case 'reon-bot-notificator-bold-text':
                formattedText = `<b>${messageText.slice(selectionStart, selectionEnd)}</b>`;
                break;
            case 'reon-bot-notificator-italic-text':
                formattedText = `<i>${messageText.slice(selectionStart, selectionEnd)}</i>`;
                break;
            case 'reon-bot-notificator-crossed-text':
                formattedText = `<s>${messageText.slice(selectionStart, selectionEnd)}</s>`;
                break;
            case 'reon-bot-notificator-underline-text':
                formattedText = `<u>${messageText.slice(selectionStart, selectionEnd)}</u>`;
                break;
            case 'reon-bot-notificator-hidden-text':
                formattedText = `<span class="tg-spoiler">${messageText.slice(selectionStart, selectionEnd)}</span>`;
                break;
            default:
                formattedText = messageText;
        }

        setMessageText((prevMessage) => {
                formInputFields.message.value = `${prevMessage.slice(0, selectionStart)}${formattedText}${prevMessage.slice(selectionEnd)}`;
                return `${prevMessage.slice(0, selectionStart)}${formattedText}${prevMessage.slice(selectionEnd)}`;
            }
        );
        setIsChanged(true);
    }

    const handleSelectionChange = () => {
        const messageArea = messageRef.current;

        if (messageArea) {
            setSelectionStart(messageArea.selectionStart);
            setSelectionEnd(messageArea.selectionEnd);
        }
    };

    useEffect(() => {
        if (isChanged && saveButton.classList.contains('button-input-disabled')) {
            saveButton.classList.remove('button-input-disabled');
            saveButton.classList.add('button-input_blue');
        }
    }, [isChanged]);

    return (
        <div className={cl['dp-settings']}>
            <div className={cl['dp-settings__input-block']}>
                <div className={cl['dp-settings__input-header']}>Получатели:</div>
                <SelectTelegramUsers
                    formInputFields={formInputFields}
                    placeholder={'Получатели...'}
                    messageRef={messageRef}
                    setIsChanged={setIsChanged}
                />
            </div>

            <div className={cl['dp-settings__input-block']}>
                <div className={cl['dp-settings__input-header']}>Текст сообщения:</div>
                <div className={cl['dp-settings__buttons-group']}>
                    <Button
                        onClick={() => handleFormatButtonClick('reon-bot-notificator-bold-text')}
                        sx={{fontWeight: 'bold'}}
                    >
                        Ж
                    </Button>
                    <Button
                        onClick={() => handleFormatButtonClick('reon-bot-notificator-italic-text')}
                        sx={{fontStyle: 'italic'}}
                    >
                        К
                    </Button>
                    <Button
                        onClick={() => handleFormatButtonClick('reon-bot-notificator-crossed-text')}
                        sx={{textDecoration: 'line-through'}}
                    >
                        З
                    </Button>
                    <Button
                        onClick={() => handleFormatButtonClick('reon-bot-notificator-underline-text')}
                        sx={{textDecoration: 'underline'}}
                    >
                        П
                    </Button>
                    <Button
                        onClick={() => handleFormatButtonClick('reon-bot-notificator-hidden-text')}
                    >
                        ▒
                    </Button>
                </div>
                <textarea
                    ref={messageRef}
                    name='textarea'
                    value={messageText}
                    onChange={handleEditMessageText}
                    placeholder='Текст сообщения'
                    className={cl['dp-settings__textarea']}
                    onSelect={handleSelectionChange}
                />

                <div className={cl['dp-settings__input-header']}>Добавить поле:</div>
                <AddInterpolationField
                    handleInputChange={handleInputChange}
                    messageText={messageText}
                    taskTextFields={taskTextFields}
                />
            </div>


            <div className={cl['dp-settings__input-block']}>
                <div className={cl['dp-settings__input-header']}>Заполнение полей из Telegram:</div>
                <SelectFillFields
                    formInputFields={formInputFields}
                    setIsChanged={setIsChanged}
                    placeholder={'Выбрать поля для заполнения'}
                    messageRef={messageRef}
                    taskTextFields={taskTextFields}
                />
            </div>

            <div className={cl['dp-settings__input-block']}>
                <div className={cl['dp-settings__input-header']}>Изменение этапа из Telegram:</div>
                <SelectSwapStage
                    formInputFields={formInputFields}
                    setIsChanged={setIsChanged}
                    placeholder={'Выбрать этапы для переноса'}
                    messageRef={messageRef}
                    currentStageId={currentStageId}
                />
            </div>

            <div className={cl['dp-settings__input-block']}>
                <div className={cl['dp-settings__input-header']}>Привязка примечания к сообщению в Telegram:</div>
                <RequiredDescription
                    formInputFields={formInputFields}
                    setIsChanged={setIsChanged}
                />
            </div>

        </div>
    )
})

export default DPSettings;
