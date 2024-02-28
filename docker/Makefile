#!make
TAG                         := $$(git log -1 --pretty=format:%h)
PROJECT_NAME                := devcamp-example-backend
BASENAME_SEVER              := ${PROJECT_NAME}-server
BASENAME_PROXY              := ${PROJECT_NAME}-nginx
NAME_SERVER                 := ${BASENAME_SEVER}-$$env
NAME_PROXY                  := ${BASENAME_PROXY}-$$env
IMG_COMMIT_SERVER     		:= ${NAME_SERVER}:${TAG}
IMG_LATEST_SERVER     		:= ${NAME_SERVER}:latest
IMG_COMMIT_PROXY      		:= ${NAME_PROXY}:${TAG}
IMG_LATEST_PROXY      		:= ${NAME_PROXY}:latest

build:
	@docker build -f _proxy.Dockerfile --build-arg ENV=$$env -t ${IMG_COMMIT_PROXY} .;
	@docker build -f _server.Dockerfile --build-arg ENV=$$env -t ${IMG_COMMIT_SERVER} ../;
	@docker tag ${IMG_COMMIT_SERVER} ${IMG_LATEST_SERVER};
	@docker tag ${IMG_COMMIT_PROXY} ${IMG_LATEST_PROXY};

run:
	@echo $$env;
	@sh run.sh $$env

network:
	@sh create-network.sh

kill:
	@echo 'Killing container...'
	@docker-compose -f docker-compose-$$env.yaml -p ${PROJECT_NAME}-server-$$env down

delete:
	# none 삭제
	@if [ -n "$$(docker images -f "dangling=true" -q)" ]; then \
		docker rmi -f $$(docker images -f "dangling=true" -q); \
	else \
		echo "No dangling images to remove."; \
	fi

	# 관련 이미지 삭제
	@if [ -n "$$(docker images --format \"{{.Repository}}:{{.Tag}}\" | grep '$(PROJECT_NAME)')" ]; then \
		docker rmi -f $$(docker images --format "{{.Repository}}:{{.Tag}}" | grep '$(PROJECT_NAME)'); \
	else \
		echo "No '$(PROJECT_NAME)' images to remove."; \
	fi


