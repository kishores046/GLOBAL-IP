# ---------- Build stage ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source
COPY src ./src

# Build
RUN mvn clean package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy built jar
COPY --from=builder /app/target/*.jar app.jar

# Render provides PORT
EXPOSE 8080

ENTRYPOINT ["java", "-Xmx450m", "-Xms256m", "-XX:+UseSerialGC", "-jar", "app.jar"]
