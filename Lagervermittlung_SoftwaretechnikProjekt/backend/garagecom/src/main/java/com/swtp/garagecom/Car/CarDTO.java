package com.swtp.garagecom.Car;

import com.swtp.garagecom.Service.ServiceEntity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.List;

public class CarDTO {
    private String model;
    private String productionYear;
    private String brand;
    private String numberPlate; //Kennzeichen
    private String chassisNumber; //Fahrgestellnummer
    private String maintenanceRecord; //Wartungszustand
    private String driveability; //Fahrbereitschaft
    private List<Long> services;
    private List<ServiceEntity> serviceEntities;
    private Long id;

    public CarDTO(String model, String productionYear, String brand, String numberPlate, String chassisNumber, String maintenanceRecord, String driveability, List<Long> services, Long id, List<ServiceEntity> serviceEntities) {
        this.model = model;
        this.productionYear = productionYear;
        this.brand = brand;
        this.numberPlate = numberPlate;
        this.chassisNumber = chassisNumber;
        this.maintenanceRecord = maintenanceRecord;
        this.driveability = driveability;
        this.services = services;
        this.id = id;
        this.serviceEntities = serviceEntities;
    }

    public String getProductionYear() {
        return productionYear;
    }

    public void setProductionYear(String productionYear) {
        this.productionYear = productionYear;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getNumberPlate() {
        return numberPlate;
    }

    public void setNumberPlate(String numberPlate) {
        this.numberPlate = numberPlate;
    }

    public String getChassisNumber() {
        return chassisNumber;
    }

    public void setChassisNumber(String chassisNumber) {
        this.chassisNumber = chassisNumber;
    }

    public String getMaintenanceRecord() {
        return maintenanceRecord;
    }

    public void setMaintenanceRecord(String maintenanceRecord) {
        this.maintenanceRecord = maintenanceRecord;
    }

    public String getDriveability() {
        return driveability;
    }

    public void setDriveability(String driveability) {
        this.driveability = driveability;
    }

    public List<Long> getServices() {
        return services;
    }

    public void setServices(List<Long> services) {
        this.services = services;
    }

    public List<ServiceEntity> getServiceEntities() {
        return serviceEntities;
    }

    public void setServiceEntities(List<ServiceEntity> serviceEntities) {
        this.serviceEntities = serviceEntities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
