import Position from "./Position";
import DistanceCalculator from "./service/DistanceCalculator";
import FareCalculator from "./service/FareCalculator";
import Coord from "./vo/Coord";
import UUID from "./vo/UUID";

export default class Ride {
    private rideId: UUID;
    private passengerId: UUID;
    private driverId?: UUID;
    private from: Coord;
    private to: Coord;

    constructor (
        rideId: string,
        passengerId: string,
        driverId: string | null,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        private fare: number,
        private distance: number,
        private status: string,
        readonly date: Date
    ) {
        this.rideId = new UUID(rideId);
        this.passengerId = new UUID(passengerId);
        if (driverId) this.driverId = new UUID(driverId);
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
    }

    static create (
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number
    ) {
        const rideId = UUID.create().getValue();
        const status = "requested";
        const date = new Date();
        const fare = 0;
        const distance = 0;
        return new Ride(rideId, passengerId, null, fromLat, fromLong, toLat, toLong, fare, distance, status, date);
    }

    getFrom () {
        return this.from;
    }

    getTo () {
        return this.to;
    }

    getRideId () {
        return this.rideId.getValue();
    }

    getPassengerId () {
        return this.passengerId.getValue();
    }

    getDriverId () {
        return this.driverId?.getValue();
    }

    setDriverId (driverId: string) {
        this.driverId = new UUID(driverId);
    }

    setStatus (status: string) {
        this.status = status;
    }

    getStatus () {
        return this.status;
    }

    accept (driverId: string) {
        if (this.status !== "requested") throw new Error("Invalid status");
        this.status = "accepted";
        this.setDriverId(driverId);
    }

    start () {
        if (this.status !== "accepted") throw new Error("Invalid Status");
        this.status = "in_progress";
    }

    getFare () {
        return this.fare;
    }

    setFare (fare: number) {
        this.fare = fare;
    }

    getDistance () {
        return this.distance;
    }

    setDistance (distance: number) {
        this.distance = distance;
    }

}
