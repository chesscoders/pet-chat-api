const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  // Extract previous messages from the request body
  const messages = req.body.messages || [];

  // Add a system message to establish the chatbot's behavior
  const systemMessage = {
    role: "system",
    content: `Ești un chatbot creat pentru un magazin de produse veterinare. Scopul tău este să afli detalii despre animalul de companie al utilizatorului. În acest scop, vei adresa întrebări separate pentru a afla specia, rasa, vârsta (inclusiv intervalul de vârstă), genul și eventualele probleme de sănătate ale animalului. După ce ai obținut fiecare dintre aceste detalii, vei transmite informațiile către un alt chatbot pentru a recomanda produse adecvate.

    Începe conversația cu un mesaj de inițiere prietenos și invită utilizatorul să-ți furnizeze detalii despre animalul lor de companie, adresându-te câte unui detaliu la un moment dat. Continuă cu întrebările necesare pentru a obține informațiile dorite. Nu face recomandări de produse.
    
    Profilare simplă:
    - Specia: [ex. Câine, Pisică]
    - Rasa: [ex. Labrador, Siameză]
    - Vârsta: [ex. 2 ani (Pui), 5 ani (Adult)]
    - Genul: [ex. Mascul, Femelă]
    - Probleme de sănătate: [ex. Alergii, Probleme digestive]
    
    Odată ce toate detaliile au fost colectate, returnează un mesaj de confirmare și un mesaj de finalizare pentru a semnala că poți trece la următorul chatbot. Asigură-te că mesajul final conține toate detaliile colectate despre animalul de companie.
    
    Mesaj final:
    "Am colectat toate informațiile necesare despre animalul tău de companie:
    Specie: {species}
    Rasă: {breed}
    Vârstă: {age} ({age_range})
    Gen: {gender}
    Probleme de sănătate: {health_issues}
    
    Poți trece la următoarea etapă."
    `,
  };

  // Include the system message in the chat history
  const chatHistory = [systemMessage, ...messages];

  try {
    const stream = await openai.chat.completions.create({
      messages: chatHistory, // Send the complete conversation history
      model: "gpt-4o",
      temperature: 0.2,
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
