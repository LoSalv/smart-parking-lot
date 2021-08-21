USERNAME = lordebasta
PROJECT_NAME = smart-parking-lot
IMAGE_NAME = $(USERNAME)/$(PROJECT_NAME)
PORT = 8124

build:
		docker build -t $(IMAGE_NAME) .

buildnrun: build
		docker run -d -p 8124:8124 $(IMAGE_NAME) 

rm_all: 
		docker rm $$(docker ps -a -q)

stop_all: 
		docker stop $$(docker ps -a -q)

rm_active_all: stop_all rm_all

redeploy: rm_active_all buildnrun