import React, { useState } from 'react';
import WidgetSettingsLayout from '../../components/widget-settings-layout/WidgetSettingsLayout';
import WidgetSettingsToggler from '../../components/widget-settings-toggler/WidgetSettingsToggler';
import { OptionT, options } from '../../SettingsOptionsTypes';
import classes from './widgetMainSettings.module.scss';
import classNames from 'classnames';

const SettingsModalWindow = (): JSX.Element => {
    const [selectedOption, setSelectedOption] = useState<OptionT>(options[0]);

    const handleToggleOption = (option: OptionT): void => {
        setSelectedOption(option)
    }

    return (
        <div className={classNames(classes.container)}>
            <WidgetSettingsToggler
                options={options}
                selected={selectedOption}
                toggleOption={handleToggleOption}
            />
            <WidgetSettingsLayout selectedOptionId={selectedOption.id} />
        </div>
    )
};

export default SettingsModalWindow;
