const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    // Test whether the message was received:
    if (!req.body.user_prompt) {
        return res.status(400).json({ error: 'Missing parameter' });
    }
    // Setting up promp for AI chat:
    prompt = [{role: "user", content: req.body.user_prompt}];
    if(req.body.system_prompt){
        prompt = [
            {role: "system", content: req.body.system_prompt},
            {role: "user", content: req.body.user_prompt}
        ];
    }
    // Sending message to OpenAI API:
    try {
        // *** Code for ChatGPT use ***
        // const MODEL_GPT = 'gpt-4o-mini';
        // const response = await axios.post('https://api.openai.com/v1/chat/completions', 
        //     {
        //         model: MODEL_GPT, // Specify the model
        //         messages: prompt,
        //     }, 
        //     {headers: {
        //         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Set OPENAI_API_KEY in the .env file
        //         'Content-Type': 'application/json'
        //     }
        // });
        // res.json(response.data);
        
        // *** Code for Ollama use ***
        const MODEL_LLAMA = 'llama3.2'; //check in prompt with: ollama list
        const response = await axios.post('http://localhost:11434/api/chat', 
            {
                model: MODEL_LLAMA,
                messages: prompt,
                stream: false
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data.message.content);
    } catch (error) {
        //console.error('Error calling OpenAI: ', error); // When using GPT model
        console.error('Error calling LLM: ', error);
        res.status(500).json({error: 'Something went wrong'});
    }
});

app.post('/api/gettextfrompage', async (req, res) => {
    try {
        if (!req.body.url) {
            return res.status(400).json({ error: 'Missing parameter' });
        }
        const url = req.body.url;

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Remove all undesirable tags:
        $('script, style, noscript, img, input').remove();

        text = $("body").text();
        res.json({ content: text });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch webpage content' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});