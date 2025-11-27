FROM postgis/postgis:16-3.4-alpine

# Set environment variables
ENV POSTGRES_DB=barry_db
ENV POSTGRES_USER=barry_user
ENV POSTGRES_PASSWORD=barry_password

# Copy initialization scripts
COPY ./apps/db/init /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
