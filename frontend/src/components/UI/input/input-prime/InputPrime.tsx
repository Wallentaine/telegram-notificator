import classNames from 'classnames';
import React from 'react';
import cl from './InputPrime.module.scss';

type InputPrimeProps = {
    value: string,
    onChange: (value: string) => void,
    type: 'text' | 'number' | 'time',
    placeholder?: string,
    name?: string,
    className?: string,
}

const InputPrime = ({ onChange, placeholder, value, type, name, className }: InputPrimeProps): JSX.Element => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value);
    }

    return (
        <input
            className={classNames(cl.input, className)}
            value={value}
            onChange={handleOnChange}
            placeholder={placeholder}
            type={type}
            name={name}
        />
    )
}

export default InputPrime