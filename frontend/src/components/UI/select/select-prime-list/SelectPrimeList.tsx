import classNames from 'classnames';
import React, { createRef, useEffect, useState } from 'react';
import { OptionType } from '../../../../types/selectTypes';
import { useCloseDroppedWindowListener } from '../../../../hooks/useCloseDroppedWindowListener ';
import cl from './selectPrimeList.module.scss';


type SelectPrimeListProps = {
    selected: OptionType,
    options: OptionType[],
    changeSelect: (id: string) => void,
}


const SelectPrimeList = ({ options, selected, changeSelect }: SelectPrimeListProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = createRef<HTMLDivElement>();

    const handleChangeSelect = (id: string): void => {
        setIsOpen(false);
        changeSelect(id);
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
                    options.map((option) =>
                        <li
                            key={option.id}
                            className={classNames(cl['select__option'], { [cl['_selected']]: option.id === selected.id })}
                            onClick={() => handleChangeSelect(option.id)}
                        >
                            {option.name}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default SelectPrimeList;