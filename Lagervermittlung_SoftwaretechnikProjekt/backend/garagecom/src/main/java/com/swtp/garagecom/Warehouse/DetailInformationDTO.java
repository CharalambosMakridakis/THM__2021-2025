package com.swtp.garagecom.Warehouse;

import com.swtp.garagecom.ParkingSpace.ParkingSpace;

import java.util.List;

public class DetailInformationDTO {
    private List<String> openingHours;
    private String brandSpecialization;
    private List<ParkingSpace> parkingSpaces;

    public DetailInformationDTO(List<ParkingSpace> parkingSpaces, List<String> openingHours, String brandSpecialization) {
        this.parkingSpaces = parkingSpaces;
        this.openingHours = openingHours;
        this.brandSpecialization = brandSpecialization;
    }

    public List<ParkingSpace> getParkingSpaces() {
        return parkingSpaces;
    }

    public void setParkingSpaces(List<ParkingSpace> parkingSpaces) {
        this.parkingSpaces = parkingSpaces;
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
}
