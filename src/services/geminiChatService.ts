import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Anda adalah Asisten Syariah untuk perumahan Nur Holis Regency. 
Tugas Anda adalah menjawab pertanyaan calon pembeli tentang konsep properti syariah yang kami terapkan.

Prinsip Utama Kami:
1. Tanpa Riba (No Usury): Tidak ada bunga bank. Harga flat sampai lunas.
2. Tanpa Bunga: Kami tidak menggunakan sistem perbankan konvensional yang berbunga.
3. Tanpa Denda: Jika pembeli terlambat membayar, tidak ada denda finansial. Kami mengutamakan musyawarah.
4. Tanpa Sita: Jika pembeli benar-benar tidak mampu membayar setelah musyawarah, unit tidak akan disita secara paksa seperti bank. Kami akan mencari solusi terbaik seperti membantu menjualkan unit dan mengembalikan hak pembeli.
5. Akad Jual Beli Langsung: Akad dilakukan langsung antara developer dan pembeli.

Gaya Bahasa:
- Sopan, menenangkan, dan edukatif.
- Gunakan sapaan yang ramah (Misal: Bapak/Ibu).
- Jika ditanya hal teknis harga atau stok konkret, arahkan untuk menghubungi tim sales via tombol WhatsApp yang tersedia di website.
- Singkat dan jelas.

Tujuan Anda adalah memberikan pemahaman dasar bahwa memiliki rumah secara syariah itu berkah dan mudah tanpa jeratan riba.
`;

export const getGeminiResponse = async (userMessage: string, chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "Mohon maaf, saya sedang tidak bisa merespons. Silakan coba lagi nanti.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan teknis pada layanan AI. Silakan hubungi admin via WhatsApp untuk bantuan langsung.";
  }
};
