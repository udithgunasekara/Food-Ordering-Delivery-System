#FROM openjdk:21
#EXPOSE 2500
#ADD target/delivery-service.jar delivery-service.jar
#ENTRYPOINT ["java", "-jar", "/delivery-service.jar"]

# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app


# Copy Maven files and source code
COPY pom.xml ./
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built .jar from the builder stage
COPY --from=builder /app/target/delivery-service.jar delivery-service.jar

# Expose the port (set via environment variable or default to 2500)
EXPOSE ${SERVER_PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "delivery-service.jar"]
