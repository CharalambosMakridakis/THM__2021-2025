package com.swtp.garagecom.User;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("WorkshopOwner")
public class WorkshopOwner extends User {
    private Long workshopID;



    public WorkshopOwner(){}

    public WorkshopOwner(
            String email,
            String password,
            String firstName,
            String lastName,
            String phoneNumber,
            String address,
            String birthDate
    ){
        super(email, password, firstName, lastName, phoneNumber, address, birthDate);
    }

    public Long getWorkshopID() {
        return workshopID;
    }

    public void setWorkshopID(Long workshopID) {
        this.workshopID = workshopID;
    }
}
