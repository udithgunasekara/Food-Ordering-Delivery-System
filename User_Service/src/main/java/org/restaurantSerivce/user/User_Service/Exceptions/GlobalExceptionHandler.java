package org.restaurantSerivce.user.User_Service.Exceptions;

import com.mongodb.DuplicateKeyException;
import lombok.extern.log4j.Log4j2;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Log4j2
@ControllerAdvice
public class GlobalExceptionHandler {

    private final WebRequest webRequest;

    public GlobalExceptionHandler(WebRequest webRequest) {
        this.webRequest = webRequest;
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ErrorDetails> handleDuplicateKeyException(DuplicateKeyException e, WebRequest request) {
        String message = "Attempted registration with existing email.";
        LoggerFactory.getLogger(GlobalExceptionHandler.class).warn(message);
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                e.getMessage(),
                webRequest.getDescription(false),
                message
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<ErrorDetails> handleResourceAlreadyExists(ResourceAlreadyExistException ex, WebRequest webrequest) {
        ErrorDetails errordetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                webrequest.getDescription(false),
                "Resource already exist"
        );
        return new ResponseEntity<>(errordetails, HttpStatus.CONFLICT);
    }
}
