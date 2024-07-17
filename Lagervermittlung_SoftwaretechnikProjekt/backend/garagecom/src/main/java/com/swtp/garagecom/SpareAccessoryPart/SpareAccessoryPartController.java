package com.swtp.garagecom.SpareAccessoryPart;

import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.User.Client;
import com.swtp.garagecom.User.SpareAccessoryDealer;
import com.swtp.garagecom.User.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/SAP")
public class SpareAccessoryPartController {

    private final Database database;

    public SpareAccessoryPartController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping("/my")
    public ResponseEntity getMyAccessoryParts(@AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        switch (user) {
            case Client client -> {
                List<SpareAccessoryPart> spas = client
                        .getSpareAccessoryIDs()
                        .stream()
                        .map(database::getSpareAccessoryPartById)
                        .filter(Objects::nonNull)
                        .toList();
                return ResponseEntity.ok(spas);
            }
            case SpareAccessoryDealer dealer -> {
                List<SpareAccessoryPart> spas = dealer
                        .getSpareAccessoryIDs()
                        .stream()
                        .map(database::getSpareAccessoryPartById)
                        .filter(Objects::nonNull)
                        .toList();
                return ResponseEntity.ok(spas);
            }
            default -> {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("you are not a client");
            }
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity getSpareAccessoryPartById(@PathVariable Long id) {
        SpareAccessoryPart spa = database.getSpareAccessoryPartById(id);
        if (spa != null) {
            return ResponseEntity.ok(spa);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no such spare accessory part");
        }
    }

    @GetMapping("/search/{model}/{brand}")
    public ResponseEntity searchAccessoryParts(@PathVariable String model, @PathVariable String brand) {
        List<SpareAccessoryPart> spas = database.searchAccessoryParts(model, brand);
        if (spas != null) {
            return ResponseEntity.ok(spas);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no such spare accessory part");
        }
    }

    @PostMapping("/create")
    public ResponseEntity createSpareAccessoryPart(@RequestBody SpareAccessoryPart part, @AuthenticationPrincipal String email) {
        SpareAccessoryPart newSPA = database.saveSpareAccessoryPart(part);
        if(newSPA != null){
            User user = database.getUserByEmail(email);
            if(user == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("you're not a spareAccessoryDealer");
            SpareAccessoryDealer spa = (SpareAccessoryDealer) user;
            spa.addSpareAccessoryPart(newSPA);
            database.saveUser(spa);
            return ResponseEntity.ok("spare accessory part created");
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("couldn't create spare accessory part");
        }
    }

    @PostMapping("/update")
    public ResponseEntity updateSpareAccessoryPart(@RequestBody SpareAccessoryPart updatedPart) {
        SpareAccessoryPart updatedSpareAccessoryPart = database.saveSpareAccessoryPart(updatedPart);
        if(updatedSpareAccessoryPart != null){
            return ResponseEntity.ok("spare accessory part updated");
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("couldn't update spare accessory part");
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity deleteSpareAccessoryPart(@PathVariable Long id) {
        if(database.deleteSpareAccessoryPartById(id)){
            return ResponseEntity.ok("spare accessory part deleted");
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("spare accessory part not found");
        }
    }

    @PostMapping("/reserve/{id}")
    public ResponseEntity reserveAccessoryPart(@PathVariable Long id, @AuthenticationPrincipal String email) {
        User user = database.getUserByEmail(email);
        if(user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not find user");
        switch (user){
            case Client client -> {
                SpareAccessoryPart spa = database.getSpareAccessoryPartById(id);
                if(spa == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no such spare accessory part");
                client.addSpareAccessoryPart(spa);
                if(database.saveUser(client)) return ResponseEntity.ok(spa);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("couldn't add user");
            }
            default -> {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("you are not a client");
            }
        }
    }

}
