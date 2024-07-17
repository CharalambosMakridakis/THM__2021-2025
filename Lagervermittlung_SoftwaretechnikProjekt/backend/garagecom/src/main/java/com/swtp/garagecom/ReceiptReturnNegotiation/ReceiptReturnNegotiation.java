package com.swtp.garagecom.ReceiptReturnNegotiation;

import com.swtp.garagecom.Inquiry.Inquiry;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ReceiptReturnNegotiation")
public class ReceiptReturnNegotiation extends Inquiry {

    private Long carID;
    private Long clientID;
    private Long storageOwnerID;

    public ReceiptReturnNegotiation(){}

    public ReceiptReturnNegotiation(String date, String status, String history, Long carID, Long clientID, Long storageOwnerID) {
        super(date, status, history);
        this.carID = carID;
        this.clientID = clientID;
        this.storageOwnerID = storageOwnerID;
    }

    public Long getCarID() {
        return carID;
    }

    public void setCarID(Long carID) {
        this.carID = carID;
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
