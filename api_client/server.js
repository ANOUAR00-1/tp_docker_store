import app from "./src/app.js"
import { AppDataSource } from "./src/config/data-source.js"
import dotenv from "dotenv"

dotenv.config()

AppDataSource.initialize()
    .then(() => {

        console.log("Database connected")

        app.listen(process.env.PORT, () => {
            console.log("Server running on port " + process.env.PORT)
        })
    })
    .catch((error) => console.log(error))
