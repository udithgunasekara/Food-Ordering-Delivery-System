package org.delivery_application.apigateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                .route("restaurant-menu", r -> r.path("/menu/**")
                        .uri("lb://restaurant-service"))

//               This is sample code for do the routes
//                .route("restaurant-category", r -> r.path("/category/**")
//                        .uri("lb://RESTAURANT-SERVICE"))

                .route("admin-service", r -> r.path("/api/admin/**")
                        .uri("lb://ADMIN-SERVICE"))
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://user-service"))

                .route("notification-service", r -> r.path("/api/notifications/**")
                        .uri("lb://notification-service"))
                .route("payment-service", r -> r.path("/api/payments/**")
                        .uri("lb://payment-service"))

                .route("order-service", r -> r.path("/api/order/**")
                        .uri("lb://order-service"))
                .route("delivery-service", r -> r.path("/api/delivery/**")
                        .uri("lb://delivery-service"))

                .build();
    }
}
