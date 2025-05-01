# FROM openjdk:21
# EXPOSE 2006
# ADD target/admin_service.jar admin_service.jar
# ENTRYPOINT ["java", "-jar", "/admin_service.jar"]
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
COPY --from=builder /app/target/admin_service.jar admin_service.jar

# Expose the port (use 2006 to match the first Dockerfile, or set via environment)
EXPOSE ${SERVER_PORT}

# Run the application
ENTRYPOINT ["java", "-jar", "admin_service.jar"]