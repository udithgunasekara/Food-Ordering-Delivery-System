# FROM openjdk:21
# EXPOSE 2005
# ADD target/user_service.jar user_service.jar
# ENTRYPOINT ["java", "-jar", "/user_service.jar"]# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy Maven files first to cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/target/user_service.jar user_service.jar

# Expose the port via environment variable
EXPOSE ${SERVER_PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "user_service.jar"]