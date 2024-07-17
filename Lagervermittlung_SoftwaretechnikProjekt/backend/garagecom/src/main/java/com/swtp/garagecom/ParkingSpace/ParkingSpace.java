package com.swtp.garagecom.ParkingSpace;

import com.swtp.garagecom.Warehouse.Warehouse;
import jakarta.persistence.*;

@Entity
public class ParkingSpace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String conditions;
    private Long carId;


    public ParkingSpace() {}

    public ParkingSpace(String category, String conditions, Long carId) {
        this.category = category;
        this.conditions = conditions;
        this.carId = carId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getConditions() {
        return conditions;
    }

    public void setConditions(String conditions) {
        this.conditions = conditions;
    }

    public Long getCarId() { return carId; }

    public void setCarId(Long carId) { this.carId = carId; }
}
