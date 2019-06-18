create-rifididb-volume:
	docker volume create rifididb-volume

build-rifididb:
	docker build \
		-f database.dockerfile \
		-t rifidi/database .

stop-rifididb:
	docker stop -f rifididb || exit 0
	docker rm -f rifididb || exit 0

run-rifididb: stop-rifididb create-rifididb-volume
	docker run \
		--name rifididb \
		-v rifididb-volume:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD=root \
		-e MYSQL_DATABASE=rifidi \
		-e MYSQL_USER=rifidiuser \
		-e MYSQL_PASSWORD=rifidipass \
		-p 3306:3306 \
		-d rifidi/database

run-rifididb-it: stop-rifididb create-rifididb-volume
	docker run \
		--name rifididb \
		-v rifididb-volume:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD=root \
		-e MYSQL_DATABASE=rifidi \
		-e MYSQL_USER=rifidiuser \
		-e MYSQL_PASSWORD=rifidipass \
		-p 3306:3306 \
		-it rifidi/database

# CREATE TABLE `tag` (
# 	`id` VARCHAR(255) NOT NULL,
# 	`is_product` BOOLEAN,
# 	`value` FLOAT,
# 	PRIMARY KEY (`id`)
# ) ENGINE=InnoDB;