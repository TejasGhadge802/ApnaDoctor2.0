const API_KEY = "AIzaSyAVmYGV1IH19m8-RBTbb-S6iZFV7cV7wXY"; // Replace with your Gemini API Key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const userInput2 = document.getElementById("user-input2"); // image

const closeButton = document.querySelector(".close-btn"); // close button in the chat window


// Open the chat when the bot avatar is clicked
botAvatar.addEventListener("click", function () {
    chatContainer.style.display = "flex"; // Show chat container
    botAvatar.style.display = "none"; // Hide the bot avatar when the chat is open
});

// Close the chat when the close button is clicked
closeButton.addEventListener("click", function () {
    chatContainer.style.display = "none"; // Hide the chat container
    botAvatar.style.display = "block"; // Show the bot avatar again
});

// Function to send a message
async function sendMessage() {
    let message = userInput.value.trim();
    if (message === "") return;

    appendMessage("user", message);
    userInput.value = "";
    sendButton.disabled = true; // Disable button while fetching response

    try {
        // Check for health-related questions first (can be expanded)
        let healthRelatedResponse = getHealthResponse(message);
        if (healthRelatedResponse) {
            appendMessage("bot", healthRelatedResponse);
        } else {
            // If not health-related, proceed to API call
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: message }] }]
                })
            });

            const data = await response.json();
            console.log("Gemini API Response:", data);

            if (data.candidates && data.candidates.length > 0) {
                let botResponse = data.candidates[0].content.parts[0].text;
                appendMessage("bot", botResponse);
            } else {
                appendMessage("bot", "I'm not sure how to respond to that.");
            }
        }
    } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "Error connecting to API.");
    } finally {
        sendButton.disabled = false;
    }
}

