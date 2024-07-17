package com.swtp.garagecom.Car;

import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.Service.ServiceEntity;
import com.swtp.garagecom.User.Client;
import com.swtp.garagecom.User.StorageOwner;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.Warehouse.Warehouse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/car")
public class CarController {

    private final Database database;

    @Autowired
    public CarController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping("/{id}")
    public ResponseEntity getCarById(@PathVariable Long id, @AuthenticationPrincipal String email) {
        Car car = database.getCarById(id);
        if (car != null) {
            return ResponseEntity.ok(car);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no car found");
        }
    }

    @GetMapping("/servicesForCar/{carId}")
    public ResponseEntity getServicesForCar(@PathVariable Long carId, @AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        switch (user) {
            case Client client -> {
                List<Warehouse> warehouses = database.getAllWarehouses();
                List<ServiceEntity> availableServices = new ArrayList<>();

                for (Warehouse warehouse : warehouses) {
                    List<ParkingSpace> parkingSpaces = warehouse
                            .getAllParkingSpaceID()
                            .stream()
                            .map(database::getParkingSpaceById)
                            .filter(Objects::nonNull)
                            .toList();

                    List<Car> carsInWh = parkingSpaces
                            .stream()
                            .map(ps -> database.getCarById(ps.getCarId()))
                            .filter(Objects::nonNull)
                            .toList();

                    if(!carsInWh.stream().filter(c -> Objects.equals(c.getId(), carId)).toList().isEmpty()){
                        List<ServiceEntity> servicesInWarehouse = warehouse
                                .getAllServiceId()
                                .stream()
                                .map(database::getServiceById)
                                .filter(Objects::nonNull)
                                .toList();
                        availableServices.addAll(servicesInWarehouse);
                    }
                }
                return ResponseEntity.ok(availableServices);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a client");
            }
        }
    }

    @PostMapping("/bookServiceForCar/{serviceId}/{carId}")
    public ResponseEntity bookServiceForCar(@PathVariable Long serviceId, @PathVariable Long carId) {
        ServiceEntity service = database.getServiceById(serviceId);
        if (service == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("service not found");
        Car car = database.getCarById(carId);
        if (car == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no car found");
        car.addService(service);
        Car newCar = database.saveCar(car);
        if(newCar == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save car");
        return ResponseEntity.ok(service);
    }

    @GetMapping("/myCars")
    public ResponseEntity getMyCars(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User  not found");
        switch (user) {
            case Client client -> {
                //Client cars
                //Get carIDs form user
                List<Long> carIDs = client.getCarIDs();
                //Map carID -> car
                List<CarDTO> cars = carIDs
                        .stream()
                        .map(database::getCarById)
                        .filter(Objects::nonNull)
                        .map(car -> {
                            List<ServiceEntity> carServ = car
                                    .getServices()
                                    .stream()
                                    .map(database::getServiceById)
                                    .filter(Objects::nonNull)
                                    .toList();
                            return new CarDTO(
                                    car.getModel(),
                                    car.getProductionYear(),
                                    car.getBrand(),
                                    car.getNumberPlate(),
                                    car.getChassisNumber(),
                                    car.getMaintenanceRecord(),
                                    car.getDriveability(),
                                    car.getServices(),
                                    car.getId(),
                                    carServ
                            );
                        })
                        .toList();
                //return cars
                return ResponseEntity.ok(cars);
            }
            case StorageOwner storageOwner -> {
                //Cars in warehouses of the storageOwner
                List<Long> warehouseIDs = storageOwner.getWarehouseIDs();
                List<Warehouse> warehouses = database.getWarehousesByIDs(warehouseIDs);
                List<CarDTO> cars = warehouses
                        .stream()
                        .map(Warehouse::getAllParkingSpaceID)
                        .map((parkingSpaceIDs -> parkingSpaceIDs
                                .stream()
                                .map(database::getParkingSpaceById)
                                .toList()
                        ))
                        .map((parkingSpaces -> parkingSpaces
                                .stream()
                                .filter(Objects::nonNull)
                                .map((parkingSpace -> database.getCarById(parkingSpace.getCarId())))
                                .toList()
                        ))
                        .flatMap(List::stream)
                        .filter(Objects::nonNull)
                        .map(car -> {
                            List<ServiceEntity> carServ = car
                                    .getServices()
                                    .stream()
                                    .map(database::getServiceById)
                                    .filter(Objects::nonNull)
                                    .toList();
                            return new CarDTO(
                                    car.getModel(),
                                    car.getProductionYear(),
                                    car.getBrand(),
                                    car.getNumberPlate(),
                                    car.getChassisNumber(),
                                    car.getMaintenanceRecord(),
                                    car.getDriveability(),
                                    car.getServices(),
                                    car.getId(),
                                    carServ
                            );
                        })
                        .toList();

                return ResponseEntity.ok(cars);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not a client");
            }
        }
    }

    @PostMapping("/create")
    public ResponseEntity createCar(@RequestBody Car car, @AuthenticationPrincipal String email) {
        //create car
        User user = database.getUserByEmail(email);
        if(user ==  null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        Car newCar = database.saveCar(car);
        if(newCar != null){
            switch (user) {
                case Client client -> {
                    client.addCar(newCar);
                    if(!database.saveUser(client)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save car");
                }
                default -> {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save car");
                }
            }
            return ResponseEntity.ok(car);
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not create car");
        }
    }


    @PostMapping("/createByStorageOwner/{parkingSpaceID}/{emailString}")
    public ResponseEntity createCar(@RequestBody Car car, @AuthenticationPrincipal String email, @PathVariable Long parkingSpaceID, @PathVariable String emailString) {
        //create car
        User user = database.getUserByEmail(emailString);
        if(!(user instanceof Client)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not a client-email");
        ParkingSpace parkingSpace = database.getParkingSpaceById(parkingSpaceID);
        Car newCar = database.saveCar(car);
        if(newCar != null){
            parkingSpace.setCarId(newCar.getId());
            database.saveParkingSpace(parkingSpace);

            Client c = (Client) user;
            c.addCar(newCar);
            if(!database.saveUser(c)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save car");

            return ResponseEntity.ok(car);
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not create car");
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateCar(@RequestBody Car updatedCar) {
        if(database.updateCar(updatedCar)){
            return ResponseEntity.ok(updatedCar);
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not update car");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteCar(@PathVariable Long id) {
        List<Warehouse> warehouses = database.getAllWarehouses();
        if (warehouses != null) {
            for (Warehouse warehouse : warehouses) {
                List<Long> parkingSpaceIDs = warehouse.getAllParkingSpaceID();
                if (parkingSpaceIDs != null) {
                    for (Long parkingSpaceID : parkingSpaceIDs) {
                        ParkingSpace parkingSpace = database.getParkingSpaceById(parkingSpaceID);
                        if (parkingSpace != null) {
                            if (parkingSpace.getCarId().equals(id)) {
                                parkingSpace.setCarId(null);
                                database.saveParkingSpace(parkingSpace);
                                break;
                            }
                        }
                    }
                }
            }
        }
        if(database.deleteCar(id)){
            return ResponseEntity.ok("car deleted successfully");
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not delete car");
        }
    }
}