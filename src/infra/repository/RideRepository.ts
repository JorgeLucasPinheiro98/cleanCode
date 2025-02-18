import Ride from "../../domain/Ride";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";

// Interface Adapter
export default interface RideRepository {
    saveRide (ride: Ride): Promise<void>;
    getRideById (rideId: string): Promise<Ride>;
    hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
}

export class RideRepositoryDatabase implements RideRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async saveRide(ride: Ride): Promise<void> {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, from_lat, from_long, to_lat, to_long, fare, distance, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [ride.rideId, ride.passengerId, ride.driverId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.fare, ride.distance, ride.status, ride.date]);
    }
    
    async getRideById(rideId: string): Promise<Ride> {
        const [data] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        return new Ride(data.ride_id, data.passenger_id, data.driver_id, parseFloat(data.from_lat), parseFloat(data.from_long), parseFloat(data.to_lat), parseFloat(data.to_long), parseFloat(data.fare), parseFloat(data.distance), data.status, data.date);
    }

    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
        const [data] = await this.connection.query("select 1 from ccca.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
        return !!data;
    }

}
