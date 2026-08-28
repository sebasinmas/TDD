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
    const reservationData = this.validateReservationInput(input);

    if (!this.hasAvailability(reservationData.date, reservationData.time, reservationData.partySize)) {
      throw new Error('No hay disponibilidad para la fecha y hora solicitada');
    }

    const reservation: Reservation = {
      code: this.generateReservationCode(),
      ...reservationData,
      status: 'active',
    };

    this.reservations.set(reservation.code, reservation);
    return this.copyReservation(reservation);
  }

  hasAvailability(date: string, time: string, requestedPartySize = 1): boolean {
    if (!Number.isInteger(requestedPartySize) || requestedPartySize <= 0) {
      throw new Error('La cantidad de personas debe ser mayor que cero');
    }

    const reservedCapacity = this.getReservedCapacityForSlot(date, time);
    return reservedCapacity + requestedPartySize <= this.capacityPerSlot;
  }

  cancelReservation(code: string): Reservation {
    const reservation = this.reservations.get(code);

    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('La reserva ya fue cancelada');
    }

    const cancelledReservation: Reservation = { ...reservation, status: 'cancelled' };
    this.reservations.set(code, cancelledReservation);

    return this.copyReservation(cancelledReservation);
  }

  private validateReservationInput(input: CreateReservationInput): CreateReservationInput {
    const customerName = input.customerName.trim();
    const date = input.date.trim();
    const time = input.time.trim();

    if (!customerName) {
      throw new Error('El nombre del cliente es obligatorio');
    }

    if (!Number.isInteger(input.partySize) || input.partySize <= 0) {
      throw new Error('La cantidad de personas debe ser mayor que cero');
    }

    if (!date) {
      throw new Error('La fecha es obligatoria');
    }

    if (!time) {
      throw new Error('La hora es obligatoria');
    }

    return {
      customerName,
      partySize: input.partySize,
      date,
      time,
    };
  }

  private getReservedCapacityForSlot(date: string, time: string): number {
    return Array.from(this.reservations.values())
      .filter(
        (reservation) =>
          reservation.date === date && reservation.time === time && reservation.status === 'active',
      )
      .reduce((total, reservation) => total + reservation.partySize, 0);
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
