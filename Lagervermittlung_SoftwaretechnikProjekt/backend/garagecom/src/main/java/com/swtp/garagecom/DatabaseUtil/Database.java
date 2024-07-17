package com.swtp.garagecom.DatabaseUtil;

import com.swtp.garagecom.Car.Car;
import com.swtp.garagecom.Car.CarController;
import com.swtp.garagecom.Car.CarRepository;
import com.swtp.garagecom.DateNegotiation.DateNegotiation;
import com.swtp.garagecom.Inquiry.Inquiry;
import com.swtp.garagecom.Inquiry.InquiryRepository;
import com.swtp.garagecom.Offer.Offer;
import com.swtp.garagecom.ParkingSpace.ParkingSpace;
import com.swtp.garagecom.ParkingSpace.ParkingSpaceRepository;
import com.swtp.garagecom.ReceiptReturnNegotiation.ReceiptReturnNegotiation;
import com.swtp.garagecom.Service.ServiceEntity;
import com.swtp.garagecom.Service.ServiceRepository;
import com.swtp.garagecom.SpareAccessoryPart.SpareAccessoryPart;
import com.swtp.garagecom.SpareAccessoryPart.SpareAccessoryPartRepository;
import com.swtp.garagecom.User.StorageOwner;
import com.swtp.garagecom.User.User;
import com.swtp.garagecom.User.UserRepository;
import com.swtp.garagecom.User.WorkshopOwner;
import com.swtp.garagecom.Work.Work;
import com.swtp.garagecom.Work.WorkRepository;
import com.swtp.garagecom.Workshop.Workshop;
import com.swtp.garagecom.Workshop.WorkshopRepository;
import com.swtp.garagecom.Warehouse.Warehouse;
import com.swtp.garagecom.Warehouse.WarehouseRepository;
import com.swtp.garagecom.WorkshopRequest.WorkshopRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class Database {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final SpareAccessoryPartRepository spareAccessoryPartRepository;
    private final WorkshopRepository workshopRepository ;
    private final WorkRepository workRepository;
    private final ServiceRepository serviceRepository;
    private final ParkingSpaceRepository parkingSpaceRepository;
    private final WarehouseRepository warehouseRepository;
    private final InquiryRepository inquiryRepository;

    public Database(
            UserRepository userRepository,
            CarRepository carRepository,
            SpareAccessoryPartRepository spareAccessoryPartRepository,
            WorkshopRepository workshopRepository,
            WorkRepository workRepository,
            ServiceRepository serviceRepository,
            ParkingSpaceRepository parkingSpaceRepository,
            WarehouseRepository warehouseRepository,
            InquiryRepository inquiryRepository){
      this.userRepository = userRepository;
      this.carRepository = carRepository;
      this.spareAccessoryPartRepository = spareAccessoryPartRepository;
      this.workshopRepository = workshopRepository;
      this.workRepository = workRepository;
      this.serviceRepository = serviceRepository;
      this.parkingSpaceRepository = parkingSpaceRepository;
      this.warehouseRepository = warehouseRepository;
      this.inquiryRepository = inquiryRepository;
    }

    public boolean checkUserExists(String email) {
        return userRepository.existsByEmail(email);
    }
    public User getUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }
    public boolean saveUser(User user) {
        try {
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean checkCarExists(Long carId) {
        return carRepository.existsById(carId);
    }

    public Car getCarById(Long carId) {
        if(carId == null) return null;
        return carRepository.findById(carId).orElse(null);
    }

    public boolean deleteCar(Long id) {
        Car car = carRepository.findById(id).orElse(null);
        if(car != null) {
            carRepository.delete(car);
            return true;
        }else{
            return false;
        }
    }

    public Car saveCar(Car car) {
        return carRepository.save(car);
    }

    public boolean updateCar(Car car) {
        Car updatedCar = carRepository.save(car);
        return updatedCar != null;
    }

    public SpareAccessoryPart getSpareAccessoryPartById(Long spareAccessoryPartId) {
        if(spareAccessoryPartId == null) return null;
        return spareAccessoryPartRepository.findById(spareAccessoryPartId).orElse(null);
    }

    public boolean deleteSpareAccessoryPartById(Long spareAccessoryPartId) {
        SpareAccessoryPart  spa = spareAccessoryPartRepository.findById(spareAccessoryPartId).orElse(null);
        if(spa != null) {
            spareAccessoryPartRepository.deleteById(spareAccessoryPartId);
            return true;
        }else{
            return false;
        }
    }

    public boolean checkSpareAccessoryPartExists(Long spareAccessoryPartId) {
        return spareAccessoryPartRepository.existsById(spareAccessoryPartId);
    }

    public SpareAccessoryPart saveSpareAccessoryPart(SpareAccessoryPart spareAccessoryPart) {
        return spareAccessoryPartRepository.save(spareAccessoryPart);
    }

    public List<SpareAccessoryPart> getAllSpareAccessoryParts() {
        return spareAccessoryPartRepository.findAll();
    }

    public List<Workshop> getWorkshops() {
        return workshopRepository.findAll();
    }

    public Workshop getWorkshopByID(Long id) {
        if(id == null) return null;
        return workshopRepository.findById(id).orElse(null);
    }

    public Workshop saveWorkshop(Workshop workshop) {
        return workshopRepository.save(workshop);
    }

    public Work getWorkByID(Long id) {
        if(id == null) return null;
        return workRepository.findById(id).orElse(null);
    }

    public List<Work> getWorks() {
        return workRepository.findAll();
    }

    public Work saveWork(Work work) {
        return workRepository.save(work);
    }

    public boolean deleteWorkByID(Long id) {

        Work work = workRepository.findById(id).orElse(null);
        if(work != null) {
            workRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Work updateWork(Work work) {
        return workRepository.save(work);
    }

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public ServiceEntity getServiceById(Long id) {
        if(id == null) return null;
        return serviceRepository.findById(id).orElse(null);
    }

    public ServiceEntity saveService(ServiceEntity service) { return serviceRepository.save(service); }

    public boolean updateService(ServiceEntity service) {
        ServiceEntity updatedService = serviceRepository.save(service);
        return updatedService != null;
    }

    public boolean deleteService(Long id) {
        ServiceEntity service = getServiceById(id);
        if(service != null) {
            serviceRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public List<ParkingSpace> getAllParkingSpaces() {
        return parkingSpaceRepository.findAll();
    }

    public ParkingSpace getParkingSpaceById(Long id) {
        if (id == null) return null;
        return parkingSpaceRepository.findById(id).orElse(null);
    }

    public ParkingSpace saveParkingSpace(ParkingSpace parkingSpace) { return parkingSpaceRepository.save(parkingSpace); }

    public boolean updateParkingSpace(ParkingSpace parkingSpace) {
        ParkingSpace updatedParkingSpace = parkingSpaceRepository.save(parkingSpace);
        return updatedParkingSpace != null;
    }

    public boolean deleteParkingSpace(Long id) {
        ParkingSpace parkingSpace = getParkingSpaceById(id);
        if(parkingSpace != null) {
            parkingSpaceRepository.delete(parkingSpace);
            return true;
        } else {
            return false;
        }
    }

    public List<SpareAccessoryPart> searchAccessoryParts(String model, String brand) {
        return getAllSpareAccessoryParts()
                .stream()
                .filter((part) -> part.getBrand().contains(brand) || part.getModel().contains(model))
                .toList();
    }

    //Alle Warehouse Methoden
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getWarehouseById(Long id) {
        if(id == null) return null;
        return warehouseRepository.findById(id).orElse(null);
    }

    public Warehouse saveWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public boolean updateWarehouse(Warehouse warehouse) {
        Warehouse updatedWarehouse = warehouseRepository.save(warehouse);
        return updatedWarehouse != null;
    }

    public boolean deleteWarehouse(Long id) {
        Warehouse warehouse = getWarehouseById(id);
        if(warehouse != null) {
            warehouseRepository.delete(warehouse);
            return true;
        } else {
            return false;
        }
    }

    public List<Long> getAllServiceIds(Long warehouseId) {
        Warehouse warehouse = getWarehouseById(warehouseId);
        if(warehouse != null) {
            return warehouse.getAllServiceId();
        } else {
            return null;
        }
    }

    public List<ServiceEntity> getAllServicesFromWarehouse(Long warehouseId) {
        if(warehouseId == null) return null;
        List<Long> serviceIds = getAllServiceIds(warehouseId);
        if(serviceIds != null) {
            return serviceRepository.findAllById(serviceIds);
        } else {
            return null;
        }
    }

    public boolean addServiceToWarehouse(Long serviceId , Long warehouseId) {
        Warehouse warehouse = getWarehouseById(warehouseId);
        if(warehouse != null) {
            ServiceEntity service = getServiceById(serviceId);
            if(service != null) {
                warehouse.addServiceId(serviceId);
                warehouseRepository.save(warehouse);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public boolean deleteServiceFromWarehouse(Long serviceId , Long warehouseId) {
        Warehouse warehouse = getWarehouseById(warehouseId);
        if(warehouse != null) {
            ServiceEntity service = getServiceById(serviceId);
            if(service != null) {
                warehouse.removeServiceId(serviceId);
                warehouseRepository.save(warehouse);
                return true;
            } else  {
                return false;
            }
        } else {
            return false;
        }
    }

    public List<Long> getAllParkingSpaceIds(Long warehouseId) {
        Warehouse warehouse = getWarehouseById(warehouseId);
        if(warehouseId != null) {
            return warehouse.getAllParkingSpaceID();
        } else {
            return null;
        }
    }

    public List<ParkingSpace> getAllParkingSpaces(Long warehouseId) {
        if(warehouseId == null) return null;
        List<Long> parkingSpaceIds = getAllParkingSpaceIds(warehouseId);
        if(parkingSpaceIds != null) {
            return parkingSpaceRepository.findAllById(parkingSpaceIds);
        } else {
            return null;
        }
    }

    public boolean addParkingSpaceToWarehouse(Long parkingSpaceId , Long warehouseId) {
        Warehouse warehouse = getWarehouseById(warehouseId);
        if(warehouse != null) {
            ParkingSpace parkingSpace = getParkingSpaceById(parkingSpaceId);
            if(parkingSpace != null) {
                warehouse.addParkingSpaceId(parkingSpaceId);
                warehouseRepository.save(warehouse);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public boolean deleteParkingSpaceFromWarehouse(Long parkingSpaceId , Long warehouseId) {
        Warehouse warehouse = getWarehouseById(warehouseId);
        if(warehouse != null) {
            ParkingSpace parkingSpace = getParkingSpaceById(parkingSpaceId);
            if(parkingSpace != null) {
                warehouse.removeParkingSpaceId(parkingSpaceId);
                warehouseRepository.save(warehouse);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public List<Warehouse> getWarehousesByIDs(List<Long> warehouseIDs) {
        return warehouseRepository.findAllById(warehouseIDs);
    }

    public List<Warehouse> searchWarehouses(String address, String brandSpecialization) {
        return getAllWarehouses()
                .stream()
                .filter((warehouse) -> warehouse.getAddress().contains(address) || warehouse.getBrandSpecialization().contains(brandSpecialization))
                .toList();
    }

    public Offer saveOffer(Offer offer) {
            return inquiryRepository.save(offer);
    }

    public Offer getOfferByID(Long offerId) {
        return switch (inquiryRepository.findById(offerId).orElse(null)){
            case Offer o -> o;
            default -> null;
        };
    }

    public List<Offer> getAllOffers() {
        return inquiryRepository
                .findAll()
                .stream()
                .filter(inquiry -> inquiry instanceof Offer)
                .map(inquiry -> (Offer) inquiry)
                .toList();
    }

    public List<WorkshopRequest> getAllWorkshopRequest() {
        return inquiryRepository
                .findAll()
                .stream()
                .filter(inquiry -> inquiry instanceof WorkshopRequest)
                .map(inquiry -> (WorkshopRequest) inquiry)
                .toList();
    }

    public WorkshopOwner getWorkshopOwnerFromWorkshop(Long workshopID) {
        Workshop workshop = workshopRepository.findById(workshopID).orElse(null);
        if(workshop == null) return null;
        List<WorkshopOwner> allWorkshopOwners = userRepository
                .findAll()
                .stream()
                .filter(user -> user instanceof WorkshopOwner)
                .map(wo -> (WorkshopOwner) wo)
                .toList();

        return allWorkshopOwners
                .stream()
                .filter(workshopOwner -> Objects.equals(workshopOwner.getWorkshopID(), workshopID))
                .findAny()
                .orElse(null);
    }

    public WorkshopRequest saveWorkshopRequest(WorkshopRequest wo) {
        return inquiryRepository.save(wo);
    }


    public WorkshopRequest getWorkshopRequestByID(Long workshopRequestId) {
        return switch (inquiryRepository.findById(workshopRequestId).orElse(null)){
            case WorkshopRequest wo -> wo;
            default -> null;
        };
    }

    public List<StorageOwner> getAllStorageOwners() {
        return userRepository
                .findAll()
                .stream()
                .filter(user -> user instanceof StorageOwner)
                .map(user -> (StorageOwner) user)
                .toList();
    }

    public StorageOwner getStorageOwnerFromWarehouseID(Long warehouseID){
        if(warehouseID == null) return null;
        return getAllStorageOwners()
                .stream()
                .filter(storageOwner -> storageOwner.getWarehouseIDs().contains(warehouseID))
                .findFirst()
                .orElse(null);
    }

    public ReceiptReturnNegotiation saveRRN(ReceiptReturnNegotiation returnNegotiation) {
        return inquiryRepository.save(returnNegotiation);
    }


    public Long getStorageOwnerByCar(Long carId) {
        List<Warehouse> warehouses = getAllWarehouses();
        StorageOwner storageOwner = null;
        Warehouse warehouseContainingCar = null;

        for(Warehouse warehouse : warehouses) {
            List<ParkingSpace> parkingSpaces = warehouse
                    .getAllParkingSpaceID()
                    .stream()
                    .map(this::getParkingSpaceById)
                    .toList();

            List<Car> carsInWh = parkingSpaces
                    .stream()
                    .map(ps -> getCarById(ps.getCarId()))
                    .toList();

            if (!carsInWh.stream().filter(c -> Objects.equals(c.getId(), carId)).toList().isEmpty()) {
                warehouseContainingCar = warehouse;
                break;
            }
        }

        if (warehouseContainingCar == null) {
            return null;
        }

        List<StorageOwner> storageOwners = getAllStorageOwners();
        for (StorageOwner owner : storageOwners) {
            if (owner.getWarehouseIDs().contains(warehouseContainingCar.getId())) {
                storageOwner = owner;
                break;
            }
        }

        if (storageOwner != null) {
            return storageOwner.getId();
        } else {
            return null;
        }
    }


    public StorageOwner getStorageOwnerById(Long storageOwnerID) {
        List<StorageOwner> storageOwners = getAllStorageOwners();
        for (StorageOwner storageOwner : storageOwners) {
            if (storageOwner.getId().equals(storageOwnerID)) {
                return storageOwner;
            }
        }
        return null;
    }

    public List<ReceiptReturnNegotiation> getAllRRNs() {
        return inquiryRepository
                .findAll()
                .stream()
                .filter(inquiry -> inquiry instanceof ReceiptReturnNegotiation)
                .map(inquiry -> (ReceiptReturnNegotiation) inquiry)
                .toList();
    }

    public ReceiptReturnNegotiation getRRNByID(Long rrnId) {
        if (rrnId == null) return null;
        return switch (inquiryRepository.findById(rrnId).orElse(null)){
            case ReceiptReturnNegotiation o -> o;
            default -> null;
        };
    }

    public DateNegotiation getDateNegotiationByID(Long dateNegotiationId) {
        return switch (inquiryRepository.findById(dateNegotiationId).orElse(null)){
            case DateNegotiation o -> o;
            default -> null;
        };
    }

    public DateNegotiation saveDateNegotiation(DateNegotiation dateNegotiation) {
        return inquiryRepository.save(dateNegotiation);
    }

    public boolean updateWorkshop(Workshop updatedWorkshop) {
        Workshop workshop = saveWorkshop(updatedWorkshop);
        if (workshop != null) return true;
        return false;
    }

    public boolean deleteWorkshop(Long id) {
        Workshop workshop = workshopRepository.findById(id).orElse(null);
        if (workshop != null) {
            workshopRepository.delete(workshop);
            return true;
        } else return false;
    }

    public List<Work> getWorkByIDs(List<Long> workIDs) {
        if(workIDs == null) return null;
        return workRepository.findAllById(workIDs);
    }
}
