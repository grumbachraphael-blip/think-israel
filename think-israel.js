async function checkAnswer() {
    const userAnswer = document.getElementById('userAnswer').value;
    const feedbackDiv = document.getElementById('feedback');
    const starContainer = document.getElementById('star-container');
    
    if (!userAnswer) {
        alert("נא לכתוב תשובה");
        return;
    }

    feedbackDiv.innerText = "ה-AI בודק את תשובתך...";
    
    const apiKey = "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"
    
    const prompt = `
        אתה בוחן רטוריקה. המשימה של המשתמש היא לענות על השאלה: "איך להסביר את המצב בעזה בצורה מכבדת עם טיעונים חזקים?".
        בדוק את תשובת המשתמש לפי הקריטריונים:
        1. שפה מכבדת ולא מתלהמת.
        2. שימוש בטיעונים עובדתיים או לוגיים חזקים.
        
        תשובת המשתמש: "${userAnswer}"
        
        ענה בפורמט JSON בלבד:
        {"isCorrect": true/false, "feedback": "הסבר קצר"}
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        if (result.isCorrect) {
            feedbackDiv.style.color = "#2ECC40";
            feedbackDiv.innerText = "כל הכבוד! " + result.feedback;
            // הפעלת האנימציה
            starContainer.style.display = "block";
            starContainer.classList.add("rotating-star");
        } else {
            feedbackDiv.style.color = "#FF4136";
            feedbackDiv.innerText = "צריך לשפר: " + result.feedback;
            starContainer.style.display = "none";
        }
    } catch (error) {
        feedbackDiv.innerText = "שגיאה בחיבור ל-AI. וודא שהמפתח תקין.";
    }
}