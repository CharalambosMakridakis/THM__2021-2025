package com.swtp.garagecom.Service;

import com.swtp.garagecom.DatabaseUtil.Database;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final Database database;

    @Autowired
    public ServiceController(
            Database database
    ){
        this.database = database;
    }

    @GetMapping()
    public List<ServiceEntity> getAllServices() {
        return database.getAllServices();
    }

    @GetMapping("/{id}")
    public ResponseEntity getServiceById(@PathVariable Long id) {
        ServiceEntity service = database.getServiceById(id);
        if (service != null) {
            return ResponseEntity.ok(service);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("no service found");
        }
    }

    @PostMapping("/create")
    public ResponseEntity createService(@RequestBody ServiceEntity service) {
        ServiceEntity newService = database.saveService(service);
        if(newService != null) {
            return ResponseEntity.ok(newService);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not create service");
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateService(@RequestBody ServiceEntity updatedService) {
        if (database.updateService(updatedService)) {
            return ResponseEntity.ok(updatedService);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not update service");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteService(@PathVariable Long id) {
        if(database.deleteService(id)) {
            return ResponseEntity.ok(id);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("could not delete service");
        }
    }
}
