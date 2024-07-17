package com.swtp.garagecom.Offer;

import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.User.Client;
import jakarta.persistence.ElementCollection;

import java.util.List;

public class OfferDTO {
    private Long id;
    private String date;
    private String status;
    private List<String> history;
    private ParkingSpace parkingSpace;

    public OfferDTO(Long id, String date, String status, List<String> history, ParkingSpace parkingSpace){
        this.id = id;
        this.date = date;
        this.status = status;
        this.history = history;
        this.parkingSpace = parkingSpace;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getHistory() {
        return history;
    }

    public void setHistory(List<String> history) {
        this.history = history;
    }

    public ParkingSpace getParkingSpace() {
        return parkingSpace;
    }

    public void setParkingSpace(ParkingSpace parkingSpace) {
        this.parkingSpace = parkingSpace;
    }

}
