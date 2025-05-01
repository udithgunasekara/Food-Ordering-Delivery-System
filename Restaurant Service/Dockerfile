# FROM openjdk:17
# EXPOSE 2001
# ADD target/restaurant-service-rest.jar restaurant-service-rest.jar
# ENTRYPOINT ["java", "-jar", "/restaurant-service-rest.jar"]
# Build stage
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
COPY --from=builder /app/target/restaurant-service-rest.jar restaurant-service-rest.jar

# Expose the port via environment variable
EXPOSE ${SERVER_PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "restaurant-service-rest.jar"]