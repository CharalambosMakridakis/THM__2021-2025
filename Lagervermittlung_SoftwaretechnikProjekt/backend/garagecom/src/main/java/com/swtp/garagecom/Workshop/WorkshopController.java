package com.swtp.garagecom.Workshop;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.User.WorkshopOwner;
import com.swtp.garagecom.Warehouse.FullWarehouseDTO;
import com.swtp.garagecom.Warehouse.Warehouse;
import com.swtp.garagecom.Work.Work;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/workshops")
public class WorkshopController {

    private final Database database;

    public WorkshopController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping("/all")
    public ResponseEntity getWorkshops() {
        List<Workshop> workshops = database.getWorkshops();
        if(workshops == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("workshops not found");
        List<FullWorkshopDTO> fullWorkshopDTOs = new ArrayList<>();
        for (Workshop workshop : workshops) {
            List<Long> workshopIDs = workshop.getWorkIDs();
            List<Work> works = database.getWorkByIDs(workshopIDs);
            FullWorkshopDTO fullWorkshopDTO = new FullWorkshopDTO(
                    workshop.getId(),
                    workshop.getAddress(),
                    workshop.getBrandSpecialization(),
                    workshop.getOpeningHours(),
                    works
            );
            fullWorkshopDTOs.add(fullWorkshopDTO);
        }
        return ResponseEntity.ok(fullWorkshopDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity getWorkshopById(@PathVariable Long id) {
        Workshop workshop = database.getWorkshopByID(id);
        if(workshop == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("workshop not found");
        List<Long> workIDs = workshop.getWorkIDs();
        List<Work> works = database.getWorkByIDs(workIDs);
        FullWorkshopDTO fullWorkshopDTO = new FullWorkshopDTO(
                workshop.getId(),
                workshop.getAddress(),
                workshop.getBrandSpecialization(),
                workshop.getOpeningHours(),
                works
        );
        return ResponseEntity.ok(fullWorkshopDTO);
    }

    @GetMapping("/{workshopID}/{workID}")
    public ResponseEntity getWorkByWorkshopID(@PathVariable Long workshopID, @PathVariable Long workID) {
        Workshop workshop = database.getWorkshopByID(workshopID);
        if(workshop == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("workshop not found");
        List<Long> workIDs = workshop.getWorkIDs();
        if(workIDs.contains(workID)) return ResponseEntity.ok(database.getWorkByID(workID));
        else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("work not found");
    }

    @PostMapping("/create")
    public ResponseEntity createWorkshop(@AuthenticationPrincipal String email, @RequestBody Workshop workshop) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found");
        if(user instanceof WorkshopOwner workshopOwner) {
            if(workshopOwner.getWorkshopID() != null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Workshop already exists");
            Workshop workshopToCreate = database.saveWorkshop(workshop);
            if(workshopToCreate == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not create workshop");
            workshopOwner.setWorkshopID(workshopToCreate.getId());
            if(!(database.saveUser(workshopOwner))) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("could not safe user");
            return ResponseEntity.ok(workshopToCreate);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User is not workshop owner");
        }
    }

    @GetMapping("/my")
    public ResponseEntity getMyFullWorkshopInformation(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found");
        if(user instanceof WorkshopOwner) {
            Long workshopID = ((WorkshopOwner) user).getWorkshopID();
            if(workshopID == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workshop not found");
            Workshop workshop = database.getWorkshopByID(workshopID);
            if(workshop != null) {
                List<Long> workIDs = workshop.getWorkIDs();
                if(workIDs != null) {
                    List<Work> works = database.getWorkByIDs(workIDs);
                    if(works != null) {
                        FullWorkshopDTO fullWorkshopDTO = new FullWorkshopDTO(
                                workshopID,
                                workshop.getAddress(),
                                workshop.getBrandSpecialization(),
                                workshop.getOpeningHours(),
                                works
                        );
                        return ResponseEntity.ok(fullWorkshopDTO);
                    } else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("no works for ids found");
                } else {
                    FullWorkshopDTO fullWorkshopDTO = new FullWorkshopDTO(
                            workshopID,
                            workshop.getAddress(),
                            workshop.getBrandSpecialization(),
                            workshop.getOpeningHours(),
                            null
                    );
                    return ResponseEntity.ok(fullWorkshopDTO);
                }
            } else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("workshop by workshopid not found");
        } else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User is not workshop owner");
    }

    @PutMapping("/update")
    public ResponseEntity updateWorkshop(@AuthenticationPrincipal String email, @RequestBody Workshop updatedWorkshop) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found");
        if(user instanceof WorkshopOwner) {
            Workshop workshop = database.getWorkshopByID(updatedWorkshop.getId());
            updatedWorkshop.setWorkIDs(workshop.getWorkIDs());
            updatedWorkshop.setWorkshopRequestIDs(workshop.getWorkshopRequestIDs());
            updatedWorkshop.setDateNegotiationIDs(workshop.getDateNegotiationIDs());
            if(database.updateWorkshop(updatedWorkshop)) return ResponseEntity.ok(updatedWorkshop);
            else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not update workshop");
        } else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User is not workshop owner");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteWorkshop(@AuthenticationPrincipal String email,@PathVariable Long id) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found");
        if(user instanceof WorkshopOwner workshopOwner) {
            if(database.deleteWorkshop(id)) {
                workshopOwner.setWorkshopID(null);
                database.saveUser(workshopOwner);
                return ResponseEntity.ok(id);
            }
            else return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not delete workshop");
        } else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User is not workshop owner");
    }
}
