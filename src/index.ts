import app  from './app'

import MongoDBService from './core/services/mongodb.service';


(async () => {
    const connectionResult = await MongoDBService.connect();
    if(!connectionResult) {
        console.error("Db connection failed exiting...");
        process.exit(1);
    }
})();


// start app
const PORT = parseInt(process.env.PORT as string) as number
const IP = process.env.IP as string

const server = app.listen(PORT,
    () => console.info(`App started on http://${IP}:${PORT}`)
);

