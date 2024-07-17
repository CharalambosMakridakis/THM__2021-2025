package com.swtp.garagecom.Workshop;

import com.swtp.garagecom.Work.Work;

import java.util.List;

public class FullWorkshopDTO {

    private Long id;
    private String address;
    private String brandSpecialization;
    private List<String> openingHours;

    private List<Work> work;

    public FullWorkshopDTO() { }

    public FullWorkshopDTO(Long id, String address, String bandSpecialization, List<String> openingHours, List<Work> work) {
        this.id = id;
        this.address = address;
        this.brandSpecialization = bandSpecialization;
        this.openingHours = openingHours;
        this.work = work;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<Work> getWork() {
        return work;
    }

    public void setWork(List<Work> work) {
        this.work = work;
    }
}
