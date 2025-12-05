import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to clean base64 string
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateVideoTitles = async (topic: string): Promise<string[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Bertindaklah sebagai ahli strategi konten YouTube viral. 
      Buatlah daftar 20 judul video YouTube yang menarik, clickbait (dalam batas wajar), dan mengundang rasa ingin tahu berdasarkan topik berikut: "${topic}".
      Judul-judul tersebut harus menggunakan Bahasa Indonesia yang gaul dan menarik.
      Kembalikan hanya array JSON berisi string judul.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error generating titles:", error);
    throw new Error("Gagal menghasilkan judul. Pastikan API Key valid.");
  }
};

export const generateThumbnail = async (
  title: string, 
  userImageBase64: string,
  aspectRatio: '16:9' | '9:16' = '16:9',
  style: string = '3D Animation'
): Promise<string | null> => {
  try {
    // We use gemini-2.5-flash-image for image editing/generation capabilities with input images.
    const model = "gemini-2.5-flash-image"; 
    
    // Clean the base64 string
    const imageBytes = cleanBase64(userImageBase64);

    const prompt = `
      Buat gambar thumbnail YouTube yang sangat menarik (rasio ${aspectRatio}) untuk video berjudul: "${title}".
      
      GAYA VISUAL: ${style} (Ubah wajah pengguna dan lingkungan menjadi gaya ini).
      
      Instruksi Detail:
      1. **Subjek**: Gunakan wajah dari gambar input. Transformasikan wajah tersebut agar sesuai dengan gaya "${style}" (misal: jika 3D, buat seperti karakter film animasi 3D populer). Ekspresi harus sangat ekspresif (kaget, tertawa, atau serius).
      2. **TEKS (SANGAT PENTING)**: Tampilkan teks judul "${title}" (atau ringkasannya 2-3 kata kunci) di dalam gambar.
         - Font: SANGAT BESAR, TEBAL (Bold), Sans-Serif.
         - Warna: Warna cerah (Kuning/Putih/Neon) dengan OUTLINE TEBAL (Hitam/Merah) agar tulisan terbaca jelas di atas background apapun.
         - Posisi: Pastikan teks tidak menutupi wajah.
      3. **Komposisi**: 
         - Jika 16:9: Gunakan rule of thirds, subjek di kiri/kanan, teks di sisi kosong.
         - Jika 9:16 (Shorts): Subjek di bawah/tengah, teks di bagian atas atau tengah yang kosong.
      4. **Atmosfer**: Gunakan warna-warna saturasi tinggi, efek cahaya (glow), dan background yang relevan dengan topik tapi agak blur agar fokus ke subjek dan teks.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, API handles standard types
              data: imageBytes
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    // Check for image in response parts
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw new Error("Gagal membuat thumbnail. Silakan coba lagi.");
  }
};