package com.swtp.garagecom.Work;

import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.User.WorkshopOwner;
import com.swtp.garagecom.Workshop.Workshop;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/work")
public class WorkController {

    private final Database database;
    public WorkController(
        Database database
    ){
        this.database = database;
    }

    @GetMapping("/{id}")
    public ResponseEntity getWorkByIDd(@PathVariable Long id) {
        Work work =  database.getWorkByID(id);
        if(work == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no work found");
        return ResponseEntity.ok(work);
    }

    @GetMapping("/all")
    public ResponseEntity getWorks() {
        List<Work> works = database.getWorks();
        if(works == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("works not found");
        return ResponseEntity.ok(works);
    }

    @PostMapping("/create")
    public ResponseEntity createWork(@AuthenticationPrincipal String email, @RequestBody Work work) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no user found");
        if(user instanceof WorkshopOwner workshopOwner) {
            Workshop workshop = database.getWorkshopByID(workshopOwner.getWorkshopID());
            if(workshop == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("you must first create a workshop");
            Work newWork = database.saveWork(work);
            if(newWork == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("work creation failed");
            workshop.addWorkID(work.getId());
            database.saveWorkshop(workshop);
            return ResponseEntity.ok(newWork);
        } else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a workshop owner");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteWork(@AuthenticationPrincipal String email, @PathVariable Long id) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no user found");
        if(user instanceof WorkshopOwner workshopOwner) {
            Workshop workshop = database.getWorkshopByID(workshopOwner.getWorkshopID());
            if(workshop == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("you must first create a workshop");
            workshop.removeWorkByID(id);
            if (!database.deleteWorkByID(id)) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("work not found");
            database.saveWorkshop(workshop);
            return ResponseEntity.ok(id);
        } else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a workshop owner");
    }

    @PutMapping("/update")
    public ResponseEntity updateWork(@RequestBody Work work) {
        Work updatedWork = database.updateWork(work);
        if (updatedWork == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("work not found");
        return ResponseEntity.ok(work);
    }
}

