package com.swtp.garagecom.ParkingSpace;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.DatabaseUtil.Database;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/parkingspaces")
public class ParkingSpaceController {

    private final Database database;

    @Autowired
    public ParkingSpaceController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping
    public List<ParkingSpace> getAllParkingSpaces() { return database.getAllParkingSpaces(); }

    @GetMapping("/{id}")
    public ResponseEntity getParkingSpaceById(@PathVariable Long id) {
        ParkingSpace parkingSpace = database.getParkingSpaceById(id);
        if (parkingSpace != null) {
            Long carId = parkingSpace.getCarId();
            if(carId != null) {
                Car car =  database.getCarById(carId);
                if(car != null) {
                    FullParkingSpaceDTO fullParkingSpaceDTO = new FullParkingSpaceDTO(
                            parkingSpace.getId(),
                            parkingSpace.getCategory(),
                            parkingSpace.getConditions(),
                            car
                    );
                    return ResponseEntity.ok(fullParkingSpaceDTO);
                } else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no car with carID found");
            } else {
                FullParkingSpaceDTO fullParkingSpaceDTO = new FullParkingSpaceDTO(
                        parkingSpace.getId(),
                        parkingSpace.getCategory(),
                        parkingSpace.getConditions(),
                        null
                );
                return ResponseEntity.ok(fullParkingSpaceDTO);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no parkingSpace found");
        }
    }

    @PostMapping("/moveCarInSpace/{carId}/{parkingSpaceId}")
    public ResponseEntity moveCarInSpace(@PathVariable Long carId, @PathVariable Long parkingSpaceId) {
        Car car = database.getCarById(carId);
        ParkingSpace parkingSpace = database.getParkingSpaceById(parkingSpaceId);
        parkingSpace.setCarId(car.getId());
        database.saveParkingSpace(parkingSpace);
        return ResponseEntity.ok(parkingSpace);
    }


    @PostMapping("/create")
    public ResponseEntity createParkingSpace(@RequestBody ParkingSpace parkingSpace) {
        ParkingSpace newParkingSpace = database.saveParkingSpace(parkingSpace);
        if(newParkingSpace != null) {
            return ResponseEntity.ok(newParkingSpace);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not create parking space");
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateParkingSpace(@RequestBody ParkingSpace updatedParkingSpace) {
        if(database.updateParkingSpace(updatedParkingSpace)) {
            return ResponseEntity.ok(updatedParkingSpace);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not update parking space");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteParkingSpace(@PathVariable Long id) {
        if(database.deleteParkingSpace(id)) {
            return ResponseEntity.ok(id);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not delete parking space");
        }
    }
}
