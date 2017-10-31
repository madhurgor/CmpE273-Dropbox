Open two terminals and follow the steps on the terminals to start the servers:

Back-end server
	1. cd node1
	2. npm install
	3. npm start

Front-end server
	1. cd react1
	2. npm install
	3. npm start

--> Upload folder needs to be created in Main Directory if it does not exist, without this folder application will not work..
--> Exported database is stored in "exported dropbox_sql" file
--> You need to provide your username and password in users.js module in 'share', 'shareG', 'shareO' and 'shareS' routes. After doing this, you need to goto "https://myaccount.google.com/lesssecureapps" page to allow less secure app to access your gmail credentials.
