package com.teamb.globalipbackend1.exception;



public class AccountBlockedException extends RuntimeException {
    public AccountBlockedException(String message) {
        super(message);
    }
}