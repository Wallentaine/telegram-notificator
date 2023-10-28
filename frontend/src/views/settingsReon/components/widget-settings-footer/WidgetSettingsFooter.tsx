import React from 'react';
import cl from './WidgetSettingsFooter.module.scss';

const WidgetSettingsFooter = () => {

    return (
        <div className={cl.footer}>
            <div className={cl.footer__text}>
                Напишите нам и мы найдем решение вашей задачи.
            </div>
            <div className={cl.footer__contacts}>
                <div className={cl.contacts__item}>
                    <a href="https://reon.pro/interface_amocrm" target="_blank">
                        <img src="https://thumb.tildacdn.com/tild3866-3438-4139-b137-323134633338/-/resize/175x/-/format/webp/Component_4.png" alt="reon.pro" />
                    </a>
                </div>
                <div className={cl.contacts__item}>
                    <a className={cl['contacts__item-link']} href="mailto:reon.helpdesk@gmail.com" target="_blank">reon.helpdesk@gmail.com</a>
                </div>
                <div className={cl.contacts__item}>
                    <a className={cl['contacts__item-link']} href="tel:+79381083338" target="_blank">+7(938)-108-33-38</a>
                </div>
            </div>
        </div>
    )
};

export default WidgetSettingsFooter;