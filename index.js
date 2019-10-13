var db = require('./database');
var api = require('./api');

startup();

async function startup() {
    var isDatabaseCreated = await db.createDatabase();
    if (isDatabaseCreated == false) {
        // Do nothing, proceed to migration step.
    }

    var isDatabaseMigrated = await db.migrateDatabase();
    if (isDatabaseMigrated == false) {
        console.log('Unable to proceed, database not migrated.');
        return; 
    }

    var isConnectedToDB = await db.connectToDatabase();
    if (isConnectedToDB == false) {
        console.log('Unable to proceed, connection to database failed.');
        return; 
    }

    await api.startAPI();
}
