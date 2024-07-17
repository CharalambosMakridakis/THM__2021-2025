package com.swtp.garagecom.ReceiptReturnNegotiation;

import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.Offer.Offer;
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
import java.util.stream.Collectors;

@CrossOrigin
@Controller
@RequestMapping("/api/rrn")
public class ReceiptReturnNegotiationController {

    private final Database database;

    public ReceiptReturnNegotiationController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping("/my")
    public ResponseEntity getMyReceiptReturnNegotiation(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");

        List<rrnDTO> myRRNs = new ArrayList<>();
        final List<Long> myRRNIDs;

        if (user instanceof Client client) {
            myRRNIDs = client.getReceiptReturnNegotiationIDs();
        } else if (user instanceof StorageOwner storageOwner) {
            myRRNIDs = storageOwner.getReceiptReturnNegotiationIDs();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("false user");
        }

        for(Long myRRNID : myRRNIDs){
            ReceiptReturnNegotiation dummy = database.getRRNByID(myRRNID);
            rrnDTO dto = new rrnDTO(
                    dummy.getId(),
                    dummy.getDate(),
                    dummy.getStatus(),
                    dummy.getHistory(),
                    database.getCarById(dummy.getCarID())
            );
            if(dummy != null) myRRNs.add(dto);
        }

        if(myRRNs == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        return ResponseEntity.ok(myRRNs);
    }

    @PostMapping("/create/{carID}")
    public ResponseEntity createRRNC(@RequestBody String date, @AuthenticationPrincipal String email, @PathVariable Long carID) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
        switch (user) {
            case Client client -> {

                Long storageOwnerID = database.getStorageOwnerByCar(carID);
                if(storageOwnerID == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find storage owner with carID");
                }

                ReceiptReturnNegotiation rrn = new ReceiptReturnNegotiation(
                        (new Date()).toString(),
                        "accept/dismiss-so",
                        "Warte auf Bestätigung des Lagerhalters für " + date + ".",
                        carID,
                        client.getId(),
                        storageOwnerID
                );
                if(database.saveRRN(rrn) == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");

                client.addReceiptReturnNegotiationID(rrn.getId());
                if(!database.saveUser(client)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save client");
                StorageOwner storageOwner = database.getStorageOwnerById(storageOwnerID);
                if(storageOwner == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find storage owner");
                }
                storageOwner.addReceiptReturnNegotiationID(rrn.getId());
                if(!database.saveUser(storageOwner)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save storageOwner");
                return ResponseEntity.ok(rrn);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
            }
        }
    }


    @PostMapping("/eval/{rrnId}/{accepted}")
    public ResponseEntity evalRRN(@RequestBody String newDate, @AuthenticationPrincipal String email, @PathVariable Long rrnId, @PathVariable boolean accepted) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");

        switch (user)  {
            case StorageOwner so -> {
                ReceiptReturnNegotiation rrn = database.getRRNByID(rrnId);
                if(rrn == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                String newHistoryElement = "";
                if(accepted) {
                    newHistoryElement = "Lagerhalter hat " + rrn.getHistory().getLast().split("\"")[1] + " angenommen.";
                }else{
                    newHistoryElement = "Lagerhalter hat " + newDate + " vorgeschlagen.";
                }
                rrn.addToHistory(newHistoryElement);
                rrn.setStatus(accepted ? "done-accepted" : "accept/dismiss-cl");
                if(database.saveRRN(rrn) == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                return ResponseEntity.ok(rrn);
            }
            case Client cl -> {
                ReceiptReturnNegotiation rrn = database.getRRNByID(rrnId);
                if(rrn == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                String newHistoryElement = "";
                if (accepted) {
                    newHistoryElement = "Einlagerer hat " + rrn.getHistory().getLast().split("\"")[1] + " angenommen.";
                } else {
                    newHistoryElement = "Einlagerer hat " + newDate + " vorgeschlagen.";
                }
                rrn.addToHistory(newHistoryElement);
                rrn.setStatus(accepted ? "done-accepted" : "accept/dismiss-so");
                if(database.saveRRN(rrn) == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
                return ResponseEntity.ok(rrn);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage-owner");
            }
        }
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity cancleRRN(@PathVariable Long id) {
        ReceiptReturnNegotiation rrn = database.getRRNByID(id);
        if(rrn == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not find rrn");
        rrn.setStatus("done-dismissed");
        ReceiptReturnNegotiation newRRN = database.saveRRN(rrn);
        if(newRRN == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save rrn");
        return ResponseEntity.ok(rrn);
    }
}
