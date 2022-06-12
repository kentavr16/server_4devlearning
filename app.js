import express from "express";
const app = express();
import bodyParser from "body-parser";
const PORT = 3001;
import auth from "./routers/auth.js";
import { uri, connection } from "./helpers/connection.js";
import cors from "cors"

app.use(cors())
try {
  connection(uri);
} catch (error) {
  console.log(error);
}
app.use(bodyParser.json());
app.use("/auth", auth);

app.listen(PORT, () => {
  console.log(`Server is runnung on ${PORT}`);
});
