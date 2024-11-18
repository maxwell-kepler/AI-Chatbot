const db = require("../config/database");
jest.setTimeout(10000);

let isDBClosed = false;

afterAll(async () => {
    if (!isDBClosed) {
        await db.end();
        isDBClosed = true;
    }
});