// config/database.js
let db_password = process.env.MONGODB_PASSWORD

module.exports = {


    'url' : `mongodb+srv://mekibet:${db_password}@nameofmedia.qmtku.mongodb.net/movieApp?retryWrites=true&w=majority`, 
    'dbName': 'movieApp'
};