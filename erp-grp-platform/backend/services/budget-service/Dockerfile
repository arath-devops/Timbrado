# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace
COPY backend /workspace/backend
WORKDIR /workspace/backend
RUN ./mvnw -q -pl services/budget-service -am -DskipTests package || mvn -q -pl services/budget-service -am -DskipTests package

FROM eclipse-temurin:21-jre-jammy
RUN useradd -r -u 10001 appuser
WORKDIR /app
COPY --from=build /workspace/backend/services/budget-service/target/budget-service-*.jar /app/app.jar
USER appuser
EXPOSE 8087
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-jar","/app/app.jar"]
