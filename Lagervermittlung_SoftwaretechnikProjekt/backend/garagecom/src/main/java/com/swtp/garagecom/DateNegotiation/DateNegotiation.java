package com.swtp.garagecom.DateNegotiation;

import com.swtp.garagecom.Inquiry.Inquiry;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DateNegotiation")
public class DateNegotiation extends Inquiry {

    private Long workshopID;
    private Long storageOwnerID;

    public DateNegotiation() {}
    public DateNegotiation(String date, String status, String history, Long workshopID, Long storageOwnerID) {
        super(date, status, history);
        this.workshopID = workshopID;
        this.storageOwnerID = storageOwnerID;
    }

    public Long getClientID() {
        return workshopID;
    }

    public void setClientID(Long workshopID) {
        this.workshopID = workshopID;
    }

    public Long getStorageOwnerID() {
        return storageOwnerID;
    }

    public void setStorageOwnerID(Long storageOwnerID) {
        this.storageOwnerID = storageOwnerID;
    }
}
