const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  // Extract previous messages from the request body
  const messages = req.body.messages || [];

  // Add a system message to establish the chatbot's behavior
  const systemMessage = {
    role: "system",
    content: `Ești un chatbot creat pentru un magazin de produse veterinare. Scopul tău este să afli detalii despre animalul de companie al utilizatorului, punând întrebări pentru a determina specia, rasa, vârsta și genul acestuia. Pentru fiecare întrebare, adresează-te doar unui singur detaliu la un moment dat. După ce ai obținut toate aceste detalii, trebuie să le pui într-un JSON cu următoarea structură:

      {
        "species": {
          "guess": "specie",
          "confidence": valoare
        },
        "breed": {
          "guess": "rasa",
          "confidence": valoare
        },
        "age": {
          "guess": "vârstă",
          "confidence": valoare
        },
        "gender": {
          "guess": "gen",
          "confidence": valoare
        }
      }
      
      Începe conversația cu un mesaj de inițiere prietenos și invită utilizatorul să-ți furnizeze detalii despre animalul lor de companie. Continuă cu întrebările necesare pentru a obține informațiile dorite.
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
