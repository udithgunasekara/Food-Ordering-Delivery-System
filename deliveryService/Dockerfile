FROM openjdk:21
EXPOSE 2500
ADD target/delivery-service.jar delivery-service.jar
ENTRYPOINT ["java", "-jar", "/delivery-service.jar"]