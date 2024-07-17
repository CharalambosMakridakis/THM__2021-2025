package com.swtp.garagecom.WorkshopRequest;

import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.User.StorageOwner;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.User.WorkshopOwner;
import com.swtp.garagecom.Workshop.Workshop;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/workshopRequest")
public class WorkshopRequestController {

    private final Database database;

    public WorkshopRequestController(
            Database database
    ){
        this.database = database;
    }

    @PostMapping("/create/{carID}/{workID}/{workshopID}")
    public ResponseEntity createWorkshopRequest(@AuthenticationPrincipal String email, @PathVariable Long carID, @PathVariable Long workID, @PathVariable Long workshopID) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
        Workshop workshop = database.getWorkshopByID(workshopID);
        if (workshop == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find workshop");
        switch (user)  {
            case StorageOwner so -> {
                WorkshopRequest wo = new WorkshopRequest(
                        (new Date()).toString(),
                        "accept/dismiss",
                        "Warte auf Bestätigung der Werkstatt.",
                        carID,
                        workID,
                        workshop.getId(),
                        user.getId()
                );
                WorkshopRequest newWorkshopRequest = database.saveWorkshopRequest(wo);
                if(newWorkshopRequest == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save WorkshopRequest");
                //add to StorageOwner
                so.addWorkshopRequest(newWorkshopRequest);
                if(!database.saveUser(so)) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save StorageOwner");
                //add to Workshop
                workshop.addWorkshopRequest(newWorkshopRequest);
                Workshop newWo = database.saveWorkshop(workshop);
                if(newWo == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save Workshop");
                WorkshopRequestDTO wDTO =  new WorkshopRequestDTO(
                        newWorkshopRequest.getId(),
                        newWorkshopRequest.getDate(),
                        newWorkshopRequest.getStatus(),
                        newWorkshopRequest.getHistory(),
                        database.getCarById(newWorkshopRequest.getCarID()),
                        database.getWorkByID(newWorkshopRequest.getWorkID()),
                        newWo
                );
                return ResponseEntity.ok(wDTO);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a client");
            }
        }
    }

    @PostMapping("/eval/{workshopRequestId}/{accepted}")
    public ResponseEntity evalWorkshopRequest(@AuthenticationPrincipal String email, @PathVariable Long workshopRequestId, @PathVariable boolean accepted) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");
        switch (user)  {
            case WorkshopOwner wo -> {
                WorkshopRequest wor = database.getWorkshopRequestByID(workshopRequestId);
                if(wor == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not find WorkshopRequest");
                String newHistoryElement = accepted ? "Der Werkstattinhaber hat die Anfrage angenommen." : "Der Werkstattinhaber hat die Anfrage abgelehnt.";
                wor.addToHistory(newHistoryElement);
                wor.setStatus(accepted ? "done-date" : "done-dismissed");
                WorkshopRequest newWOR = database.saveWorkshopRequest(wor);
                if(newWOR == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not save offer");
                return ResponseEntity.ok(newWOR);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a storage-owner");
            }
        }
    }

    @PostMapping("/setdone/{workshopRequestId}")
    public ResponseEntity setDone(@PathVariable Long workshopRequestId) {
        WorkshopRequest wor = database.getWorkshopRequestByID(workshopRequestId);
        if(wor == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find WorkshopRequest");
        wor.setStatus("done-accepted");
        WorkshopRequest newWor = database.saveWorkshopRequest(wor);
        return ResponseEntity.ok(newWor);
    }

    @GetMapping("/my")
    public ResponseEntity getMyWorkshopRequests(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not find user");

        List<WorkshopRequestDTO> myWorkshopRequest = switch (user) {
            case WorkshopOwner w -> database.getWorkshopByID(w.getWorkshopID())
                    .getWorkshopRequestIDs()
                    .stream()
                    .map(database::getWorkshopRequestByID)
                    .filter(Objects::nonNull)
                    .map(workshopRequest -> new WorkshopRequestDTO(
                            workshopRequest.getId(),
                            workshopRequest.getDate(),
                            workshopRequest.getStatus(),
                            workshopRequest.getHistory(),
                            database.getCarById(workshopRequest.getCarID()),
                            database.getWorkByID(workshopRequest.getWorkID()),
                            database.getWorkshopByID(workshopRequest.getWorkShopID())
                    ))
                    .toList();
            case StorageOwner so -> so.getWorkshopRequestIDs()
                    .stream()
                    .map(database::getWorkshopRequestByID)
                    .filter(Objects::nonNull)
                    .map(workshopRequest -> new WorkshopRequestDTO(
                            workshopRequest.getId(),
                            workshopRequest.getDate(),
                            workshopRequest.getStatus(),
                            workshopRequest.getHistory(),
                            database.getCarById(workshopRequest.getCarID()),
                            database.getWorkByID(workshopRequest.getWorkID()),
                            database.getWorkshopByID(workshopRequest.getWorkShopID())
                    ))
                    .toList();
            default -> null;
        };
        if(myWorkshopRequest == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error");
        return ResponseEntity.ok(myWorkshopRequest);
    }
}
