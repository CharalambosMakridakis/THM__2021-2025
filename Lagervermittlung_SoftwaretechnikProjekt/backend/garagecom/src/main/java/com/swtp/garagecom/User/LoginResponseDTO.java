package com.swtp.garagecom.User;

public class LoginResponseDTO {
    private String token;
    private String firstName;
    private String lastName;
    private int userType;

    public LoginResponseDTO(String token, String firstName, String lastName, int type) {
        this.token = token;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = type;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int type) {
        this.userType = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}