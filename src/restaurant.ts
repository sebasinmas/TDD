export class Restaurant {
    reservations: Reserva[] = [];

}


class Reserva {
    constructor(
        public id: string,
        public customers: Customer[],
        public date: string
    ) { }
}

class Customer {
    constructor(public id: string, public name: string) { }
}