import React, {useState} from 'react';
import cl from './connectTelegram.module.scss';
import {Button, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function generateLink(): string {
    return `https://t.me/reon_amocrm_bot?start=${AMOCRM.constant('account').id}`;
}

function generateShareLink(): string {
    return `https://telegram.me/share/url?url=https://t.me/reon_amocrm_bot/?start=${AMOCRM.constant('account').id}`;
}

function ConnectTelegram() {
    const [telegramLink, setTelegramLink] = useState<string>('');
    const [telegramShareLink, setTelegramShareLink] = useState<string>('');
    const [isButtonsDisabled, setIsButtonsDisabled] = useState<boolean>(true)

    function handleGenerateLink() {
        setTelegramLink(generateLink());
        setTelegramShareLink(generateShareLink());
        setIsButtonsDisabled(false);
    }

    return (
        <div className={cl['connect-telegram-wrapper']}>
            <TextField id="standart-basic" label="Ссылка на Telegram-бота" variant="standard" value={telegramLink} placeholder={'Здесь появится ссылка для подключения к Telegram'}/>
            <div className={cl['connect-telegram-wrapper__btns']}>
                <Button
                    variant="outlined"
                    endIcon={<AddBoxIcon />}
                    sx={{marginRight: 2}}
                    onClick={handleGenerateLink}
                >
                    Сгенерировать ссылку
                </Button>
                <Button
                    variant="outlined"
                    endIcon={<ContentCopyIcon />}
                    sx={{marginRight: 2}}
                    disabled={isButtonsDisabled}
                    onClick={() => {navigator.clipboard.writeText(telegramLink)}}
                >
                    Скопировать ссылку
                </Button>
                {isButtonsDisabled ? (
                    <Button
                        variant="outlined"
                        endIcon={<SendIcon />}
                        sx={{marginRight: 2}}
                        disabled={isButtonsDisabled}
                    >
                        Поделиться
                    </Button>
                ) : (
                    <a href={telegramShareLink} target={"_blank"}>
                        <Button
                            variant="outlined"
                            endIcon={<SendIcon />}
                            sx={{marginRight: 2}}
                            disabled={isButtonsDisabled}
                        >
                            Поделиться
                        </Button>
                    </a>
                )}
            </div>
        </div>
    );
}

export default ConnectTelegram;
