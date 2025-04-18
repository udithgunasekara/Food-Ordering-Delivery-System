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
                        .uri("lb://RESTAURANT-SERVICE"))

//               This is sample code for do the routes
//                .route("restaurant-category", r -> r.path("/category/**")
//                        .uri("lb://RESTAURANT-SERVICE"))

                .build();
    }
}
