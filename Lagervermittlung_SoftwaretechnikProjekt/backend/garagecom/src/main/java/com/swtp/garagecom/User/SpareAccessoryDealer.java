package com.swtp.garagecom.User;

import com.swtp.garagecom.SpareAccessoryPart.SpareAccessoryPart;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("SpareAccessoryDealer")
public class SpareAccessoryDealer extends User{

    @ElementCollection
    private List<Long> spareAccessoryIDs = new ArrayList<>();

    public SpareAccessoryDealer(){}

    public SpareAccessoryDealer(
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

    public void addSpareAccessoryPart(SpareAccessoryPart spareAccessoryPart){
        this.spareAccessoryIDs.add(spareAccessoryPart.getId());
    }

    public List<Long> getSpareAccessoryIDs(){
        return spareAccessoryIDs;
    }
}
