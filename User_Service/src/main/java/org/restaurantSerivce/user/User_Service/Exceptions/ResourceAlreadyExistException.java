package org.restaurantSerivce.user.User_Service.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class ResourceAlreadyExistException extends RuntimeException{
    private String resourceName;
    private String value;

    public ResourceAlreadyExistException(String resourceName) {
        super(String.format("Resource '%s' already exists ", resourceName));
        this.resourceName = resourceName;
    }

    public ResourceAlreadyExistException(String resourceName, String value) {
        super(String.format("Resource '%s' already exists with value : %s", resourceName, value));
        this.resourceName = resourceName;
        this.value = value;
    }
}
