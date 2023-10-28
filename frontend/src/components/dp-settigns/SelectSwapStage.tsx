import React, {useState} from 'react';
import CheckboxPrime from "../UI/checkbox/checkbox-prime/CheckboxPrime";
import {MultiSelect} from "react-multi-select-component";
import cl from "../../views/dp-settings/dpSettings.module.scss";

type SelectSwapStageProp = {
    formInputFields: { [x: string]: HTMLInputElement };
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
    placeholder: string;
    messageRef: React.RefObject<HTMLTextAreaElement>;
    currentStageId: string;
}

type OptionType = {
    value: any;
    label: string;
    key?: string;
    disabled?: boolean;
}

const overrideStrings = {
    allItemsAreSelected: 'Все варианты выбраны',
    clearSearch: 'Очистить поиск',
    clearSelected: 'Очистить выбранное',
    noOptions: 'Нет вариантов',
    search: 'Поиск',
    selectAll: 'Выбрать всё',
    selectAllFiltered: 'Выбрать всё (с фильтром)',
    selectSomeItems: '',
    create: 'Создать',
}

const getSwapStages = (currentStageId: number): OptionType[] => {
    const stageList: {id: number; option: string; sort: number}[] = APP.data.current_view.statuses;
    const currentStageSort = stageList?.find(({id}) => id === currentStageId)?.sort
    const filteredStages = stageList.filter((stage) => currentStageSort && stage.sort > currentStageSort)

    return filteredStages.map(({id, sort, option}) => ({
        value: id,
        label: option
    }));
}

const getSelectedStages = (jsonValue: string, allStages: OptionType[]): OptionType[] => {
    const parsedValue = JSON.parse(jsonValue || '{}');

    return allStages.filter(({value}) => parsedValue.hasOwnProperty(value));
}

const SelectSwapStage = ({formInputFields, setIsChanged, placeholder, messageRef, currentStageId}: SelectSwapStageProp) => {
    const [isRequiredSwapStage, setIsRequiredSwapStage] = useState<boolean>(formInputFields.requiredSwapStage.value === 'true');
    const [isRequiredSwapStageOnce, setIsRequiredSwapStageOnce] = useState<boolean>(formInputFields.requiredSwapStageOnce.value === 'true');
    const [swapStages, setSwapStages] = useState<OptionType[]>(getSwapStages(Number(currentStageId)))
    const [selectedStages, setSelectedStages] = useState<OptionType[]>(getSelectedStages(formInputFields.requestSwapStage.value, swapStages))

    const handleEditRequiredSwapStage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRequiredSwapStage(event.target.checked);
        formInputFields.requiredSwapStage.value = String(event.target.checked);
        setIsChanged(true);
    }

    const handleEditRequiredSwapStageOnce = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRequiredSwapStageOnce(event.target.checked);
        formInputFields.requiredSwapStageOnce.value = String(event.target.checked);
        setIsChanged(true);
    }

    const handleSelectedSwagStages = (value: OptionType[]) => {
        setSelectedStages(value);

        const preparedSwapStages: {[key: string]: string} = {};

        value.forEach(({value, label}) => {
            preparedSwapStages[value] = label;
        });

        formInputFields.requestSwapStage.value = JSON.stringify(preparedSwapStages);

        if (messageRef?.current) {
            messageRef.current.dispatchEvent(new Event('change', {bubbles: true}));
        }

        setIsChanged(true);
    }

    return (
        <>
            <CheckboxPrime
                name='isRequiredSwapStage'
                title='Переносить по этапам воронки'
                isActive={isRequiredSwapStage}
                onChange={handleEditRequiredSwapStage}
            />

            {isRequiredSwapStage &&
                <>
                    <MultiSelect
                        options={swapStages}
                        value={selectedStages}
                        onChange={handleSelectedSwagStages}
                        labelledBy="Select stages"
                        overrideStrings={{...overrideStrings, selectSomeItems: placeholder}}
                    />
                    <div className={cl['dp-settings__check-once']}>
                        <CheckboxPrime
                            name='isRequiredSwapStageOnce'
                            title='Изменить этап единожды'
                            isActive={isRequiredSwapStageOnce}
                            onChange={handleEditRequiredSwapStageOnce}
                        />
                    </div>

                </>

            }
        </>
    );
};

export default SelectSwapStage;
