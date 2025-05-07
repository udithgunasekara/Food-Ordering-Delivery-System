package org.delivery_application.apigateway;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final String message = "Hello from getter!";

    public String getMessage() {
        System.out.println("Getter was called: " + message);
        return message;
    }

    @GetMapping("/test")
    public String testGetter() {
        return getMessage();
    }
}

