package com.swtp.garagecom.Offer;


import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.User.Client;
import com.swtp.garagecom.User.StorageOwner;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.Warehouse.Warehouse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@Controller
@RequestMapping("/api/offer")
public class OfferController {

    private final Database database;

    public OfferController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping("/my")
    public ResponseEntity getMyOffers(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
        List<OfferDTO> myOffers = switch (user) {
            case Client client -> client
                    .getOfferIDs()
                    .stream()
                    .map(database::getOfferByID)
                    .filter(Objects::nonNull)
                    .map(offer -> new OfferDTO(
                            offer.getId(),
                            offer.getDate(),
                            offer.getStatus(),
                            offer.getHistory(),
                            database.getParkingSpaceById(offer.getParkingSpaceID())
                    ))
                    .toList();
            case StorageOwner so -> so
                    .getOfferIDs()
                    .stream()
                    .map(database::getOfferByID)
                    .filter(Objects::nonNull)
                    .map(offer -> new OfferDTO(
                            offer.getId(),
                            offer.getDate(),
                            offer.getStatus(),
                            offer.getHistory(),
                            database.getParkingSpaceById(offer.getParkingSpaceID())
                    ))
                    .toList();
            default -> null;
        };
        if(myOffers == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        return ResponseEntity.ok(myOffers);
    }

    @PostMapping("/create/{wareHouseID}/{parkingSpaceID}")
    public ResponseEntity createOffer(@AuthenticationPrincipal String email, @PathVariable Long wareHouseID, @PathVariable Long parkingSpaceID) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
        Warehouse wh = database.getWarehouseById(wareHouseID);
        if(wh == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find warehouse");
        StorageOwner so = database.getStorageOwnerFromWarehouseID(wh.getId());

        switch (user)  {
            case Client client -> {
                Offer offer = new Offer(
                        (new Date()).toString(),
                        "accept/dismiss",
                        "Warte auf Bestätigung des Lagerhalters. (" + email + ")",
                        parkingSpaceID,
                        client.getId(),
                        so.getId()
                );
                Offer newOffer = database.saveOffer(offer);
                if(newOffer == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save offer");
                //add to client
                client.addOffer(newOffer);
                if(!database.saveUser(client)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save client");
                //add to storageOwner
                so.addOffer(newOffer);
                if(!database.saveUser(so)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save StorageOwner");
                return ResponseEntity.ok(newOffer);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a client");
            }
        }
    }

    @PostMapping("/eval/{offerId}/{accepted}")
    public ResponseEntity evalOffer(@AuthenticationPrincipal String email, @PathVariable Long offerId, @PathVariable boolean accepted) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
        switch (user)  {
            case StorageOwner so -> {
                Offer offer = database.getOfferByID(offerId);
                if(offer == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save offer");
                String lastEmail =  offer.getHistory().getLast().split("\\(")[1];
                String newHistoryElement = accepted ? ("Der Lagerhalter hat das Angebot angenommen. (" + lastEmail +")") : ("Der Lagerhalter hat das Angebot abgelehnt. (" + lastEmail + ")");
                offer.addToHistory(newHistoryElement);
                offer.setStatus(accepted ? "done-accepted": "done-dismissed");
                Offer newOffer = database.saveOffer(offer);
                if(newOffer == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save offer");
                return ResponseEntity.ok(newOffer);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage-owner");
            }
        }
    }

}
