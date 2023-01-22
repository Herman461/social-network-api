import pgp from 'pg-promise'

const initOptions = {
    error: function (error, e) {
        if (e.cn) {

            console.log("CN:", e.cn);
            console.log("EVENT:", error.message);

        }
    },
    connect(e) {
        const cp = e.client.connectionParameters;
        console.log('Connected to database:', cp.database);
    }
}
const pgpWithOptions = pgp(initOptions)

const database = pgpWithOptions('postgres://postgres:root@localhost:9000/vk_clone')

database.connect()
    .then(function (obj) {
        obj.done(); // success, release connection;
    })
    .catch(function (error) {
        console.log("ERROR:", error.message);
    });


export default database;
