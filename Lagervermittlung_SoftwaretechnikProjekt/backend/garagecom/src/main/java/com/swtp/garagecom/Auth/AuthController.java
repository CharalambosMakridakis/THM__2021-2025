package com.swtp.garagecom.Auth;

import com.swtp.garagecom.DatabaseUtil.Database;
import com.swtp.garagecom.User.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin
@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final Database database;


    private final JwtUtil jwtUtil;
    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            CustomUserDetailsService customUserDetailsService,
            Database database
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
        this.database = database;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO loginReq)  {
        try {

            //------------------------------DONT TOUCH ----------------------------------------------
            Authentication authentication =
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginReq.getEmail(), loginReq.getPassword()));
            String email = authentication.getName();
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
            //------------------------------DONT TOUCH END----------------------------------------------
            if(userDetails.getPassword().equals(loginReq.getPassword())){
                User user = database.getUserByEmail(loginReq.getEmail());
                String token = jwtUtil.createToken(user);
                int userTypeID = switch (user) {
                    case Client c -> 1;
                    case SpareAccessoryDealer sad -> 2;
                    case StorageOwner so -> 3;
                    case WorkshopOwner wo -> 4;
                    default -> 0;
                };


                if(userTypeID == 0) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("");

                return ResponseEntity.ok(new LoginResponseDTO(
                        token,
                        user.getFirstName(),
                        user.getLastName(),
                        userTypeID
                ));
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password not matching");
            }

        }catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
        }catch (Exception e){
            System.out.println("IT CRACKS!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO registerReq)  {
        if(database.checkUserExists(registerReq.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists");
        }
        try{
            User user = switch (registerReq.getUserType()){

                //Client
                case 1 -> new Client(
                            registerReq.getEmail(),
                            registerReq.getPassword(),
                            registerReq.getFirstName(),
                            registerReq.getLastName(),
                            registerReq.getPhoneNumber(),
                            registerReq.getAddress(),
                            registerReq.getDateOfBirth());

                //SpareAccessoryDealer
                case 2 -> new SpareAccessoryDealer(
                            registerReq.getEmail(),
                            registerReq.getPassword(),
                            registerReq.getFirstName(),
                            registerReq.getLastName(),
                            registerReq.getPhoneNumber(),
                            registerReq.getAddress(),
                            registerReq.getDateOfBirth());

                //StorageOwner
                case 3 -> new StorageOwner(
                            registerReq.getEmail(),
                            registerReq.getPassword(),
                            registerReq.getFirstName(),
                            registerReq.getLastName(),
                            registerReq.getPhoneNumber(),
                            registerReq.getAddress(),
                            registerReq.getDateOfBirth());

                //WorkshopOwner
                case 4 -> new WorkshopOwner(
                            registerReq.getEmail(),
                            registerReq.getPassword(),
                            registerReq.getFirstName(),
                            registerReq.getLastName(),
                            registerReq.getPhoneNumber(),
                            registerReq.getAddress(),
                            registerReq.getDateOfBirth());

                //es kracht eng.: it cracks
                default -> null;
            };
            //if not 0 < type < 5 -> BadRequest
            if(user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
            //save User
            if(database.saveUser(user)) {
                return ResponseEntity.ok(new RegisterResponseDTO(true, "account created"));
            }
            //else -> badrRequest
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not create account");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("could not create account");
        }
    }


}
