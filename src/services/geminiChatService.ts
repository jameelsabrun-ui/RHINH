export const getGeminiResponse = async (userMessage: string, chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        chatHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      return errorData.error || "Maaf, terjadi kesalahan teknis pada layanan AI. Silakan hubungi admin via WhatsApp untuk bantuan langsung.";
    }

    const data = await response.json();
    return data.text || "Mohon maaf, saya sedang tidak bisa merespons. Silakan coba lagi nanti.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Maaf, terjadi kesalahan teknis pada layanan AI. Silakan hubungi admin via WhatsApp untuk bantuan langsung.";
  }
};
