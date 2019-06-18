var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	// user: 'rifidiuser',
	// password: 'rifidipass',
	user: 'root',
	password: 'root',
	database: 'rifidi'
});

module.exports = {
	insert: (id, is_product, value) => {

		// # 	`id` VARCHAR(255) NOT NULL,
		// # 	`is_product` BOOLEAN,
		// # 	`value` FLOAT,

		return new Promise((resolve, reject) => {
			connection.connect((err) => {

				let query = 'INSERT INTO tag (id, is_product, value) VALUES ('; 
				query += '"' + id + '", ';
				query += ((is_product)?'TRUE':'FALSE') + ', '; 
				query += value + ')';

				console.log(query);

				connection.query(query, function (error, results) {
					// connection.end();
					if (error) { reject(error); }
					else { resolve(results); }
				});

			});

		});
	},
	update: (id, is_product, value) => {

		// # 	`id` VARCHAR(255) NOT NULL,
		// # 	`is_product` BOOLEAN,
		// # 	`value` FLOAT,

		return new Promise((resolve, reject) => {
			connection.connect((err) => {

				let query = 'UPDATE tag SET';
				query += ' is_product = ' + ((is_product)?'TRUE':'FALSE') + ', '; 
				query += ' value = ' + value; 
				query += ' WHERE id = "' + id + '"';

				console.log(query);

				connection.query(query, function (error, results) {
					// connection.end();
					if (error) { reject(error); }
					else { resolve(results); }
				});

			});

		});
	},
	remove: (id) => {

		// # 	`id` VARCHAR(255) NOT NULL,
		// # 	`is_product` BOOLEAN,
		// # 	`value` FLOAT,

		return new Promise((resolve, reject) => {
			connection.connect((err) => {

				let query = 'DELETE FROM tag ';
				query += ' WHERE id = "' + id + '"';

				console.log(query);

				connection.query(query, function (error, results) {
					// connection.end();
					if (error) { reject(error); }
					else { resolve(results); }
				});

			});

		});
	},
	list: () => {

		return new Promise((resolve, reject) => {
			connection.connect((err) => {

				connection.query('SELECT * from tag', function (error, results) {
					// connection.end();
					if (error) { reject(error); }
					else { resolve(results || []); }
				});

			});

		});

	},
};