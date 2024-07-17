package com.swtp.garagecom.User;

import com.swtp.garagecom.Offer.Offer;
import com.swtp.garagecom.WorkshopRequest.WorkshopRequest;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("StorageOwner")
public class StorageOwner extends  User{

    @ElementCollection
    private List<Long> offerIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> dateNegotiationIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> workshopRequestIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> receiptReturnNegotiationIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> warehouseIDs = new ArrayList<>();

    public StorageOwner(){}

    public StorageOwner(
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

    public List<Long> getOfferIDs() {
        return offerIDs;
    }

    public void setOfferIDs(List<Long> offerIDs) {
        this.offerIDs = offerIDs;
    }

    public List<Long> getWarehouseIDs() {
        return this.warehouseIDs;
    }

    public void addWarehouseID(Long warehouseID) {
        this.warehouseIDs.add(warehouseID);
    }

    public List<Long> getReceiptReturnNegotiationIDs() {
        return receiptReturnNegotiationIDs;
    }

    public void setReceiptReturnNegotiationIDs(List<Long> receiptReturnNegotiationIDs) {
        this.receiptReturnNegotiationIDs = receiptReturnNegotiationIDs;
    }

    public List<Long> getWorkshopRequestIDs() {
        return workshopRequestIDs;
    }

    public void setWorkshopRequestIDs(List<Long> workshopRequestIDs) {
        this.workshopRequestIDs = workshopRequestIDs;
    }

    public List<Long> getDateNegotiationIDs() {
        return dateNegotiationIDs;
    }

    public void setDateNegotiationIDs(List<Long> dateNegotiationIDs) {
        this.dateNegotiationIDs = dateNegotiationIDs;
    }

    public void addReceiptReturnNegotiationID(Long receiptReturnNegotiationID) { this.receiptReturnNegotiationIDs.add(receiptReturnNegotiationID); }

    public void addOffer(Offer newOffer) {
        this.offerIDs.add(newOffer.getId());
    }

    public void addWorkshopRequest(WorkshopRequest newWorkshopRequest) {
        this.workshopRequestIDs.add(newWorkshopRequest.getId());
    }

    public void addDateNegotiationID(Long dateNegotiationID) { this.dateNegotiationIDs.add(dateNegotiationID); }

}
