import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, ArrowLeft, Download, AlertCircle, Smartphone, MonitorPlay, Palette } from 'lucide-react';
import { generateThumbnail } from '../services/geminiService';

interface ThumbnailCreatorProps {
  selectedTitle: string;
  onBack: () => void;
}

const styles = [
  { id: '3D Animation', label: '3D Animasi (Pixar Style)', icon: '🧊' },
  { id: '3D Hyper-Realistic', label: '3D Render (High Quality)', icon: '🎲' },
  { id: 'Natural Photography', label: 'Natural & Autentik', icon: '🌿' },
  { id: 'Cinematic Realistic', label: 'Realistis Sinematik', icon: '📸' },
  { id: 'Anime Style', label: 'Anime Jepang', icon: '🎋' },
  { id: 'Comic Book', label: 'Komik/Pop Art', icon: '💥' },
  { id: 'Neon Cyberpunk', label: 'Neon Cyberpunk', icon: '🤖' },
];

const ThumbnailCreator: React.FC<ThumbnailCreatorProps> = ({ selectedTitle, onBack }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('3D Animation');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file terlalu besar (Max 5MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
        setGeneratedImage(null); // Reset generated image on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!imagePreview || !selectedTitle) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateThumbnail(selectedTitle, imagePreview, aspectRatio, selectedStyle);
      if (result) {
        setGeneratedImage(result);
      } else {
        throw new Error("Gagal menerima data gambar dari AI.");
      }
    } catch (err: any) {
      setError(err.message || "Gagal membuat thumbnail.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft size={18} /> Kembali ke Pilihan Judul
      </button>

      <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl text-gray-400 mb-2 font-medium uppercase tracking-wider text-xs">Judul Terpilih</h2>
        <div className="text-2xl md:text-3xl font-bold text-white leading-tight">
          "{selectedTitle}"
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Settings & Input Column (Left Side - 5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Controls Container */}
          <div className="bg-[#1f1f1f] rounded-2xl p-5 border border-gray-800 space-y-6">
            
            {/* Aspect Ratio Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MonitorPlay size={16} /> Format Video
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#0f0f0f] p-1 rounded-xl">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    aspectRatio === '16:9' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a]'
                  }`}
                >
                  <MonitorPlay size={16} /> Landscape (16:9)
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    aspectRatio === '9:16' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a]'
                  }`}
                >
                  <Smartphone size={16} /> Shorts (9:16)
                </button>
              </div>
            </div>

            {/* Style Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Palette size={16} /> Gaya Visual
              </label>
              <div className="grid grid-cols-1 gap-2">
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
                >
                  {styles.map(s => (
                    <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Unggah Foto</h3>
            <div 
              className={`relative border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                imagePreview ? 'border-red-500/50 bg-[#0f0f0f]' : 'border-gray-700 hover:border-gray-500 bg-[#1a1a1a]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-80" 
                />
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
                    <Upload size={20} />
                  </div>
                  <p className="text-gray-300 font-medium text-sm">Klik untuk unggah</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
          </div>

          <button
            onClick={handleGenerateThumbnail}
            disabled={!imagePreview || isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              !imagePreview || isGenerating 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-900/20'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" /> Menggambar...
              </>
            ) : (
              <>
                <ImageIcon size={20} /> Generate ({aspectRatio})
              </>
            )}
          </button>
          
          {error && (
            <div className="flex items-start gap-3 text-red-400 bg-red-900/10 p-4 rounded-lg text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Output Column (Right Side - 7/12 width) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start">
           {/* Preview Container that adapts shape */}
           <div className={`
              relative w-full bg-[#000] rounded-2xl border border-gray-800 flex items-center justify-center overflow-hidden transition-all duration-500
              ${aspectRatio === '16:9' ? 'aspect-video' : 'max-w-sm aspect-[9/16]'}
           `}>
             {generatedImage ? (
               <img src={generatedImage} alt="Generated Thumbnail" className="w-full h-full object-cover animate-in zoom-in duration-500" />
             ) : (
               <div className="text-center text-gray-600 p-8">
                 {isGenerating ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="animate-pulse">AI sedang melukis gaya {selectedStyle}...</p>
                    </div>
                 ) : (
                   <div className="flex flex-col items-center">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Hasil {aspectRatio === '16:9' ? 'Thumbnail Video' : 'Shorts'} akan muncul di sini</p>
                    <p className="text-xs text-gray-700 mt-2">Pilih gaya visual di sebelah kiri</p>
                   </div>
                 )}
               </div>
             )}
          </div>

          {generatedImage && (
            <div className={`mt-6 w-full ${aspectRatio === '9:16' ? 'max-w-sm' : ''}`}>
              <a 
                href={generatedImage} 
                download={`thumbnail-${aspectRatio}-${selectedTitle.slice(0, 10)}.png`}
                className="block w-full"
              >
                <button className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Download size={20} /> Unduh {aspectRatio}
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCreator;