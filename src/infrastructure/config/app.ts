import express from 'express'
import http from 'http'
import userRoute from '../router/userRoute'

console.log(`Inside config/app`);
const app = express()

const httpServer = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(userRoute)
export {httpServer}