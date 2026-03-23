export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { answer } = req.body;
    const apiKey = process.env.GROQ_API_KEY; // המפתח יימשך מהגדרות Vercel

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are an Israeli diplomacy expert. Evaluate the user's answer. Respond ONLY with a valid JSON object: {\"isCorrect\": boolean, \"feedback\": \"string\"}. Feedback must be in Hebrew." },
                    { role: "user", content: `האם התשובה הזו מכבדת ומשכנעת להסברה? ענה בפורמט JSON בלבד. התשובה: "${answer}"` }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const aiResponse = JSON.parse(data.choices[0].message.content);
        res.status(200).json(aiResponse);
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to Groq' });
    }
}
