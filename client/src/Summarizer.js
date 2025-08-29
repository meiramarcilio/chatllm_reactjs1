import React, {useRef, useEffect, useState} from 'react';

async function getTextFromPage(webPageURL) {
    try{
        const res = await fetch('http://localhost:5000/api/gettextfrompage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: webPageURL })
        });
        // Get API data response:
        const data = await res.json();
        return data.content; // get parameter content in JSON response
    } catch (error) {
        console.error('Error calling Back-end:', error);
    }
}

async function insertEntry(text, [entries, setEntries]){
    // Display user typed message:
    setEntries((prev) => [...prev, [`URL: ${text}`, 'userMsg']]);
    try {
        const pageContent = await getTextFromPage(text);

        const system_prompt = "You are an assistant that analyzes the contents of a website \
            and provides a short summary, ignoring text that might be navigation related. \
            Respond in markdown.";

        const res = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_prompt: pageContent, system_prompt: system_prompt })
        });
        const data = await res.json();
        // Retrieve AI response:
        //const response = data.choices[0].message.content; // for ChatGPT use
        const response = data; //For Ollama use
        // Print on UI client:
        setEntries((prev) => [...prev, [response, 'AIMsg']]);
    } catch (error) {
        console.error('Error calling Back-end:', error);
    }
    finally{
        // nothing
    }
}

function Chat() {
  const [entries, setEntries] = useState([]);
 
  const handleNewEntry = async (text) => {
    if (text.trim() !== '') {
      insertEntry(text, [entries, setEntries]);
    }
  };

  return (
      <div className="App">
        <main className="Chat-main">
          <Main entries={entries} />
        </main>
        <footer className="Chat-footer">
          <Footer onSubmit={handleNewEntry} />
        </footer>
      </div>
  );
}

function Main({ entries }){
  return (
    <div class="messages">
      {
        entries.map((entry, index) => (
          <div key={index} class={entry[1]}>
            {entry[0]}
          </div>
        ))
      }
    </div>
  );
}

function Footer({ onSubmit }){
    const txtUserMessage = useRef(null);
    const [text, setText] = useState('');

    useEffect(() => {
        txtUserMessage.current?.focus(); // Focus the input when component mounts
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline
            onSubmit(text, 'userMsg'); // Call
            setText(''); // Clear input content
            txtUserMessage.current?.focus(); // Focus the input again
        }
    }

    const handleClick = () => {
        onSubmit(text, 'userMsg'); // Call
        setText(''); // Clear text input content
        txtUserMessage.current?.focus(); // Focus the text input
    }
    return (
        <div>
            <input
                type="text" 
                ref={txtUserMessage} 
                value={text}
                onKeyDown={handleKeyDown}
                onChange={(e) => setText(e.target.value)}
                maxLength="200px"
                placeholder="Type the website URL and press Enter"
            />
            <button onClick={handleClick}>Send</button>
        </div>
    );
}
export default Chat;