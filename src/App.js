import { useState } from 'react';

function App() {
  const [error, setError] = useState("")
  const [value, setValue] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOptions = [
    "Who is Pascal?",
    "What's the latest solved problem among 'The Seven Challenges'?",
    "How do you prove Euler's formula?"
  ]

  const surprise = () => {
    const randomValue  = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question.")
      return 
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        } 
      }
      const response = await fetch('http://localhost:4000/gemini-app', options) 
      const data = await response.text()
      
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
        {
          role: "model",
          parts: data 
        }
      ])
      setValue("")


    } catch (error) {
      console.error("error:", error)
      setError("Sonething went wrong. Please try again later.")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
      <div className="app">
          <p>What do you want to know?
              <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
          </p>
          <div className="input-container">
            <input
              value={value}
              placeholder="When is the International Congress of Mathematicians in 2024?"
              onChange={(e) => setValue(e.target.value)}
            />
            {!error && <button onClick={getResponse}>Ask me</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          <div className="search-result">
            {chatHistory.map((chatItem, _index) => <div key={_index}>
              <p className="answer">{chatItem.role} : {chatItem.parts}</p>
            </div>)}
          </div>
      </div>
  );
}

export default App;
