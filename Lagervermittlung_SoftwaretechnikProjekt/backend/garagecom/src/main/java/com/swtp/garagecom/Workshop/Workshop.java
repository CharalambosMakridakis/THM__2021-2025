package com.swtp.garagecom.Workshop;

import com.swtp.garagecom.WorkshopRequest.WorkshopRequest;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Entity
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;
    private String brandSpecialization;

    @ElementCollection
    private List<String> openingHours = new ArrayList<>();

    @ElementCollection
    private List<Long> workIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> workshopRequestIDs = new ArrayList<>();

    @ElementCollection
    private List<Long> dateNegotiationIDs = new ArrayList<>();

    public Workshop(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Workshop(String address, String bandSpecialization, List<String> openingHours) {
        this.address = address;
        this.brandSpecialization = bandSpecialization;
        this.openingHours = openingHours;
    }

    public void addWorkID(Long id) {
        workIDs.add(id);
    }

    public void addWorkshopRequestID(WorkshopRequest workshopRequest) {
        this.workshopRequestIDs.add(workshopRequest.getId());
    }

    public void addWorkshopRequest(WorkshopRequest workshopRequest) {
        this.workshopRequestIDs.add(workshopRequest.getId());
    }

    public List<Long> getWorkshopRequestIDs() {
        return workshopRequestIDs;
    }

    public void setWorkshopRequestIDs(List<Long> workshopRequestIDs) {
        this.workshopRequestIDs = workshopRequestIDs;
    }

    public List<Long> getWorkIDs() { return workIDs; }

    public List<Long> getDateNegotiationIDs() { return dateNegotiationIDs; }

    public void setDateNegotiationIDs(List<Long> dateNegotiationIDs) { this.dateNegotiationIDs = dateNegotiationIDs; }

    public void addDateNegotiationID(Long dateNegotiationID) { this.dateNegotiationIDs.add(dateNegotiationID); }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBrandSpecialization() {
        return brandSpecialization;
    }

    public void setBrandSpecialization(String brandSpecialization) {
        this.brandSpecialization = brandSpecialization;
    }

    public List<String> getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(List<String> openingHours) {
        this.openingHours = openingHours;
    }

    public void setWorkIDs(List<Long> workIDs) {
        this.workIDs = workIDs;
    }

    public void removeWorkByID(Long id) {
        Iterator<Long> iterator = workIDs.iterator();
        while (iterator.hasNext()) {
            Long workID = iterator.next();
            if (workID.equals(id)) {
                iterator.remove();
            }
        }
    }
}
