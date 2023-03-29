import express, { json } from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(cors());

app.listen(port, () => {
  console.log(chalk.green(`Server listening on port ${port}`));
});
