import React, { useState } from 'react';
import cl from './widgetSettingsUser.module.scss'

const WidgetSettingsUser = (): JSX.Element => {
    const systemNameInput = document.querySelector<HTMLInputElement>('input[name=client_name]');
    const systemPhoneInput = document.querySelector<HTMLInputElement>('input[name=phone_number]');
    const systemTermsOfUseInput = document.querySelector<HTMLInputElement>('input[name=terms_of_use]');
    const [name, setName] = useState<string>(systemNameInput?.value || '')
    const [phone, setPhone] = useState<string>(systemPhoneInput?.value || '');
    const [termsOfUse, setTermsOfUse] = useState<boolean>(systemTermsOfUseInput?.value ? systemTermsOfUseInput?.value === 'true' : false);

    const changeInputValue = (newValue: string, stateCallback: React.Dispatch<React.SetStateAction<string>>, systemDomElement: HTMLInputElement | null): void => {
        if (systemDomElement) {
            systemDomElement.value = newValue;
            stateCallback(newValue);
        }
    }

    const changeTermOfUse = (newValue: boolean, stateCallback: React.Dispatch<React.SetStateAction<boolean>>, systemDomElement: HTMLInputElement | null): void => {
        if (systemDomElement) {
            stateCallback(newValue);
            systemDomElement.value = newValue.toString();
        }
    }

    return (
        <div className={cl.content}>
            <div className={cl.content__row}>
                <div className="widget_settings_block__title_field reon_widget_settings-label">
                    Ваше имя:
                </div>
                <div className="widget_settings_block__input_field">
                    <input
                        className="widget_settings_block__controls__ text-input"
                        type="text"
                        value={name}
                        placeholder=""
                        autoComplete="off"
                        onChange={(event) => changeInputValue(event.target.value, setName, systemNameInput)}
                    />
                </div>
            </div>
            <div className={cl.content__row}>
                <div className="widget_settings_block__title_field reon_widget_settings-label">
                    Номер телефона:
                </div>
                <div className="widget_settings_block__input_field">
                    <input
                        className="widget_settings_block__controls__ text-input"
                        type="text"
                        value={phone}
                        placeholder=""
                        autoComplete="off"
                        onChange={(event) => changeInputValue(event.target.value, setPhone, systemPhoneInput)}
                    />
                </div>
            </div>
            <div className={cl.content__row}>
                <label
                    className="control-checkbox reon-advanced-interface-widget-checkbox is-checked"
                >
                    <div className="control-checkbox__body">
                        <input
                            type="checkbox"
                            className="reon-advanced-interface-widget-checkbox-terms_of_use"
                            checked={termsOfUse}
                            autoComplete="off"
                            onChange={() => changeTermOfUse(!termsOfUse, setTermsOfUse, systemTermsOfUseInput)}
                        />
                        <span className="control-checkbox__helper"></span>
                    </div>
                    <div className="control-checkbox__text element__text " title="Я прочитал(-а) " style={{ display: `block`, fontSize: `14px` }}>
                        Я прочитал(-а) <a href="https://drive.google.com/file/d/13HBl0vCbeyxANlA3VszC57_xZP-IJbpw/view">Условия</a> соглашения и согласен(-на) с условиями
                    </div>
                </label>
            </div>
        </div>
    )
}

export default WidgetSettingsUser
