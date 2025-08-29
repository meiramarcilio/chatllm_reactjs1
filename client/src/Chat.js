import React, {useRef, useEffect, useState} from 'react';

async function insertEntry(text, [entries, setEntries]){
  // Display user typed message:
  setEntries((prev) => [...prev, [text, 'userMsg']]);
  try {
      const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_prompt: text })
    });
    const data = await res.json();
    // Retrieve AI message sent back:
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
      //console.log('Typed text: ' + text);
      onSubmit(text, 'userMsg'); // Call
      setText(''); // Clear textarea content
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
      <textarea 
        ref={txtUserMessage} 
        value={text}
        onKeyDown={handleKeyDown}
        onChange={(e) => setText(e.target.value)}
        maxLength="200px"
        placeholder="Ask me something, and press Enter"
         />
        <button onClick={handleClick}>Send</button>
    </div>
  );
}
export default Chat;