import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { generateVideoTitles } from '../services/geminiService';

interface TitleGeneratorProps {
  onTitleSelected: (title: string) => void;
}

const TitleGenerator: React.FC<TitleGeneratorProps> = ({ onTitleSelected }) => {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setTitles([]);

    try {
      const results = await generateVideoTitles(topic);
      setTitles(results);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat membuat judul.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Ide Judul Viral
        </h1>
        <p className="text-gray-400">Masukkan topik video Anda, dan AI akan membuatkan 20 judul clickbait.</p>
      </div>

      <form onSubmit={handleGenerate} className="relative max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Tutorial Masak Nasi Goreng Spesial..."
            className="w-full bg-[#1f1f1f] border border-gray-700 text-white pl-12 pr-4 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder-gray-500"
            disabled={loading}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="absolute right-2 top-2 bottom-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 rounded-full font-medium transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Buat'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg text-center max-w-xl mx-auto">
          {error}
        </div>
      )}

      {titles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Pilih Judul Terbaik</h2>
            <button 
              onClick={handleGenerate} 
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {titles.map((title, idx) => (
              <button
                key={idx}
                onClick={() => onTitleSelected(title)}
                className="group relative text-left bg-[#1f1f1f] hover:bg-[#2a2a2a] hover:border-red-500 border border-transparent p-4 rounded-xl transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs flex items-center justify-center font-mono group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-gray-200 font-medium leading-relaxed group-hover:text-white">
                    {title}
                  </span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
                  <CheckCircle2 size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleGenerator;
