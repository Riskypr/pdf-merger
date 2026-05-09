import { ShieldCheck, EyeOff, ServerOff, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    { 
      title: "Pemrosesan Lokal", 
      icon: <ServerOff className="text-emerald-600" size={24} />,
      content: "Kami menggunakan teknologi client-side (pdf-lib) untuk memproses dokumen Anda. Artinya, file Anda tetap berada di perangkat Anda dan tidak pernah dikirim atau disimpan di server mana pun." 
    },
    { 
      title: "Tanpa Pengumpulan Data", 
      icon: <EyeOff className="text-emerald-600" size={24} />,
      content: "Kami tidak mengumpulkan informasi pribadi, alamat IP, atau metadata dari file PDF yang Anda proses. Privasi Anda adalah prioritas mutlak kami." 
    },
    { 
      title: "Keamanan Maksimal", 
      icon: <Lock className="text-emerald-600" size={24} />,
      content: "Tanpa adanya transfer data ke cloud, risiko kebocoran data menjadi hampir nol. Anda memegang kendali penuh atas file Anda dari awal hingga akhir." 
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Breadcrumb / Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Kembali ke Home
        </Link>

        {/* Header Section */}
        <header className="mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-full">
            Terakhir Diperbarui: 9 Mei 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl">
            Kami percaya bahwa privasi adalah hak asasi. Di <strong>PDFCraft</strong>, kami memastikan dokumen Anda tetap menjadi milik Anda sepenuhnya.
          </p>
        </header>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Detailed Content */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Penjelasan Lebih Lanjut</h2>
            <div className="space-y-10">
              <section>
                <h3 className="text-xl font-bold text-slate-800 mb-3 underline decoration-emerald-200 decoration-4 underline-offset-4">
                  1. Bagaimana Kami Bekerja
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Aplikasi ini berjalan sepenuhnya di browser Anda. Saat Anda memilih file, browser akan membaca data tersebut secara lokal. Kode JavaScript kami memproses penggabungan PDF tanpa melibatkan backend API, sehingga keamanan data Anda terjamin secara teknis.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-800 mb-3 underline decoration-emerald-200 decoration-4 underline-offset-4">
                  2. Cookies dan Pelacakan
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Kami tidak menggunakan cookies pelacak pihak ketiga atau alat analitik yang mengidentifikasi profil pengguna secara individu. Kami hanya peduli pada fungsionalitas alat kami untuk membantu tugas Anda.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-800 mb-3 underline decoration-emerald-200 decoration-4 underline-offset-4">
                  3. Perubahan Kebijakan
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Kami mungkin memperbarui kebijakan ini dari waktu ke waktu untuk mencerminkan perubahan teknologi atau standar hukum. Kami menyarankan Anda untuk memeriksa halaman ini secara berkala.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-slate-500 text-sm italic">
          Punya pertanyaan lebih lanjut? Hubungi kami melalui halaman <Link href="/about" className="text-emerald-600 font-bold hover:underline">About</Link>.
        </div>
      </div>
    </main>
  );
}