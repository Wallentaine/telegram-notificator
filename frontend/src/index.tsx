import React from 'react';
import ReactDOM from 'react-dom/client';
import DPSettings from './views/dp-settings/DPSettings';
import './index.css';
import { TaskTextFields } from './types/selectTypes';
import { WidgetControllerDto } from './types/widgetControllerDto';
import WidgetMainSettings from './views/settingsReon/pages/widget-main-settings/WidgetMainSettings';
import WidgetSettingsFooter from './views/settingsReon/components/widget-settings-footer/WidgetSettingsFooter';
import AdvancedSettings from "./views/advanced-settings/AdvancedSettings";

const createReactRoot = (domElementId: string, rootComponent: JSX.Element): void => {
    const rootDOMElement: HTMLElement | null = document.getElementById(domElementId);
    if (rootDOMElement) {
        const modalRoot = ReactDOM.createRoot(rootDOMElement);
        modalRoot.render(
            <>
                {rootComponent}
            </>
        );
    }
}

const Wid = {
    render: async () => {
        return true;
    },
    init: async () => {
        return true;
    },
    bind_actions() {
        return true;
    },
    advancedSettings(widgetCode: string) {

        createReactRoot(`work-area-${widgetCode}`,
            <AdvancedSettings />
        )

        return true;
    },
    dpSettings(
        formInputFields: {[x: string]: HTMLInputElement},
        saveButton: HTMLButtonElement,
        taskTextFields: TaskTextFields[],
        currentStageId: string
    ) {
        createReactRoot('reon-task-widget',
            <DPSettings
                formInputFields={formInputFields}
                saveButton={saveButton}
                taskTextFields={taskTextFields}
                currentStageId={currentStageId}
            />
        )

        return true;
    },
    settings(rootBlocktest: HTMLDivElement) {
        const amoInputs: NodeListOf<HTMLDivElement> = rootBlocktest.querySelectorAll('.widget_settings_block__item_field');
        amoInputs.forEach(input => {
            const block = input;
            block.style.display = 'none'
        });

        rootBlocktest.insertAdjacentHTML('afterbegin',
            `<div id="reon-widget-settings" style="margin-bottom: -57px">
                <div id="reon-widget-settings__content" class="reon-widget-settings__content">
                </div>
                <div class="reon-widget-settings__save">
                </div>
                <div id="reon-widget-settings__footer" class="reon-widget-settings__footer">
                </div>
            </div>`);

        createReactRoot('reon-widget-settings__content', <WidgetMainSettings />)
        createReactRoot('reon-widget-settings__footer', <WidgetSettingsFooter />)

        const rootSaveWidgetSettings = rootBlocktest.querySelector('.reon-widget-settings__save');
        const saveBlock = rootBlocktest.querySelector('.widget_settings_block__controls.widget_settings_block__controls_top');
        if (saveBlock && rootSaveWidgetSettings) {
            rootSaveWidgetSettings?.insertBefore(saveBlock, null);
        }
        return true;
    },
    onSave: async (newLead: WidgetControllerDto) => {
        return true;
    },
    destroy: async () => {
        // await AMOService.deleteHook();
        return true;
    },
};

export default Wid;
