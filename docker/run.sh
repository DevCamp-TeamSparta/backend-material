docker-compose -f $PWD/docker-compose-$1.yaml -p devcamp-example-backend-server-$1 down
docker-compose -f $PWD/docker-compose-$1.yaml -p devcamp-example-backend-server-$1 up -d
docker logs -f devcamp-example-backend-server-$1