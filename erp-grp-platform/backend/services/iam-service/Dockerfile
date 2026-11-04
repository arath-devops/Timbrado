FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace
COPY ../../pom.xml /workspace/pom.xml
COPY ../../libs /workspace/libs
COPY . /workspace/services/iam-service
RUN apk add --no-cache maven && mvn -f /workspace/pom.xml -pl services/iam-service -am -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/services/iam-service/target/iam-service-*.jar app.jar
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75"
EXPOSE 8081
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
