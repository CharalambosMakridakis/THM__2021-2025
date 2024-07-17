package com.swtp.garagecom.DateNegotiation;


import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.ReceiptReturnNegotiation.ReceiptReturnNegotiation;
import com.swtp.garagecom.User.Client;
import com.swtp.garagecom.User.StorageOwner;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.User.WorkshopOwner;
import com.swtp.garagecom.Workshop.Workshop;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@Controller
@RequestMapping("/api/datenegotiation")
public class DateNegotiationController {

    private final Database database;

    public DateNegotiationController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping("/my")
    public ResponseEntity getMyDateNegotiation(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");

        List<DateNegotiation> myDateNegations = new ArrayList<>();
        final List<Long> myDateNegotiationIds;

        if (user instanceof StorageOwner storageOwner) {
            myDateNegotiationIds = storageOwner.getDateNegotiationIDs();
        } else if (user instanceof WorkshopOwner workshopOwner) {
            Workshop workshop = database.getWorkshopByID(workshopOwner.getWorkshopID());
            myDateNegotiationIds = workshop.getDateNegotiationIDs();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("false user");
        }

        for(Long myDateNegotiationId : myDateNegotiationIds) {
            DateNegotiation dummy = database.getDateNegotiationByID(myDateNegotiationId);
            if(dummy != null) myDateNegations.add(dummy);
        }
        if(myDateNegations == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        return ResponseEntity.ok(myDateNegations);
    }


    @PostMapping("/create/{workshopID}")
    public ResponseEntity createRRNC(@RequestBody String date, @AuthenticationPrincipal String email, @PathVariable Long workshopID) {
        User user = database.getUserByEmail(email);
        if (user == null) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user"); }

        switch (user) {
            case StorageOwner storageOwner -> {
                if (workshopID == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find storage owner with carID");

                DateNegotiation dateNegotiation = new DateNegotiation(
                        (new Date()).toString(),
                        "accept/dismiss-wo",
                        "Warte auf Bestätigung des Werkstattinhabers für " + date + " .",
                        workshopID,
                        storageOwner.getId()
                );

                DateNegotiation newDn = database.saveDateNegotiation(dateNegotiation);
                if(newDn == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save date negotiation");
                storageOwner.addDateNegotiationID(dateNegotiation.getId());
                database.saveUser(storageOwner);
                Workshop workshop = database.getWorkshopByID(workshopID);
                if(workshop == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find wokshop");
                workshop.addDateNegotiationID(dateNegotiation.getId());
                database.saveWorkshop(workshop);
                return ResponseEntity.status(HttpStatus.OK).body(workshop);

            }
            default -> { return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user"); }
            }
    }

    @PostMapping("/eval/{dateNegotiationId}/{accepted}")
    public ResponseEntity evalDateNegotiation(@RequestBody String newDate, @AuthenticationPrincipal String email, @PathVariable Long dateNegotiationId, @PathVariable boolean accepted) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");

        switch (user)  {
            case StorageOwner so -> {
                DateNegotiation dateNegotiation = database.getDateNegotiationByID(dateNegotiationId);
                if(dateNegotiation == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                String newHistoryElement = "";
                if (accepted) {
                    newHistoryElement = "Der Lagerhalter hat " + dateNegotiation.getHistory().getLast().split("\"")[1] + " angenommen.";
                    dateNegotiation.addToHistory(newHistoryElement);
                    dateNegotiation.setStatus("done-accepted");
                } else if (!Objects.equals(newDate, "\"\"")){
                    newHistoryElement = "Der Lagerhalter hat " + newDate + " vorgeschlagen.";
                    dateNegotiation.addToHistory(newHistoryElement);
                    dateNegotiation.setStatus("accept/dismiss-wo");
                }else {
                    newHistoryElement = "Der Lagerhalter hat die Terminverhandlung abgebrochen.";
                    dateNegotiation.addToHistory(newHistoryElement);
                    dateNegotiation.setStatus("done-dismissed");
                }
                if(database.saveDateNegotiation(dateNegotiation) == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                return ResponseEntity.ok(dateNegotiation);
            }
            case WorkshopOwner wo -> {
                DateNegotiation dateNegotiation = database.getDateNegotiationByID(dateNegotiationId);
                if(dateNegotiation == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not find date negotiation");
                String newHistoryElement = "";
                if (accepted) {
                    newHistoryElement = "Werkstattinhaber hat " + dateNegotiation.getHistory().getLast().split("\"")[1] + " angenommen.";
                } else {
                    newHistoryElement = "Werkstattinhaber hat " + newDate + " vorgeschlagen.";
                }
                dateNegotiation.addToHistory(newHistoryElement);
                dateNegotiation.setStatus(accepted ? "done-accepted" : "accept/dismiss-so");
                if(database.saveDateNegotiation(dateNegotiation) == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                return ResponseEntity.ok(dateNegotiation);
            }

            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage-owner");
            }
        }
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity cancleRRN(@AuthenticationPrincipal String email, @PathVariable Long id) {
        DateNegotiation dn = database.getDateNegotiationByID(id);
        if(dn == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not find dn");
        dn.setStatus("done-dismissed");
        DateNegotiation newDn = database.saveDateNegotiation(dn);
        if(newDn == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save dn");
        return ResponseEntity.ok(newDn);
    }

}

