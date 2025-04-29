package org.restaurantSerivce.admin.Admin_Service.Config;

import feign.RequestInterceptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.restaurantSerivce.admin.Admin_Service.Security.InternalTokenGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Log4j2
@Configuration
@RequiredArgsConstructor
public class FeignConfig {

    private final InternalTokenGenerator internalTokenGenerator;

    @Bean
    public RequestInterceptor internalTokenInterceptor () {
        log.info("Init internal token interceptor");
        return requestTemplate -> {
            String token = internalTokenGenerator.getInternalToken();
            requestTemplate.header("Authorization", "Bearer " + token);
        };
    }
}
