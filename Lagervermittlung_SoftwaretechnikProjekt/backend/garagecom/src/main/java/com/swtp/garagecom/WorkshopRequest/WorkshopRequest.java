package com.swtp.garagecom.WorkshopRequest;

import com.swtp.garagecom.Inquiry.Inquiry;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("WorkshopRequest")
public class WorkshopRequest extends Inquiry {

    private Long carID;
    private Long workID;
    private Long workShopIDRequest;
    private Long storageOwnerID;

    public WorkshopRequest() {}
    public WorkshopRequest(String date, String status, String history, Long carID, Long workID, Long workShopID, Long storageOwnerID) {
        super(date, status, history);
        this.carID = carID;
        this.workID = workID;
        this.workShopIDRequest = workShopID;
        this.storageOwnerID = storageOwnerID;
    }

    public Long getCarID() {
        return carID;
    }

    public void setCarID(Long carID) {
        this.carID = carID;
    }

    public Long getWorkShopID() {
        return workShopIDRequest;
    }

    public void setWorkShopID(Long workShopID) {
        this.workShopIDRequest = workShopID;
    }

    public Long getWorkID() {
        return workID;
    }

    public void setWorkID(Long workID) {
        this.workID = workID;
    }

    public Long getStorageOwnerID() {
        return storageOwnerID;
    }

    public void setStorageOwnerID(Long storageOwnerID) {
        this.storageOwnerID = storageOwnerID;
    }
}