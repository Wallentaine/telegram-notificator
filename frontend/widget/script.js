define(['./index.js', './constants/basedValues.js'], function (App, basedValues) {

    const Widget = function () {
        const self = this;
        system = this.system();
        langs = this.langs;

        this.callbacks = {
            render: function () {
                App.default.render()
                return true;
            },
            init: function () {
                return true;
            },
            dpSettings() {
                const taskTextFields = [...basedValues.taskTextFields];

                const accountTaskTextFields = [
                    ...Object.values(AMOCRM.constant("account").predefined_cf),
                    ...Object.values(AMOCRM.constant("account").cf)
                ].filter(value =>
                    value.TYPE_ID !== 21 &&
                    (value.ENTREE_CONTACTS ||
                        value.ENTREE_DEALS ||
                        value.ENTREE_COMPANY)
                );

                for (const field of accountTaskTextFields) {
                    if (field.ENTREE_CONTACTS) {
                        taskTextFields.push({
                            id: field.ID,
                            name: field.NAME,
                            type: 'contacts',
                        });
                    }
                    if (field.ENTREE_DEALS) {
                        taskTextFields.push({
                            id: field.ID,
                            name: field.NAME,
                            type: 'leads',
                        });
                    }
                    if (field.ENTREE_COMPANY) {
                        taskTextFields.push({
                            id: field.ID,
                            name: field.NAME,
                            type: 'companies',
                        });
                    }
                }

                const responsibleFields = [
                    {
                        id: 'responsible',
                        name: 'Ответственный',
                        type: 'leads'
                    },
                    {
                        id: 'responsible',
                        name: 'Ответственный',
                        type: 'contacts'
                    },
                    {
                        id: 'responsible',
                        name: 'Ответственный',
                        type: 'companies'
                    },
                ];

                taskTextFields.push(...responsibleFields);

                const settingsBlock = document.getElementById('widget_settings__fields_wrapper');
                const saveButtonWrapper = document.querySelector('.digital-pipeline__edit-footer.trigger_settings__process__footer');
                const saveButton = saveButtonWrapper.querySelector('.js-trigger-save');
                const inputContainer = settingsBlock.querySelectorAll('.widget_settings_block__item_field.form-group');
                inputContainer.forEach((element) => {
                    element.setAttribute('style', 'display: none;');
                })
                settingsBlock.insertAdjacentHTML('afterbegin', '<div id="reon-task-widget" class="reon-task-widget-container"><div/>');

                const formInputFields = {
                    subscribers: document.querySelector('input[name="subscribers"]'),
                    message: document.querySelector('input[name="message"]'),
                    requiredSwapStage: document.querySelector('input[name="requiredSwapStage"]'),
                    requestSwapStage: document.querySelector('input[name="requestSwapStage"]'),
                    requiredSwapStageOnce: document.querySelector('input[name="requiredSwapStageOnce"]'),
                    requiredFillFields: document.querySelector('input[name="requiredFillFields"]'),
                    requestFillFields: document.querySelector('input[name="requestFillFields"]'),
                    requiredFillFieldsOnce: document.querySelector('input[name="requiredFillFieldsOnce"]'),
                    requiredDescription: document.querySelector('input[name="requiredDescription"]'),
                }

                App.default.dpSettings(formInputFields, saveButton, taskTextFields, settingsBlock.closest('.digital-pipeline__item').dataset.stageId);
                return true;
            },
            bind_actions: function () {
                return true;
            },
            settings: async function () {
                const rootBlock = document.getElementById('widget_settings__fields_wrapper');
                await App.default.settings(rootBlock);
                return true;
            },
            advancedSettings: async function() {
                await App.default.advancedSettings(self.get_settings().widget_code);

                return true;
            },
            onSave: async function () {
                const settings = self.get_settings();
                const userNameInputSetting = document.querySelector('[name=client_name]');
                const phoneNumberInput = document.querySelector('[name=phone_number]');
                const termsOfUseField = document.querySelector('[name="terms_of_use"]');
                const newLead = {
                    userName: userNameInputSetting.value,
                    userPhone: phoneNumberInput.value,
                    account: AMOCRM.constant("account").id,
                    widgetName: 'Виджет "Задачи 2.0" от REON',
                    termsOfUse: termsOfUseField.value,
                    accountSubdomain: AMOCRM.constant("account").subdomain,
                    widgetStatus: settings.active,
                    client_uuid: settings.oauth_client_uuid,
                    enumId: 1070003,
                };
                await App.default.onSave(newLead);
                return true;
            },
            destroy: async function () {
                await App.default.destroy();
                return true;
            },
        };
        return this;
    };
    return Widget;
});
