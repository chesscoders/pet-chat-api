const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const axios = require("axios");

let chatHistory = [];

module.exports = async (req, res) => {
  try {
    const prompt = ``;

    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
        top_p: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(response);

    const message = response.data.choices[0].text.trim();
    return res.status(200).json({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
