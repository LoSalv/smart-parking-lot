USERNAME = lordebasta
PROJECT_NAME = smart-parking-lot
IMAGE_NAME = $(USERNAME)/$(PROJECT_NAME)

build:
		docker build -t $(IMAGE_NAME) .

reloadv: 
		docker compose down -v
		npm run build
		docker compose up

reload: 
		docker compose down
		npm run build
		docker compose up

clean:
		docker compose down -v
		docker stop $(docker ps -a -q)
		docker rm $(docker ps -a -q)
