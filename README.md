# Requirements
React.js:
1. Node.js (latest version)

Server :
1. Xampp (minimum version 7+, but under version 8)

# Running Application Steps

React.js:
1. make sure you have internet connection
2. open your terminal, then go to the project directory for example D://aitindobackendevelopertest
3. to install dependencies in the package.json file, run the command terminal "npm install"
4. if done, run "npm start" command. the application will running in localhost:3000
5. this application using local ip address to access the server, so you need to set the base url in the src/contanst/index.js. change base url to your local Ipv4, to see your local Ipv4 you can run in your terminal "ipconfig" 

Server:
1. open xampp control, run apache and mysql
2. open your browser, type localhost/phpmyadmin
3. create database "db_aitindo_1", then open in the project root folder you can find the database folder that containing the sql file.
4. you can import the database to phpmyadmin from the sql file
5. next, in the project root folder you can see there is server folder. go to inside server folder and paste the directoty AitindoAPI to the htdocs (by default, in C://xampp/htdocs)




