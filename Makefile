image_name = foxlog
pwd = $(shell pwd)

all: run

clean:
	sudo docker container prune -f

build: clean
	sudo docker build \
		--tag=$(image_name) \
		.

run: build
	sudo docker run \
		--rm \
		-it \
		$(image_name) "/var/log/access.log" "2.01" "true"
