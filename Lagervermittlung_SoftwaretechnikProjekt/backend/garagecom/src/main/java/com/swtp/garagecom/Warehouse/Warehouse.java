package com.swtp.garagecom.Warehouse;

import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.Service.ServiceEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;
    private String name;
    private String storageConditions;
    private String brandSpecialization;

    @ElementCollection
    private List<String> openingHours;

    @ElementCollection
    private List<Long> parkingSpaceID;

    @ElementCollection
    private List<Long> serviceID;

    // Constructors, getters, and setters

    public Warehouse() {}

    public Warehouse(String address, String name, String storageConditions, String brandSpecialization, List<String> openingHours, List<Long> parkingSpaceID, List<Long> serviceID) {
        this.address = address;
        this.name = name;
        this.storageConditions = storageConditions;
        this.brandSpecialization = brandSpecialization;
        this.openingHours = openingHours;
        this.parkingSpaceID = parkingSpaceID;
        this.serviceID = serviceID;
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

    public List<Long> getAllServiceId() { return serviceID; }

    public void setServiceID(List<Long> serviceId) { this.serviceID = serviceId; }

    public void addServiceId(Long serviceID) { this.serviceID.add(serviceID); }

    public void removeServiceId(Long serviceId) { this.serviceID.remove(serviceId); }

    public List<Long> getAllParkingSpaceID() { return parkingSpaceID; }

    public void setParkingSpaceId(List<Long> parkingSpaceID) { this.parkingSpaceID = parkingSpaceID; }

    public void addParkingSpaceId(Long parkingSpaceID) { this.parkingSpaceID.add(parkingSpaceID); }

    public void removeParkingSpaceId(Long parkingSpaceID) { this.parkingSpaceID.remove(parkingSpaceID); }
}
