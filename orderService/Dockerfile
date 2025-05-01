FROM openjdk:21
EXPOSE 2501
ADD target/order-service.jar order-service.jar
ENTRYPOINT ["java", "-jar", "/order-service.jar"]