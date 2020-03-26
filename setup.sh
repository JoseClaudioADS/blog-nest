docker run --name blog-db -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=blog -p 5432:5432 -d postgres
docker run --name blog-redis -p 6379:6379 -d -t redis:alpine
