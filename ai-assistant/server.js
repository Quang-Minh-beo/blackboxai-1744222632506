const express = require('express');
const { OpenAI } = require('openai');
const { PineconeClient } = require('pinecone-client');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Initialize Pinecone
const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENV
});

// Product Management Endpoints
app.post('/api/products', async (req, res) => {
  const { name, link, images } = req.body;
  
  // Get product info from affiliate link
  const productInfo = await scrapeProductInfo(link);
  
  // Generate descriptions with AI
  const description = await generateProductDescription(name, productInfo);
  const seoMeta = await generateSEOMeta(name, description);
  const prosCons = await generateProsCons(name, productInfo);
  
  res.json({
    name,
    link,
    images,
    description,
    seoMeta,
    prosCons
  });
});

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, productId } = req.body;
  
  // Get product context from vector DB
  const context = await getProductContext(productId);
  
  // Generate AI response
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an affiliate marketing assistant. Use this product context: ${context}`
      },
      {
        role: "user",
        content: message
      }
    ]
  });
  
  res.json({ response: response.choices[0].message.content });
});

// Helper functions
async function scrapeProductInfo(url) {
  // Implementation for scraping product info
  try {
    const response = await axios.get(`https://api.example.com/scrape?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Scraping failed:', error);
    return {};
  }
}

async function generateProductDescription(name, info) {
  const prompt = `Write a compelling 200-word product description for ${name} using these details: ${JSON.stringify(info)}. Include benefits and features.`;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });
  return response.choices[0].message.content;
}

async function generateSEOMeta(title, description) {
  const prompt = `Generate SEO meta title and description for product "${title}". Description: ${description}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  return response.choices[0].message.content;
}

async function generateProsCons(name, info) {
  const prompt = `List 5 pros and 3 cons for ${name} in bullet points. Product info: ${JSON.stringify(info)}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  return response.choices[0].message.content;
}

async function getProductContext(productId) {
  const queryResponse = await pinecone.query({
    vector: await generateEmbedding(productId),
    topK: 3
  });
  return queryResponse.matches.map(match => match.metadata.text).join('\n');
}

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002"
  });
  return response.data[0].embedding;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
