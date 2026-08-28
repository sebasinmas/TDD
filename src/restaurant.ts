export type ReservationStatus = 'active' | 'cancelled';

export interface CreateReservationInput {
  customerName: string;
  partySize: number;
  date: string;
  time: string;
}

export interface Reservation {
  code: string;
  customerName: string;
  partySize: number;
  date: string;
  time: string;
  status: ReservationStatus;
}

export class Restaurant {
  private readonly reservations = new Map<string, Reservation>();
  private nextReservationNumber = 1;

  constructor(private readonly capacityPerSlot: number) {
    if (!Number.isInteger(capacityPerSlot) || capacityPerSlot <= 0) {
      throw new Error('La capacidad por horario debe ser mayor que cero');
    }
  }

  createReservation(input: CreateReservationInput): Reservation {
    const reservation: Reservation = {
      code: this.generateReservationCode(),
      customerName: input.customerName,
      partySize: input.partySize,
      date: input.date,
      time: input.time,
      status: 'active',
    };

    this.reservations.set(reservation.code, reservation);
    return this.copyReservation(reservation);
  }

  private generateReservationCode(): string {
    const code = `RES-${String(this.nextReservationNumber).padStart(4, '0')}`;
    this.nextReservationNumber += 1;
    return code;
  }

  private copyReservation(reservation: Reservation): Reservation {
    return { ...reservation };
  }
}
