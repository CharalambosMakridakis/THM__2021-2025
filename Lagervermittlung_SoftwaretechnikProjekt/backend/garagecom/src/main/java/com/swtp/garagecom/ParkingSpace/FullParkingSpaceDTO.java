package com.swtp.garagecom.ParkingSpace;

import com.swtp.garagecom.Car.Car;

public class FullParkingSpaceDTO {

    //ParkingSpace
    private Long id;
    private String category;
    private String conditions;


    //Car
    private Car car;


    public FullParkingSpaceDTO(Long id,
                               String category,
                               String conditions,
                               Car car) {
        this.id = id;
        this.category = category;
        this.conditions = conditions;
        this.car = car;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public String getConditions() { return conditions; }

    public void setConditions(String conditions) { this.conditions = conditions; }

    public Car getCar() { return this.car; }

    public void setCar(Car car) {  this.car = car; }
}
