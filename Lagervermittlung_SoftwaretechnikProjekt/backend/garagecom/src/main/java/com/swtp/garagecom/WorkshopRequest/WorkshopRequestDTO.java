package com.swtp.garagecom.WorkshopRequest;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.Work.Work;
import com.swtp.garagecom.Workshop.Workshop;

import java.util.List;

public class WorkshopRequestDTO {

    private String date;
    private String status;
    private List<String> history;
    private Car car;
    private Work work;
    private Workshop workShop;
    private Long id;

    public WorkshopRequestDTO(Long id, String date, String status, List<String> history, Car car, Work work, Workshop workShop) {
        this.date = date;
        this.status = status;
        this.history = history;
        this.car = car;
        this.work = work;
        this.workShop = workShop;
        this.id = id;
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

    public Workshop getWorkShop() {
        return workShop;
    }

    public void setWorkShop(Workshop workShop) {
        this.workShop = workShop;
    }

    public Work getWork() {
        return work;
    }

    public void setWork(Work work) {
        this.work = work;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
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
}
