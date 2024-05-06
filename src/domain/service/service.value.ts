import { ServiceEntity } from "./service.entity";

export class ServiceValue implements ServiceEntity {
    uuid: string;
    nameService: string;
    idLocationService: string;
    descriptionService: string;
    typeService: string;
    scheduleService: string
    deletedService: boolean;
    constructor({
        uuid,
        nameService,
        idLocationService,
        descriptionService,
        typeService,
        scheduleService,
        deletedService
    }: {
        uuid: string;
        nameService: string;
        idLocationService: string;
        descriptionService: string;
        typeService: string;
        scheduleService: string
        deletedService: boolean;
    }) {
        this.uuid = uuid,
        this.nameService = nameService,
        this.idLocationService = idLocationService,
        this.descriptionService = descriptionService,
        this.typeService = typeService,
        this.scheduleService = scheduleService,
        this.deletedService = deletedService
    }
}