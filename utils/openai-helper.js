import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @param {string} testScenario 
 * @returns {Promise<string>} 
 */
export async function generateTestCase(testScenario) {
    try {
        const prompt = `Buatkan skrip Playwright berbasis @playwright/test untuk menguji skenario berikut:\n\n"${testScenario}"\n\nGunakan struktur yang baik dengan expect assertion.`;
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error generating test case:", error);
        throw new Error("Failed to generate test case.");
    }
}