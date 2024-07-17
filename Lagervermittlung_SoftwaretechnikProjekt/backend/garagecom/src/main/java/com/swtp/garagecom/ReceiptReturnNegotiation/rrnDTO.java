package com.swtp.garagecom.ReceiptReturnNegotiation;

import com.swtp.garagecom.Car.Car;

import java.util.List;

public class rrnDTO {
    private Long id;
    private String date;
    private String status;
    private List<String> history;
    private Car car;

    public rrnDTO(Long id, String date, String status, List<String> history, Car car){
        this.id = id;
        this.date = date;
        this.status = status;
        this.history = history;
        this.car = car;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<String> getHistory() {
        return history;
    }

    public void setHistory(List<String> history) {
        this.history = history;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }
}
