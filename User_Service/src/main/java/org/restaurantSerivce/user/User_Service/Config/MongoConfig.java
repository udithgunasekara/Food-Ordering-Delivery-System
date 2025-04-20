package org.restaurantSerivce.user.User_Service.Config;
//this is a configuration class for mongo db auditing
//when a entity added @CreatedDate @UpdatedDate this config file will be responsible for
//mongo db to enable this feature internally

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {


}
