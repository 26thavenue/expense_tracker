import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import loggerMiddleware from '../middlewares/loggerMiddleware'


dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())

app.use(loggerMiddleware);

app.use(morgan('tiny'))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
