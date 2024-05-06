export interface ServiceEntity {
    uuid: string;
    nameService: string;
    idLocationService: string; // idLocation
    descriptionService: string;
    typeService: string; // gate, stairs, elevator, info, toilet, parking, transport, security, medical, passports, luggage, room, other, ...
    scheduleService: string; // "Domingo|Lunes|Martes|Miércoles|Jueves|Viernes|Sábado" ...
    // ... "09:00_20:30|09:00_20:30|09:00_20:30|09:00_20:30|09:00_22:00|09:00_22:00|09:00_22:00"
    deletedService: boolean;
}