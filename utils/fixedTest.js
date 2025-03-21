import { OpenAI } from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
console.log("Fixed test script is running...");

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY tidak ditemukan dalam environment variables.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const logPath = "error.log";
if (!fs.existsSync(logPath)) {
  console.error(`Error: File '${logPath}' tidak ditemukan.`);
  process.exit(1);
}

const errorLog = fs.readFileSync(logPath, "utf-8");

async function fixCode() {
  try {
    const prompt = `
      Saya memiliki pengujian Playwright yang gagal. Berikut log errornya:
      ${errorLog}

      Tolong perbaiki kode pengujian ini dan berikan versi yang telah diperbaiki:
    `;

    const fixedCode = response.choices?.[0]?.message?.content;
    
    if (!fixedCode) {
      console.error("Error: Tidak ada kode yang dikembalikan oleh OpenAI.");
      return;
    }

    fs.writeFileSync("fixedTest.js", fixedCode);
    console.log("Kode telah diperbaiki! Cek 'fixedTest.js'.");
  } catch (error) {

    console.error("Terjadi kesalahan:", error.response ? error.response.data : error.message);
  }
  
}

fixCode();
