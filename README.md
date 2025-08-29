This is a simple and interesting app, implementing a multi-shot prompting, using React.js, Node.js, OpenAI API, and LLM.
About LLM, in the client\App.js file, it's possible change the LLM: Ollama or ChatGPT. Ollama code is for Ollama off-line version 
(installed version). For ChatGPT, you must have an account on OpenAI and generate a key. You should set the key in the "\server\.env" file.

The server works like a proxy, to protect the OpenAI key. The client module (App.js) calls the server, to send a message to LLM.

1. To run client

Open the prompt, get into the "\client" directory, and type: npm start.

2. To run server

Open the prompt, get into the "\server" directory, and type: node server.js.
