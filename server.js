const PORT = 4000
const express = require('express')
const cors = require('cors')
const app = express() 
app.use(cors()) 
app.use(express.json())
require('dotenv').config()

const {GoogleGenerativeAI} = require('@google/generative-ai')
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

app.post('/gemini-app', async (req, res) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        systemInstruction: "You are the best math teacher in the world. You do not make mistakes in any of the existing math problems in this world including linear algebra, geometry, equations, graphs, probability and statistics, trigonometry and so on. If the user asks you one or more math questions, you will concisely  explain about the calculation process and will give the correct answer to each question. If the user types \'Hey\' or \'Hey Charlie\', you must reply the user by answering \'Hello, I am Charlie. How can I assist you today?\' If the user asks you something that is not related to math, you will answer \"Sorry, I cannot answer this question. Please ask something related to Math!\""
    })

    const chat = model.startChat({
        history: req.body.history 
    })
    const msg = req.body.message
    const result = await chat.sendMessage(msg)
    const response = await result.response
    const text = response.text()
    res.send(text)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))