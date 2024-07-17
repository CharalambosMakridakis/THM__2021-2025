package com.swtp.garagecom.Warehouse;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.ParkingSpace.FullParkingSpaceDTO;
import com.swtp.garagecom.Service.ServiceEntity;
import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.User.StorageOwner;
import com.swtp.garagecom.User.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final Database database;

    @Autowired
    public WarehouseController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return database.getAllWarehouses();
    }

    @GetMapping("/details/{id}")
    public ResponseEntity getWarehouseDetails(@PathVariable Long id) {
        Warehouse warehouse = database.getWarehouseById(id);
        if(warehouse==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("warehouse not found");

        List<ParkingSpace> parkingSpaces = warehouse.getAllParkingSpaceID().
                stream()
                .map(database::getParkingSpaceById)
                .toList();

        DetailInformationDTO dDTO = new DetailInformationDTO(
                parkingSpaces,
                warehouse.getOpeningHours(),
                warehouse.getBrandSpecialization()
        );

        return ResponseEntity.ok(dDTO);
    }

    @GetMapping("/myWarehouses")
    public ResponseEntity getMyWarehouses(@AuthenticationPrincipal String email) {
        User user  = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no such user");
        switch (user){
            case StorageOwner so -> {
                List<Long> warehouseIDs = so.getWarehouseIDs();
                List<Warehouse> warehouses = database.getWarehousesByIDs(warehouseIDs);
                if(warehouses == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("warehouse not found");
                return ResponseEntity.ok(warehouses);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage owner");
            }
        }
    }

    @GetMapping("/myFullWarehousesInformation")
    public ResponseEntity getMyWarehousesInformation(@AuthenticationPrincipal String email) {
        User user  = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no such user");
        switch (user){
            case StorageOwner so -> {
                List<Long> warehouseIDs = so.getWarehouseIDs();
                List<Warehouse> warehouses = database.getWarehousesByIDs(warehouseIDs);
                List<FullWarehouseDTO> warehouseInfos = warehouses
                        .stream()
                        .map(warehouse -> {
                            List<ServiceEntity> whServices = database.getAllServicesFromWarehouse(warehouse.getId());
                            List<FullParkingSpaceDTO> whParkingSpaces = database.getAllParkingSpaces(warehouse.getId())
                                    .stream()
                                    .filter(Objects::nonNull)
                                    .map(parkingSpace -> new FullParkingSpaceDTO(
                                            parkingSpace.getId(),
                                            parkingSpace.getCategory(),
                                            parkingSpace.getConditions(),
                                            database.getCarById(parkingSpace.getCarId()))
                                    )
                                    .toList();

                            return new FullWarehouseDTO(
                                    warehouse.getId(),
                                    warehouse.getAddress(),
                                    warehouse.getName(),
                                    warehouse.getStorageConditions(),
                                    warehouse.getBrandSpecialization(),
                                    warehouse.getOpeningHours(),
                                    whParkingSpaces,
                                    whServices
                            );
                        }).toList();
                return ResponseEntity.ok(warehouseInfos);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage owner");
            }
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity getWarehouseById(@PathVariable Long id) {
        Warehouse warehouse = database.getWarehouseById(id);
        if (warehouse != null) {
            return ResponseEntity.ok(warehouse);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no warehouse found");
        }
    }

    @PostMapping("/create")
    public ResponseEntity createWarehouse(@RequestBody Warehouse warehouse, @AuthenticationPrincipal String email) {
        //TODO: Add createDTO with storageInformation and serviceInformation that associates storages and services (Contract C03)
        Warehouse newWarehouse = database.saveWarehouse(warehouse);
        if(newWarehouse != null) {
            User user = database.getUserByEmail(email);
            if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no such user");
            switch (user){
                case StorageOwner so -> {
                    so.addWarehouseID(newWarehouse.getId());
                    if(database.saveUser(so)) return ResponseEntity.ok(newWarehouse);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("unable to create warehouse");
                }
                default -> {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage owner");
                }
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not create warehouse");
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateWarehouse(@RequestBody Warehouse warehouse) {
        if(warehouse == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("warehouse is null");
        Warehouse oldWarehouse = database.getWarehouseById(warehouse.getId());
        List<Long> oldPSs = oldWarehouse.getAllParkingSpaceID();
        List<Long> oldSvs = oldWarehouse.getAllServiceId();
        warehouse.setParkingSpaceId(oldPSs);
        warehouse.setServiceID(oldSvs);
        if (database.updateWarehouse(warehouse)) {
            return ResponseEntity.ok(warehouse);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not update warehouse");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteWarehouse(@PathVariable Long id) {
        if(database.deleteWarehouse(id)) {
            return ResponseEntity.ok(id);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not delete warehouse");
        }
    }

    @GetMapping("/{warehouseId}/services")
    public ResponseEntity getServicesFromWarehouse(@PathVariable Long warehouseId) {
            List<ServiceEntity> serviceEntities = database.getAllServicesFromWarehouse(warehouseId);
            if(serviceEntities != null) {
                return ResponseEntity.ok(serviceEntities);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no services in warehouse found");
            }
    }

    @PostMapping("/{warehouseId}/services/add/{serviceId}")
    public ResponseEntity addServicesFromWarehouse(@PathVariable Long warehouseId, @PathVariable Long serviceId) {
        if(database.addServiceToWarehouse(serviceId, warehouseId)) {
            return ResponseEntity.ok(serviceId);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not add service to warehouse");
        }
    }

    @DeleteMapping("/{warehouseId}/services/{serviceId}")
    public ResponseEntity deleteServicesFromWarehouse(@PathVariable Long warehouseId, @PathVariable Long serviceId) {
        if(database.deleteServiceFromWarehouse(serviceId, warehouseId)) {
            return ResponseEntity.ok(serviceId);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not delete service from warehouse");
        }
    }


    @GetMapping("/{warehouseId}/parkingspaces")
    public ResponseEntity getParkingSpacesFromWarehouse(@PathVariable Long warehouseId) {
        List<ParkingSpace> parkingSpaces = database.getAllParkingSpaces(warehouseId);
        if(parkingSpaces != null) {
            return ResponseEntity.ok(parkingSpaces);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no parking spaces in warehouse found");
        }
    }

    @PostMapping("/{warehouseId}/parkingspaces/add/{parkingspaceId}")
    public ResponseEntity addParkingSpaceFromWarehouse(@PathVariable Long warehouseId, @PathVariable Long parkingspaceId) {
        if(database.addParkingSpaceToWarehouse(parkingspaceId, warehouseId)) {
            return ResponseEntity.ok(parkingspaceId);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not add parkingspace to warehouse");
        }
    }

    @DeleteMapping("/{warehouseId}/parkingspaces/{parkingspaceId}")
    public ResponseEntity deleteParkingSpaceFromWarehouse(@PathVariable Long warehouseId, @PathVariable Long parkingspaceId) {
        if(database.deleteParkingSpaceFromWarehouse(parkingspaceId, warehouseId)) {
            return ResponseEntity.ok(parkingspaceId);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not delete service from warehouse");
        }
    }

    @GetMapping("/search/{address}/{brandSpecialization}")
    public ResponseEntity searchWarehouse(@PathVariable String address, @PathVariable String brandSpecialization) {
        List<Warehouse> warehouses = database.searchWarehouses(address, brandSpecialization);
        List<FullWarehouseDTO> warehouseInfos = warehouses
                .stream()
                .map(warehouse -> {
                    List<ServiceEntity> whServices = database.getAllServicesFromWarehouse(warehouse.getId());
                    List<FullParkingSpaceDTO> whParkingSpaces = database.getAllParkingSpaces(warehouse.getId())
                            .stream()
                            .map(parkingSpace -> new FullParkingSpaceDTO(
                                        parkingSpace.getId(),
                                        parkingSpace.getCategory(),
                                        parkingSpace.getConditions(),
                                        database.getCarById(parkingSpace.getCarId()))
                            )
                            .toList();

                    return new FullWarehouseDTO(
                            warehouse.getId(),
                            warehouse.getAddress(),
                            warehouse.getName(),
                            warehouse.getStorageConditions(),
                            warehouse.getBrandSpecialization(),
                            warehouse.getOpeningHours(),
                            whParkingSpaces,
                            whServices
                    );
                }).toList();
        if(warehouses != null) {
            return ResponseEntity.ok(warehouseInfos);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no warehouse found");
        }
    }

}
