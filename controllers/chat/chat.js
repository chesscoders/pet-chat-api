const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  // Extract previous messages from the request body
  const messages = req.body.messages || [];

  // Add a system message to establish the chatbot's behavior
  const systemMessage = {
    role: "system",
    content: `Ești un chatbot creat pentru un magazin de produse veterinare. Scopul tău este să afli detalii despre animalul de companie al utilizatorului. În acest scop, vei adresa întrebări separate pentru a afla specia, rasa, vârsta, genul și eventualele probleme de sănătate ale animalului. După ce ai obținut fiecare dintre aceste detalii, vei utiliza informațiile furnizate de utilizator pentru a recomanda produse adecvate și pentru a crea un JSON care va reflecta aceste nevoi.

    Începe conversația cu un mesaj de inițiere prietenos și invită utilizatorul să-ți furnizeze detalii despre animalul lor de companie, adresându-te câte unui detaliu la un moment dat. Continuă cu întrebările necesare pentru a obține informațiile dorite.
    
    Structura JSON-ului pe care trebuie să o creezi după ce obții toate detaliile ar trebui să arate astfel:
    
    {
      "food_needs": [
        {
          "criteria": "species/breed/age/gender",
          "value": "value",
          "details": {
            "type": "tip de hrană",
            "search_keywords": ["cuvânt cheie1", "cuvânt cheie2"],
            "ideal_product_description": "Descrierea ideală a produsului",
            "confidence": valoare_confidență
          }
        }
        // alte nevoi alimentare
      ],
      "medicine_needs": [
        {
          "criteria": "species/breed/age/gender",
          "value": "value",
          "details": {
            "type": "tip de medicament",
            "frequency": "frecvență",
            "search_keywords": ["cuvânt cheie1", "cuvânt cheie2"],
            "ideal_product_description": "Descrierea ideală a produsului",
            "confidence": valoare_confidență
          }
        }
        // alte nevoi medicale
      ],
      "treatment_needs": [
        {
          "criteria": "species/breed/age/gender",
          "value": "value",
          "details": {
            "type": "tip de tratament",
            "frequency": "frecvență",
            "search_keywords": ["cuvânt cheie1", "cuvânt cheie2"],
            "ideal_product_description": "Descrierea ideală a produsului",
            "confidence": valoare_confidență
          }
        }
        // alte nevoi de tratament
      ],
      "general_needs": [
        {
          "criteria": "species/breed/age/gender",
          "value": "value",
          "details": {
            "type": "tip general",
            "search_keywords": ["cuvânt cheie1", "cuvânt cheie2"],
            "ideal_product_description": "Descrierea ideală a produsului",
            "confidence": valoare_confidență
          }
        }
        // alte nevoi generale
      ],
      "common_diseases": [
        {
          "name": "numele bolii",
          "details": {
            "description": "Descrierea bolii",
            "prevention": "Metode de prevenire",
            "search_keywords": ["cuvânt cheie1", "cuvânt cheie2"],
            "ideal_product_description": "Descrierea ideală a produsului",
            "confidence": valoare_confidență
          }
        }
        // alte boli comune
      ]
    }
    `,
  };

  // Include the system message in the chat history
  const chatHistory = [systemMessage, ...messages];
  console.log(chatHistory);

  try {
    const stream = await openai.chat.completions.create({
      messages: chatHistory, // Send the complete conversation history
      model: "gpt-4o",
      temperature: 0.8,
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`${content}`);
      }
    }

    res.end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
