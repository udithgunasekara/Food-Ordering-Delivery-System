package org.restaurantSerivce.user.User_Service.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException{
    private String resourceName;
    private String fieldName;
    private String fieldValue;

    public ResourceNotFoundException(String resourcename, String fieldname, String fieldvalue) {
        super(String.format("Resource '%s' not found with %s : %s", resourcename, fieldname,fieldvalue));
        this.resourceName = resourcename;
        this.fieldName = fieldname;
        this.fieldValue = fieldvalue;
    }

    public ResourceNotFoundException(String resourcename, String fieldname) {
        super(String.format("Resource '%s' not found with %s", resourcename, fieldname));
        this.resourceName = resourcename;
        this.fieldName = fieldname;
    }
}
