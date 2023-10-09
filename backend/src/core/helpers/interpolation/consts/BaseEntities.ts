type BaseEntitiesLib = {
    [x: string]: string;
};

type PickedEntitiesLib = {
    [x: string]: string;
};

const BaseEntities: BaseEntitiesLib = {
    Lead: 'deal',
    Contact: 'contact',
    Company: 'company',
};

const PickedEntities: PickedEntitiesLib = {
    Contacts: 'contacts',
    Companies: 'companies',
};

export { BaseEntities, PickedEntities };
