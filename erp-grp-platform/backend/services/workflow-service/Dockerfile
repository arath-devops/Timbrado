# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace
COPY backend /workspace/backend
WORKDIR /workspace/backend
RUN ./mvnw -q -pl services/workflow-service -am -DskipTests package || mvn -q -pl services/workflow-service -am -DskipTests package

FROM eclipse-temurin:21-jre-jammy
RUN useradd -r -u 10001 appuser
WORKDIR /app
COPY --from=build /workspace/backend/services/workflow-service/target/workflow-service-*.jar /app/app.jar
USER appuser
EXPOSE 8084
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75.0","-jar","/app/app.jar"]
