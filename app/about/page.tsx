import { Mail, Shield, Zap, Globe, Cpu, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      {/* 1. Hero Section */}
      <section className="mb-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Tentang <span className="text-amber-400">PDFCraft</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
          Solusi pengolahan dokumen modern yang memprioritaskan keamanan data Anda di atas segalanya.
        </p>
      </section>

      {/* 2. Deep Dive: Penjelasan Lengkap Aplikasi */}
      <section className="mb-24 space-y-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Apa itu PDFCraft?</h2>
            <p className="text-slate-600 leading-relaxed">
              PDFCraft adalah alat berbasis web yang dirancang khusus untuk menggabungkan dokumen PDF secara instan tanpa mengorbankan privasi. Di dunia di mana data pribadi sering kali menjadi komoditas, kami hadir dengan pendekatan yang berbeda.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Bagaimana Cara Kerjanya?</h2>
            <p className="text-slate-600 leading-relaxed">
              Aplikasi ini menggunakan teknologi <strong>Client-Side Processing</strong>. Saat Anda memilih file, browser Anda memproses seluruh logika penggabungan menggunakan pustaka <em>pdf-lib</em>. Tidak ada data yang dikirim ke server backend kami; semua terjadi langsung di memori perangkat Anda.
            </p>
          </div>
        </div>

        {/* Highlight Box */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 md:p-10">
          <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <Cpu size={24} /> Mengapa Memilih Proses Lokal?
          </h3>
          <ul className="grid md:grid-cols-2 gap-6 text-emerald-800/80 font-medium">
            <li className="flex gap-3">
              <span className="text-emerald-600">●</span> 
              <span><strong>Kecepatan Tanpa Batas:</strong> Tidak perlu menunggu proses upload dan download.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600">●</span> 
              <span><strong>Hemat Kuota:</strong> Anda hanya memproses data secara lokal tanpa transfer file besar.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600">●</span> 
              <span><strong>Privasi Terjamin:</strong> Bahkan kami sebagai pengembang tidak bisa melihat isi dokumen Anda.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-600">●</span> 
              <span><strong>Keamanan Korporat:</strong> Sangat aman digunakan untuk dokumen perusahaan yang bersifat rahasia.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Core Values (Simple Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32 border-y border-slate-100 py-16">
        {[
          { icon: <Shield className="text-amber-400" size={28} />, title: "Privasi Total", desc: "Data tetap di perangkat Anda." },
          { icon: <Zap className="text-amber-400" size={28} />, title: "Tanpa Iklan", desc: "Fokus pada produktivitas Anda." },
          { icon: <Globe className="text-amber-400" size={28} />, title: "Akses Instan", desc: "Tanpa login, tanpa ribet." },
        ].map((item, i) => (
          <div key={i} className="text-center md:text-left">
            <div className="mb-4 inline-block">{item.icon}</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-slate-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 4. Contact Section - Clean & Modern */}
      <section id="contact" className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Hubungi Kami</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Apakah Anda menemukan kendala atau ingin memberikan saran fitur baru? Kami sangat terbuka untuk berdiskusi dengan Anda.
          </p>
          <div className="space-y-4">
            <a href="mailto:support@pdfcraft.com" className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all">
              <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-amber-400 group-hover:text-white transition-colors">
                <Mail size={20} />
              </div>
              <span className="font-semibold text-slate-700">support@pdfcraft.com</span>
            </a>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Nama</label>
              <input type="text" placeholder="Masukkan nama Anda" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Pesan</label>
              <textarea placeholder="Apa yang bisa kami bantu?" rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"></textarea>
            </div>
            <button className="w-full py-4 bg-slate-900 hover:bg-amber-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-amber-100 cursor-pointer">
              Kirim Sekarang
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}