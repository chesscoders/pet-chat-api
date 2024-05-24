const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = async (req, res) => {
  const messages = req.body.messages.map((message) => message.content); // Extract content from each message
  const prompt = `${messages.join("\n")}\nAnswer in Romanian:`; // Concatenate messages and add instruction

  try {
    const stream = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }], // Use concatenated prompt including message history
      model: "gpt-3.5-turbo",
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
