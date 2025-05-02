#FROM openjdk:21
#EXPOSE 2501
#ADD target/order-service.jar order-service.jar
#ENTRYPOINT ["java", "-jar", "/order-service.jar"]

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
COPY --from=builder /app/target/order-service.jar order-service.jar

# Expose the port (set via environment variable or use default)
EXPOSE ${SERVER_PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "order-service.jar"]
