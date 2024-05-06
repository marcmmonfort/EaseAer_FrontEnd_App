export interface BookingEntity {
    uuid: string;
    idUserBooking: string;
    idOfferBooking?: string; // O esto ...
    idServiceBooking?: string; // ... o esto.
    typeBooking: "offer" | "service";
    scheduleBooking: string; // Ex: "2024-04-16T18:00:00.000+00:00|2024-04-16T19:00:00.000+00:00"
    statusBooking: "sent" | "accepted" | "rejected";
    commentsBooking: string;
    deletedBooking: boolean;
}