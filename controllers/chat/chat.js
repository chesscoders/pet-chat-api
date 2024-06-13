const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const { SYSTEM_MESSAGE } = require("../../constants");

module.exports = async (req, res) => {
  // Extract previous messages from the request body
  const messages = req.body.messages || [];

  // Include the system message in the chat history
  const chatHistory = [SYSTEM_MESSAGE, ...messages];

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
