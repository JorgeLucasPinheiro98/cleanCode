import Ride from "../../domain/Ride";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";
import Position from "../../domain/Position";

// Interface Adapter
export default interface PositionRepository {
    savePosition (position: Position): Promise<void>;
    getPositionsByRideId (rideId: string): Promise<Position[]>;
}

export class PositionRepositoryDatabase implements PositionRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async savePosition(position: Position): Promise<void> {
        await this.connection.query("insert into ccca.position (position_id, ride_id, lat, long) values ($1, $2, $3, $4)", [position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong()]);
    }
    
    async getPositionsByRideId(rideId: string): Promise<Position[]> {
        const positionsData = await this.connection.query("select * from ccca.position where ride_id = $1", [rideId]);
        const positions = [];
        for (const positionData of positionsData) {
            positions.push(new Position(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long)));
        }
        return positions;
    }

}
