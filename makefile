USERNAME = lordebasta
PROJECT_NAME = smart-parking-lot
IMAGE_NAME = $(USERNAME)/$(PROJECT_NAME)
PORT = 8124

build:
		docker build -t $(IMAGE_NAME) .

reload: 
		docker compose down -v
		npm run build
		docker compose up

rm_all: 
		docker rm $$(docker ps -a -q)

stop_all: 
		docker stop $$(docker ps -a -q)

rm_active_all: stop_all rm_all

redeploy: rm_active_all buildnrun