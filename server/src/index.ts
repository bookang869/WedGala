import express, { Express } from "express";
import { addGuest, saveGuestInfo, listGuests, getGuestInfo } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/add", addGuest);
app.post("/api/save", saveGuestInfo);
app.get("/api/get", getGuestInfo);
app.get("/api/list", listGuests);
app.listen(port, () => console.log(`Server listening on ${port}`));
