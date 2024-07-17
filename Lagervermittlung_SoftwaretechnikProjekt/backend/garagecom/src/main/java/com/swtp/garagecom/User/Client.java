package com.swtp.garagecom.User;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.Offer.Offer;
import com.swtp.garagecom.SpareAccessoryPart.SpareAccessoryPart;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("Client")
public class Client extends User {

    @ElementCollection
    private List<Long> carIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> offerIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> spareAccessoryIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> receiptReturnNegotiationIDs = new ArrayList<>();

    public Client(){}

    public Client(
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


    public void addCar(Car car){
        carIDs.add(car.getId());
    }

    public void addSpareAccessoryPart(SpareAccessoryPart spareAccessoryPart){
        spareAccessoryIDs.add(spareAccessoryPart.getId());
    }

    public List<Long> getCarIDs() {
        return carIDs;
    }

    public void setCarIDs(List<Long> carIDs) {
        this.carIDs = carIDs;
    }

    public List<Long> getOfferIDs() {
        return offerIDs;
    }

    public void setOfferIDs(List<Long> offerIDs) {
        this.offerIDs = offerIDs;
    }

    public List<Long> getSpareAccessoryIDs() {
        return spareAccessoryIDs;
    }

    public void setSpareAccessoryIDs(List<Long> spareAccessoryIDs) {
        this.spareAccessoryIDs = spareAccessoryIDs;
    }

    public List<Long> getReceiptReturnNegotiationIDs() {
        return receiptReturnNegotiationIDs;
    }

    public void setReceiptReturnNegotiationIDs(List<Long> receiptReturnNegotiationIDs) { this.receiptReturnNegotiationIDs = receiptReturnNegotiationIDs; }

    public void addReceiptReturnNegotiationID(Long receiptReturnNegotiationID) { this.receiptReturnNegotiationIDs.add(receiptReturnNegotiationID); }

    public void addOffer(Offer offer) {
        this.offerIDs.add(offer.getId());
    }
}
