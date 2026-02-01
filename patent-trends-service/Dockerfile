# ---------- Build stage ----------
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /build

# Copy only what is needed for dependency resolution first
COPY pom.xml .
RUN apt-get update && apt-get install -y maven \
    && mvn -B -q dependency:go-offline

# Now copy source
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy jar from build stage
COPY --from=builder /build/target/*.jar app.jar

# Render injects PORT automatically
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
