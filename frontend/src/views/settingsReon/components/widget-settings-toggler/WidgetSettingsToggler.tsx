import React from 'react';
import { OptionsType, OptionT } from '../../SettingsOptionsTypes';
import cl from './widgetSettingsToggler.module.scss';
import classNames from 'classnames';

type Props = {
    options: OptionsType,
    selected: OptionT,
    toggleOption: (option: OptionT) => void
}

const WidgetSettingsToggler = ({ options, selected, toggleOption }: Props): JSX.Element => {

    return (
        <div className={cl['toggler-nav']}>
            {options.map(option =>
                <div
                    onClick={() => toggleOption(option)}
                    className={classNames(cl['toggler-nav__item'], { [cl._active]: option.id === selected.id })}
                >
                    <span>{option.title}</span>
                </div>
            )}
        </div>
    )
};

export default WidgetSettingsToggler;