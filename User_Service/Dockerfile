FROM openjdk:21
EXPOSE 2005
ADD target/user_service.jar user_service.jar
ENTRYPOINT ["java", "-jar", "/user_service.jar"]