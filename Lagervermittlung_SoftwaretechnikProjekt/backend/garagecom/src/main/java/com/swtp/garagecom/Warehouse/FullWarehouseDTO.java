package com.swtp.garagecom.Warehouse;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.ParkingSpace.FullParkingSpaceDTO;
import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.Service.ServiceEntity;

import java.util.List;

public class FullWarehouseDTO {

    private Long id;
    private String address;
    private String name;
    private String storageConditions;
    private String brandSpecialization;

    private List<String> openingHours;
    private List<FullParkingSpaceDTO> parkingSpaces;
    private List<ServiceEntity> services;

    public FullWarehouseDTO(
            Long id,
            String address,
            String name,
            String storageConditions,
            String brandSpecialization,
            List<String> openingHours,
            List<FullParkingSpaceDTO> parkingSpaces,
            List<ServiceEntity> services
    ) {
        this.id = id;
        this.address = address;
        this.name = name;
        this.storageConditions = storageConditions;
        this.brandSpecialization = brandSpecialization;
        this.openingHours = openingHours;
        this.parkingSpaces = parkingSpaces;
        this.services = services;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStorageConditions() {
        return storageConditions;
    }

    public void setStorageConditions(String storageConditions) {
        this.storageConditions = storageConditions;
    }

    public String getBrandSpecialization() {
        return brandSpecialization;
    }

    public void setBrandSpecialization(String brandSpecialization) {
        this.brandSpecialization = brandSpecialization;
    }

    public List<String> getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(List<String> openingHours) {
        this.openingHours = openingHours;
    }

    public List<FullParkingSpaceDTO> getParkingSpaces() {
        return parkingSpaces;
    }

    public void setParkingSpaces(List<FullParkingSpaceDTO> parkingSpaces) {
        this.parkingSpaces = parkingSpaces;
    }

    public List<ServiceEntity> getServices() {
        return services;
    }

    public void setServices(List<ServiceEntity> services) {
        this.services = services;
    }
}




