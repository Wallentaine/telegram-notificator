import classNames from 'classnames';
import React from 'react';
import cl from './checkboxPrime.module.scss';

type CheckboxPrimeProps = {
    name?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isActive: boolean
    className?: string,
    title: string,
}

const CheckboxPrime = ({ isActive, className, name, onChange, title }: CheckboxPrimeProps): JSX.Element => {

    return (
        <label className={classNames(cl.checkbox)}>
            <div
                className={classNames(className, cl['checkbox__btn'], { [cl._active]: isActive })}

            >
                <input
                    type="checkbox"
                    name={name}
                    onChange={onChange}
                    checked={isActive}
                />
            </div>
            <span>{title}</span>
        </label>
    )
}

export default CheckboxPrime
