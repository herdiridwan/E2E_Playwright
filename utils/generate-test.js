import fs from "fs";
import { generateTestCase } from "./openai-helper.js";

(async () => {
    const testScenario = `
    **Test Case: Login dengan username dan password valid**
    **Step 1:** Buka halaman login
    **Step 2:** Masukkan username yang valid
    **Step 3:** Masukkan password yang valid
    **Step 4:** Klik tombol login
    **Step 5:** Verifikasi bahwa pengguna berhasil masuk ke dashboard`;

    try {
        console.log("🔄 Menghasilkan test case menggunakan OpenAI...");
        const testCaseScript = await generateTestCase(testScenario);

        const filePath = "./tests/login.ai.js";
        fs.writeFileSync(filePath, testCaseScript);
        console.log(`✅ Test case berhasil dibuat di: ${filePath}`);
    } catch (error) {
        console.error("❌ Gagal membuat test case:", error);
    }
})();