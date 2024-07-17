package com.swtp.garagecom.Inquiry;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "inquiry_type", discriminatorType = DiscriminatorType.STRING)
public class Inquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String status;

    @ElementCollection
    private List<String> history;

    public Inquiry() {}

    public Inquiry(String date, String status, String initialHistory) {
        this.date = date;
        this.status = status;
        this.history = new ArrayList<>();
        this.history.add(initialHistory);
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getHistory() {
        return history;
    }

    public void setHistory(List<String> history) {
        this.history = history;
    }

    public void addToHistory(String historyElement) {
        this.history.add(historyElement);
    }
}
