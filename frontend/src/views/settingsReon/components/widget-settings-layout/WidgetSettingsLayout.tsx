import React from 'react';
import WidgetSettingsUser from '../widget-settings-user/WidgetSettingsUser';
import WidgetSettingsPayment from '../widget-settings-payment/WidgetSettingsPayment';
import { SettingsOptionsId } from '../../SettingsOptionsTypes';

type Props = {
    selectedOptionId: SettingsOptionsId,
}

const WidgetSettingsLayout = ({ selectedOptionId }: Props): JSX.Element => {

    // * Вынеси в отдельный компонент
    const SettingsContent = (id: SettingsOptionsId) => {
        switch (id) {
            case SettingsOptionsId.user:
                return <WidgetSettingsUser />
            case SettingsOptionsId.payment:
                return <WidgetSettingsPayment />
        }
    }

    return (
        SettingsContent(selectedOptionId)
    )
};

export default WidgetSettingsLayout;