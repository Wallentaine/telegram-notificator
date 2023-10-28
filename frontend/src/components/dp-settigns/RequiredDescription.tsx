import React, {useState} from 'react';
import CheckboxPrime from "../UI/checkbox/checkbox-prime/CheckboxPrime";

type RequiredDescriptionProp = {
    formInputFields: { [x: string]: HTMLInputElement };
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const RequiredDescription = ({formInputFields, setIsChanged}: RequiredDescriptionProp) => {
    const [isRequiredDescription, setIsRequiredDescription] = useState<boolean>(formInputFields.requiredDescription.value === 'true');

    const handleEditRequiredDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRequiredDescription(event.target.checked);
        formInputFields.requiredDescription.value = String(event.target.checked);
        setIsChanged(true);
    }

    return (
        <CheckboxPrime
            name='isRequiredDescription'
            title='Выводить примечание'
            isActive={isRequiredDescription}
            onChange={handleEditRequiredDescription}
        />
    );
};

export default RequiredDescription;
