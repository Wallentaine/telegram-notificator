import React, { useState } from 'react';
import cl from './widgetSettingsPayment.module.scss'
import classNames from 'classnames';

const paymentPlan = [
    {
        id: 1,
        title: '1 месяц работы виджета в подарок при оплате',
        period: {
            name: '6 месяцев',
            value: 6
        },
        price: {
            name: '5 994 ₽',
            value: 5994
        }
    },
    {
        id: 2,
        title: '3 месяца работы виджета в подарок при оплате',
        period: {
            name: '10 месяцев',
            value: 10
        },
        price: {
            name: '9 990 ₽',
            value: 9990
        }
    }
];

const WidgetSettingsPayment = (): JSX.Element => {
    const [selectedPlan, setSelectedPlan] = useState(paymentPlan[0]);
    const handleChangePlan = (id: number): void => {
        const newPlan = paymentPlan.find(plan => plan.id === id);
        if (newPlan) {
            setSelectedPlan(newPlan)
        }
    }

    return (
        <div className={cl['reon-plan-sales-payment-display-container']}>
            <div className={cl.reon_widget_settings_body_item}>
                <div className={cl.reon_widget_settings_forwardToContact}>
                    <span>
                        Для получения счёта на оплату <a href="https://reon.pro/plan_prodazh" target="_blank">свяжитесь</a> с нами любым удобным для вас способом.
                    </span>
                </div>
                <div className={cl.reon_widget_settings_price}>
                    <div className={cl.reon_widget_settings_price_body}>
                        {
                            paymentPlan.map(plan =>
                                <div
                                    className={classNames(cl.reon_widget_settings_price_item, { [cl._active]: plan.id === selectedPlan.id })}
                                    key={plan.id}
                                    onClick={() => handleChangePlan(plan.id)}
                                >
                                    <div className={cl.reon_widget_settings_price_item_title}>
                                        {plan.title}
                                    </div>
                                    <div className={cl.reon_widget_settings_price_item_body}>
                                        <span className={cl.reon_widget_settings_price_period}>{plan.period.name}</span>
                                        <span className={cl.reon_widget_settings_price_value}>{plan.price.name}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <a
                        href="https://reon.pro/marketplace#oplata_vidgeta"
                        target="_blank"
                        className="button-input button-input_blue reon_widget_settings-price-btn"
                        id="reon-btn-payment"
                    >
                        <span className="button-input-inner "><span className="button-input-inner__text">Оплатить онлайн</span></span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default WidgetSettingsPayment;