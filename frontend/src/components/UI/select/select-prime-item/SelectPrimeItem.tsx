import classNames from 'classnames';
import React, { createRef, useEffect, useState } from 'react';
import cl from './selectPrimeItem.module.scss';
import { OptionType } from '../../../../types/selectTypes';
import { useCloseDroppedWindowListener } from '../../../../hooks/useCloseDroppedWindowListener ';

type OptionsType<T> = Record<keyof T, OptionType>;

type EntriesType<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

type SelectPrimeItemProps<T> = {
    selected: T[keyof T],
    options: T,
    changeSelect: (key: keyof T) => void,
}

const SelectPrimeItem = <T extends OptionsType<T>,>({ options, selected, changeSelect }: SelectPrimeItemProps<T>): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = createRef<HTMLDivElement>();

    const handleChangeSelect = (key: keyof T): void => {
        setIsOpen(false);
        changeSelect(key);
    }
    useCloseDroppedWindowListener(rootRef, setIsOpen)
    return (
        <div className={cl.select} ref={rootRef}>
            <span
                className={classNames(cl['select__title'])}
                onClick={() => setIsOpen(prev => !prev)}
            >
                {selected.name}
            </span>
            <b className={cl.select__arrow}></b>
            <ul className={classNames(cl['select__list'], { [cl['_active']]: isOpen })}>
                {
                    (Object.entries(options) as EntriesType<typeof options>).map(([key, option]) =>
                        <li
                            key={option.id}
                            className={classNames(cl['select__option'], { [cl['_selected']]: option.id === selected.id })}
                            onClick={() => handleChangeSelect(key)}
                        >
                            {option.name}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default SelectPrimeItem;