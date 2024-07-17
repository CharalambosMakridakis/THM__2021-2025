package com.swtp.garagecom.Car;

import com.swtp.garagecom.Service.ServiceEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Car {

    private String model;
    private String productionYear;
    private String brand;
    private String numberPlate; //Kennzeichen
    private String chassisNumber; //Fahrgestellnummer
    private String maintenanceRecord; //Wartungszustand
    private String driveability; //Fahrbereitschaft

    @ElementCollection
    private List<Long> services;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Car() {}

    public Car(
            String model,
            String productionYear,
            String brand,
            String numberPlate,
            String chassisNumber
    ) {
        this.model = model;
        this.productionYear = productionYear;
        this.brand = brand;
        this.numberPlate = numberPlate;
        this.chassisNumber = chassisNumber;
        this.maintenanceRecord = "";
        this.driveability = "";
    }

    public List<Long> getServices() {
        return services;
    }

    public void addService(ServiceEntity service) {
        this.services.add(service.getId());
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDriveability() {
        return driveability;
    }

    public void setDriveability(String driveability) {
        this.driveability = driveability;
    }

    public String getMaintenanceRecord() {
        return maintenanceRecord;
    }

    public void setMaintenanceRecord(String maintenanceRecord) {
        this.maintenanceRecord = maintenanceRecord;
    }

    public String getChassisNumber() {
        return chassisNumber;
    }

    public void setChassisNumber(String chassisNumber) {
        this.chassisNumber = chassisNumber;
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

    public String getProductionYear() {
        return productionYear;
    }

    public void setProductionYear(String productionYear) {
        this.productionYear = productionYear;
    }
}
