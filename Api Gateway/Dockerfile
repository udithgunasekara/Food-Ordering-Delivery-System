# FROM openjdk:17
# EXPOSE 1010
# ADD target/api-gateway-service.jar api-gateway-service.jar
# ENTRYPOINT ["java", "-jar", "/api-gateway-service.jar"]# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy Maven files first to cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/target/api-gateway-service.jar api-gateway-service.jar

# Expose the port via environment variable
EXPOSE ${SERVER_PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "api-gateway-service.jar"]