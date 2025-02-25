import Ride from "../../domain/Ride";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";
import Position from "../../domain/Position";

// Interface Adapter
export default interface RideRepository {
    saveRide (ride: Ride): Promise<void>;
    updateRide (ride: Ride): Promise<void>;
    getRideById (rideId: string): Promise<Ride>;
    hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
    updateRideStatus (ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async saveRide(ride: Ride): Promise<void> {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.getFare(), ride.getDistance(), ride.getStatus(), ride.date]);
    }

    async updateRide(ride: Ride): Promise<void> {
        await this.connection.query("update ccca.ride set driver_id = $1, status = $2, fare = $3, distance = $4 where ride_id = $5", [ride.getDriverId(), ride.getStatus(), ride.getFare(), ride.getDistance(), ride.getRideId()]);
    }

    async updateRideStatus(ride: Ride): Promise<void> {
        await this.connection.query("update ccca.ride set status = $1 where ride_id = $2", [ride.getStatus(), ride.getRideId()]);
    }
    
    async getRideById(rideId: string): Promise<Ride> {
        const [data] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        const ride = new Ride(data.ride_id, data.passenger_id, data.driver_id, parseFloat(data.from_lat), parseFloat(data.from_long), parseFloat(data.to_lat), parseFloat(data.to_long), parseFloat(data.fare), parseFloat(data.distance), data.status, data.date);
        return ride;
    }

    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
        const [data] = await this.connection.query("select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
        return !!data;
    }

}