// Function to handle health-related questions
function getHealthResponse(message) {
    const healthResponses = {
        "fever": {
            name: "Fever",
            symptoms: "Common symptoms of fever include an elevated body temperature (above 100.4°F or 38°C), chills, sweating, and headache.",
            precautions: [
                { precaution: "Stay Hydrated", explanation: "Drink plenty of water to avoid dehydration, which can worsen fever symptoms." },
                { precaution: "Rest", explanation: "Ensure proper rest to help your body fight the infection causing the fever." },
                { precaution: "Monitor Temperature", explanation: "Keep track of your temperature to determine if medical intervention is needed." },
                { precaution: "Seek Medical Attention", explanation: "If your fever persists for more than 3 days or exceeds 103°F (39.4°C), consult a healthcare provider." }
            ]
        },
        "headache": {
            name: "Headache",
            symptoms: "Headache symptoms can include pain or pressure in the head, dizziness, nausea, and sensitivity to light or sound.",
            precautions: [
                { precaution: "Stay Hydrated", explanation: "Dehydration is a common cause of headaches, so drink water regularly." },
                { precaution: "Take Pain Relievers", explanation: "Over-the-counter pain relievers like ibuprofen or acetaminophen may help alleviate mild headaches." },
                { precaution: "Rest in a Quiet, Dark Room", explanation: "Headaches, especially migraines, can be worsened by noise and bright lights. Resting in a calm environment can help." },
                { precaution: "Avoid Stress", explanation: "Stress is a common trigger for headaches. Practice relaxation techniques like deep breathing or meditation." }
            ]
        },
        "cold": {
            name: "Common Cold",
            symptoms: "Symptoms of a cold include a runny nose, sneezing, sore throat, cough, and congestion.",
            precautions: [
                { precaution: "Rest", explanation: "Rest is important to help your body fight the viral infection." },
                { precaution: "Use Over-the-Counter Medications", explanation: "Over-the-counter decongestants and pain relievers can help alleviate cold symptoms." },
                { precaution: "Stay Warm", explanation: "Keeping yourself warm can help reduce the discomfort caused by cold symptoms." },
                { precaution: "Avoid Close Contact", explanation: "To prevent spreading the cold, avoid close contact with others until symptoms subside." }
            ]
        },
        "asthma": {
            name: "Asthma",
            symptoms: "Asthma symptoms include shortness of breath, wheezing, coughing, and tightness in the chest, especially during physical activity or at night.",
            precautions: [
                { precaution: "Avoid Triggers", explanation: "Common asthma triggers include allergens, smoke, and exercise. Identifying and avoiding triggers is key to controlling asthma." },
                { precaution: "Use Inhalers as Prescribed", explanation: "Using your inhaler regularly as prescribed by a doctor can help prevent asthma attacks." },
                { precaution: "Monitor Symptoms", explanation: "Track your symptoms and peak flow readings to detect early signs of an asthma flare-up." },
                { precaution: "Get a Flu Vaccine", explanation: "Asthma patients should get vaccinated against the flu, as respiratory infections can trigger asthma attacks." }
            ]
        },
        "diabetes": {
            name: "Diabetes",
            symptoms: "Symptoms of diabetes include frequent urination, excessive thirst, unexplained weight loss, and fatigue.",
            precautions: [
                { precaution: "Monitor Blood Sugar Levels", explanation: "Regularly check your blood sugar levels to ensure they remain within the target range set by your healthcare provider." },
                { precaution: "Follow a Healthy Diet", explanation: "Eating a balanced diet with controlled carbohydrate intake helps manage blood sugar levels." },
                { precaution: "Exercise Regularly", explanation: "Regular physical activity helps your body use insulin more efficiently and maintain a healthy weight." },
                { precaution: "Take Medication as Prescribed", explanation: "Follow your doctor's instructions for taking insulin or other diabetes medications to help manage blood sugar levels." }
            ]
        },"diabetes": {
                name: "Diabetes",
                symptoms: "Symptoms of diabetes include frequent urination, excessive thirst, unexplained weight loss, and fatigue.",
                precautions: [
                    { precaution: "Monitor Blood Sugar Levels", explanation: "Regularly check your blood sugar levels to ensure they remain within the target range set by your healthcare provider." },
                    { precaution: "Follow a Healthy Diet", explanation: "Eating a balanced diet with controlled carbohydrate intake helps manage blood sugar levels." },
                    { precaution: "Exercise Regularly", explanation: "Regular physical activity helps your body use insulin more efficiently and maintain a healthy weight." },
                    { precaution: "Take Medication as Prescribed", explanation: "Follow your doctor's instructions for taking insulin or other diabetes medications to help manage blood sugar levels." }
                ]
            },
            "obesity": {
                name: "Obesity",
                symptoms: "Symptoms of obesity include excess body fat, difficulty losing weight, fatigue, and shortness of breath.",
                precautions: [
                    { precaution: "Maintain a Healthy Diet", explanation: "Focus on a balanced diet with reduced calorie intake, prioritizing fruits, vegetables, and lean proteins." },
                    { precaution: "Exercise Regularly", explanation: "Engage in physical activities such as walking, running, or strength training to burn calories and improve overall health." },
                    { precaution: "Track Your Progress", explanation: "Monitor your weight and body measurements regularly to track progress and make adjustments to your lifestyle." },
                    { precaution: "Consult a Healthcare Provider", explanation: "Seek medical advice to determine if any underlying conditions contribute to obesity and explore treatment options." }
                ]
            },
            "heart attack": {
                name: "Heart Attack",
                symptoms: "Symptoms of a heart attack include chest pain, shortness of breath, nausea, dizziness, and pain in the neck, jaw, or back.",
                precautions: [
                    { precaution: "Quit Smoking", explanation: "Smoking is a major risk factor for heart disease. Quitting reduces your risk of a heart attack." },
                    { precaution: "Manage Stress", explanation: "Chronic stress can contribute to heart disease. Practice relaxation techniques like meditation or yoga." },
                    { precaution: "Follow a Healthy Diet", explanation: "A diet low in saturated fats, cholesterol, and sodium can help prevent heart disease." },
                    { precaution: "Exercise Regularly", explanation: "Engaging in physical activity such as walking, swimming, or cycling can improve heart health." }
                ]
            },
            "cancer": {
                name: "Cancer",
                symptoms: "Symptoms of cancer may include unexplained weight loss, fatigue, lumps, changes in skin appearance, and pain.",
                precautions: [
                    { precaution: "Avoid Tobacco", explanation: "Tobacco use is a leading cause of various types of cancer. Avoid smoking and exposure to secondhand smoke." },
                    { precaution: "Eat a Healthy Diet", explanation: "A diet rich in fruits, vegetables, and whole grains while limiting processed foods can help reduce cancer risk." },
                    { precaution: "Protect Your Skin", explanation: "Use sunscreen, wear protective clothing, and avoid prolonged sun exposure to lower the risk of skin cancer." },
                    { precaution: "Get Regular Screenings", explanation: "Early detection through screenings can increase the chances of successful cancer treatment." }
                ]
            },
            "down syndrome": {
                name: "Down Syndrome",
                symptoms: "Down syndrome symptoms include developmental delays, intellectual disabilities, distinct facial features, and low muscle tone.",
                precautions: [
                    { precaution: "Early Intervention", explanation: "Early childhood intervention, including speech and physical therapy, can help improve development and quality of life." },
                    { precaution: "Monitor Health Regularly", explanation: "Individuals with Down syndrome should undergo regular medical checkups to monitor for health issues like heart defects or thyroid problems." },
                    { precaution: "Promote Social Inclusion", explanation: "Encourage participation in social and educational activities to help individuals with Down syndrome reach their potential." },
                    { precaution: "Provide a Structured Environment", explanation: "A structured and supportive environment can help individuals with Down syndrome thrive and develop life skills." }
                ]
            },
            "mental health": {
                name: "Mental Health",
                symptoms: "Mental health issues may present as mood swings, anxiety, depression, irritability, and difficulty concentrating.",
                precautions: [
                    { precaution: "Seek Professional Help", explanation: "Consulting a therapist or counselor can help address mental health concerns and provide coping strategies." },
                    { precaution: "Maintain a Healthy Lifestyle", explanation: "Regular physical activity, a balanced diet, and proper sleep are crucial for maintaining good mental health." },
                    { precaution: "Build a Support System", explanation: "Having a strong network of friends, family, or support groups can provide emotional stability." },
                    { precaution: "Practice Stress Management", explanation: "Engage in relaxation techniques such as deep breathing, meditation, or mindfulness to manage stress and anxiety." }
                ]
            },
            "blood clotting": {
                name: "Blood Clotting Disorders",
                symptoms: "Symptoms of blood clotting disorders include excessive bleeding, unexplained bruising, and swelling in the legs.",
                precautions: [
                    { precaution: "Take Anticoagulant Medications", explanation: "Follow your doctor's instructions for taking blood thinners to prevent clots from forming." },
                    { precaution: "Avoid Prolonged Sitting", explanation: "Prolonged sitting, especially during long flights, can increase the risk of blood clots. Take breaks to stretch and walk around." },
                    { precaution: "Stay Active", explanation: "Engage in regular exercise to improve circulation and reduce the risk of clots." },
                    { precaution: "Monitor for Signs of Clots", explanation: "Be aware of symptoms such as swelling, pain, and redness, and seek immediate medical attention if you suspect a blood clot." }
                ]
            }
        };

    // Check if the message contains a health-related keyword
    for (let key in healthResponses) {
        if (message.toLowerCase().includes(key)) {
            const disease = healthResponses[key];
            let response = `**Disease:** ${disease.name}\n\n**Symptoms:**\n${disease.symptoms}\n\n**Precautions:**\n`;
            disease.precautions.forEach((precaution, index) => {
                response += `${index + 1}. **${precaution.precaution}:** ${precaution.explanation}\n`;
            });
            return response;
        }
    }

    // Return null if no health-related keyword is found
    return null;
}

// Function to append messages in the chat box
function appendMessage(role, text, image) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", role);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});
