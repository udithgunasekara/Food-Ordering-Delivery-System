FROM openjdk:17
EXPOSE 8761
ADD target/service-registry-service.jar service-registry-service.jar
ENTRYPOINT ["java", "-jar", "/service-registry-service.jar"]