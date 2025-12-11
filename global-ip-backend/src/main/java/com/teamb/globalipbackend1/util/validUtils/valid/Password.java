package com.teamb.globalipbackend1.util.validUtils.valid;


import com.teamb.globalipbackend1.util.validUtils.validators.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Password {
    String message() default  "Invalid Credentials";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
