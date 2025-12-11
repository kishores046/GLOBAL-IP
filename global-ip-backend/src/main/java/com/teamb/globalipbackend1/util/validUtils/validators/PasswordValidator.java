package com.teamb.globalipbackend1.util.validUtils.validators;

import com.teamb.globalipbackend1.util.validUtils.valid.Password;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator <Password,String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value.matches("^(?=.*[A-Za-z])(?=.*\\d).{8,}$");
    }
}
