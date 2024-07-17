package com.swtp.garagecom.User;

import com.sun.net.httpserver.Authenticator;

public class RegisterResponseDTO {
    private boolean success;
    private String message;

    public RegisterResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean getSuccess() {
        return this. success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
