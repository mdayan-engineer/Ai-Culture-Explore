import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Firebase config endpoint
  app.get('/api/firebase-config', (req, res) => {
    try {
      const configStr = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8');
      res.json(JSON.parse(configStr));
    } catch (e) {
      res.status(500).json({ error: 'Failed to load Firebase config' });
    }
  });

  // AI Feature: Destination Discovery
  app.post('/api/discover-destinations', async (req, res) => {
    try {
      const { country, city, budget, duration, interests, groupType, accessibility } = req.body;
      const prompt = `Act as an expert travel advisor. Recommend 3 amazing destinations/neighborhoods for a trip.
Parameters:
- Country/Region: ${country}
- City (if applicable): ${city}
- Budget: ${budget}
- Duration: ${duration}
- Interests: ${interests}
- Group Type: ${groupType}
- Accessibility: ${accessibility}

Format the response as a JSON array of objects with the following keys:
- name: The destination name.
- description: A short, compelling description.
- bestSeason: Best time to visit.
- estimatedBudget: A realistic budget estimate.
- safety: Safety considerations or tips.
- tags: An array of 3-4 string tags.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to discover destinations' });
    }
  });

  // AI Feature: Smart Itinerary
  app.post('/api/generate-itinerary', async (req, res) => {
    try {
      const { destination, duration, budget, interests } = req.body;
      const prompt = `Create a smart, detailed day-by-day itinerary for a trip.
Parameters:
- Destination: ${destination}
- Duration: ${duration}
- Budget: ${budget}
- Interests: ${interests}

Format the response as a JSON array where each object represents a day:
- dayNumber: number
- theme: string (e.g., "Historical Exploration")
- activities: an array of objects with:
    - timeOfDay: string (Morning, Afternoon, Evening, Night)
    - name: string
    - description: string
    - travelTime: string
    - estimatedCost: string
    - transportSuggestion: string
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate itinerary' });
    }
  });

  // AI Feature: Cultural Storytelling
  app.post('/api/cultural-storytelling', async (req, res) => {
    try {
      const { destination } = req.body;
      const prompt = `Provide deep cultural storytelling for: ${destination}.
Include historical background, cultural significance, local legends, architecture, traditional customs, local etiquette, and photography tips.
Format as a JSON object:
- historicalBackground: string
- culturalSignificance: string
- localLegends: string
- architecture: string
- traditionalCustoms: string
- localEtiquette: string
- photographyTips: string
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate cultural storytelling' });
    }
  });

  // AI Feature: Hidden Gems
  app.post('/api/hidden-gems', async (req, res) => {
    try {
      const { destination } = req.body;
      const prompt = `Recommend 5 hidden gems for ${destination} that avoid tourist traps.
Include local cafes, street food, art districts, nature trails, etc.
Format as JSON array of objects:
- name: string
- category: string
- description: string
- whyItsSpecial: string
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate hidden gems' });
    }
  });

  // AI Feature: Local Events
  app.post('/api/local-events', async (req, res) => {
    try {
      const { city, dates } = req.body;
      const prompt = `Suggest local events, festivals, music, exhibitions, and cultural performances for ${city} around ${dates}.
Format as JSON array of objects:
- name: string
- type: string
- description: string
- estimatedDates: string
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate events' });
    }
  });
  
  // AI Feature: Packing Assistant
  app.post('/api/packing-assistant', async (req, res) => {
    try {
      const { destination, duration, weather } = req.body;
      const prompt = `Generate a comprehensive packing checklist for a ${duration} trip to ${destination} with ${weather} weather.
Format as JSON object with arrays of strings:
- clothes: []
- electronics: []
- documents: []
- medicine: []
- emergencyKit: []
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate packing list' });
    }
  });

  // AI Feature: Local Food Explorer
  app.post('/api/local-food', async (req, res) => {
    try {
      const { destination, dietaryPreferences } = req.body;
      const prompt = `Recommend local food and dishes in ${destination}.
Dietary Preferences to respect (if any): ${dietaryPreferences}
Format as JSON object with arrays of objects ({ name: string, description: string }):
- breakfast: []
- lunch: []
- dinner: []
- streetFood: []
- desserts: []
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate food guide' });
    }
  });
  
  // AI Feature: Local Guide Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, context } = req.body;
      const systemInstruction = "You are a friendly, knowledgeable local guide for " + context + ". Provide concise, helpful answers.";
      const chatMessages = messages.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: chatMessages,
        config: { systemInstruction: systemInstruction }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Chat failed' });
    }
  });

  // AI Feature: Budget Planner
  app.post('/api/budget-planner', async (req, res) => {
    try {
      const { destination, totalBudget, duration, groupType } = req.body;
      const prompt = `Act as an expert travel budget planner.
Parameters:
- Destination: ${destination}
- Total Budget: ${totalBudget}
- Duration: ${duration}
- Group Type: ${groupType}

Allocate the budget and provide cost-saving tips.
Format as a JSON object:
- accommodation: { amount: string, description: string }
- food: { amount: string, description: string }
- transport: { amount: string, description: string }
- activities: { amount: string, description: string }
- shopping: { amount: string, description: string }
- emergency: { amount: string, description: string }
- optimizationTips: [string, string, string]
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate budget' });
    }
  });

  // AI Feature: Safety Advisor
  app.post('/api/safety-advisor', async (req, res) => {
    try {
      const { destination } = req.body;
      const prompt = `Act as a travel safety advisor for ${destination}.
Provide practical and realistic safety advice.
Format as a JSON object:
- commonScams: [string, string]
- emergencyContacts: [string, string]
- touristWarnings: [string, string]
- healthTips: [string, string]
- culturalEtiquette: [string, string]
- femaleTravelerSafety: [string, string]
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate safety advice' });
    }
  });

  // AI Feature: Offline Travel Kit
  app.post('/api/offline-kit', async (req, res) => {
    try {
      const { destination } = req.body;
      const prompt = `Generate an offline travel kit summary for ${destination}.
Format as a JSON object:
- emergencyPhrases: { phrase: string, translation: string, pronunciation: string }[]
- currencyInfo: { name: string, symbol: string, conversionTip: string }
- embassyInfo: string
- keyAreasToDownloadMap: [string, string, string]
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate offline kit' });
    }
  });

  // AI Feature: Translator Assistant
  app.post('/api/translator', async (req, res) => {
    try {
      const { phrase, language } = req.body;
      const prompt = `Translate the following phrase into ${language} for a traveler, and provide the pronunciation and context on when to use it.
Phrase: "${phrase}"

Format as a JSON object:
- translated: string
- pronunciation: string
- context: string
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to translate' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:\${PORT}`);
  });
}

startServer();
