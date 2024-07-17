package com.swtp.garagecom.Offer;

import com.swtp.garagecom.Inquiry.Inquiry;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Offer")
public class Offer extends Inquiry {

    private Long parkingSpaceID;
    private Long clientID;
    private Long storageOwnerID;

    public Offer() {}
    public Offer(String date, String status, String initialHistory, Long parkingSpaceID, Long clientID, Long storageOwnerID) {
        super(date, status, initialHistory);
        this.parkingSpaceID = parkingSpaceID;
        this.clientID = clientID;
        this.storageOwnerID = storageOwnerID;
    }

    public Long getParkingSpaceID() {
        return parkingSpaceID;
    }

    public void setParkingSpaceID(Long parkingSpaceID) {
        this.parkingSpaceID = parkingSpaceID;
    }

    public Long getClientID() {
        return clientID;
    }

    public void setClientID(Long clientID) {
        this.clientID = clientID;
    }

    public Long getStorageOwnerID() {
        return storageOwnerID;
    }

    public void setStorageOwnerID(Long storageOwnerID) {
        this.storageOwnerID = storageOwnerID;
    }
}
