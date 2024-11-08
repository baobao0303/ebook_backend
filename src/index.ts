import express, { response } from "express"

const app = express()

const port = process.env.PORT || 8080

// ROUTES
app.get("/",(req,res)=>{
    response.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})