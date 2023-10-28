define([], function () {
    const basedValues = {
        taskTypes: [
            {
                color: '158f11',
                icon_id: '6',
                id: 1,
                option: 'Связаться'
            },
            {
                color: '896832',
                icon_id: 70,
                id: 2,
                option: 'Встреча'
            }
        ],

        taskTextFields: [
            {
                id: 'id',
                name: "ID контакта",
                type: 'contacts'
            },
            {
                id: 'name',
                name: "Имя контакта",
                type: 'contacts'
            },
            {
                id: 'id',
                name: "ID сделки",
                type: 'leads'
            },
            {
                id: 'name',
                name: "Название сделки",
                type: 'leads'
            },
            {
                id: 'price',
                name: "Бюджет сделки",
                type: 'leads'
            },
            {
                id: 'id',
                name: "ID компании",
                type: 'companies'
            },
            {
                id: 'name',
                name: "Название компании",
                type: 'companies'
            }
        ],

        formInputValue: {
            isNew: true,
            createTaskTo: 'leads',
            taskDeadline: 'byDate',
            deadlineDate: 'inEventDay',
            deadlineCorrectDay: '',
            deadlineCorrectHour: '',
            deadlineCorrectMinute: '',
            isWithoutDoubles: true,
            isCreateOverdue: false,
            isExactDuration: false,
            taskDurationHour: '',
            taskDurationMinute: '',
            isExactTime: false,
            exactTime: '14:00',
            isWithCurrentYear: false,
            responsibleManager: 'currentResponsible',
            taskText: '',
            taskType: 1,
            timezone: APP.constant('account').timezone,
            triggerId: '',
        }
    };

    return basedValues;
});
