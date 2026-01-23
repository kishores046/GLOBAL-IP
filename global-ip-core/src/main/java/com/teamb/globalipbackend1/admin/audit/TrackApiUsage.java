package com.teamb.globalipbackend1.admin.audit;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TrackApiUsage {

    /** EPO, USPTO, TM, TRENDS */
    String service();


    /**
     * Optional.
     * If empty → derived from request (URL / method name)
     */
    String action();
}
