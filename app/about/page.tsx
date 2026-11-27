import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  Cpu,
  Globe,
  LayoutGrid,
  Lock,
  Mail,
  Plug,
  Rocket,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    title: "Pemrosesan Kilat",
    description:
      "Engine kompresi dan pengolahan cerdas memproses file PDF multi-halaman dalam hitungan detik langsung di browser Anda.",
    icon: Zap,
    iconBg: "bg-[#FFE4E6] text-[#B91C1C]",
  },
  {
    title: "Privasi Tanpa Kompromi",
    description:
      "Berkas Anda tidak pernah dimonetisasi atau dikirim ke server. Seluruh proses berlangsung secara lokal di memori perangkat Anda.",
    icon: Lock,
    iconBg: "bg-[#DCFCE7] text-[#059669]",
  },
  {
    title: "Dukungan Multi-Format",
    description:
      "Mendukung penggabungan, ekstraksi, rotasi, dan kompresi PDF, JPG, PNG, hingga WEBP secara konsisten tanpa merusak tata letak.",
    icon: LayoutGrid,
    iconBg: "bg-[#E0E7FF] text-[#2563EB]",
  },
  {
    title: "Akses Langsung Tanpa Daftar",
    description:
      "Langsung gunakan semua fitur esensial tanpa verifikasi email, tanpa aplikasi tambahan, dan tanpa biaya tersembunyi.",
    icon: Plug,
    iconBg: "bg-[#EFF4FF] text-slate-700",
  },
];

const ARCHITECTURE = [
  {
    title: "Client-Side PDF & Canvas",
    subtitle: "Komputasi sisi klien ultra-cepat",
    badge: "Edge CPU",
    badgeTone: "bg-[#F1F5FF] text-slate-700",
    icon: Cpu,
    iconColor: "text-[#B91C1C]",
  },
  {
    title: "Zero-Upload Architecture",
    subtitle: "Tanpa transfer server, latensi nol",
    badge: "100% Lokal",
    badgeTone: "bg-[#E0E7FF] text-[#1D4ED8]",
    icon: Globe,
    iconColor: "text-[#2563EB]",
  },
  {
    title: "Proteksi Memori Browser",
    subtitle: "Data tetap aman di perangkat Anda",
    badge: "Strict Privacy",
    badgeTone: "bg-[#DCFCE7] text-[#065F46]",
    icon: ShieldCheck,
    iconColor: "text-[#059669]",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6 pb-16 sm:px-6 sm:py-8">
      {/* Hero Card */}
      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs sm:p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F1F5FF] px-3 py-1 text-[11px] font-bold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Versi v2.4.0 • Edisi Lokal &amp; Web
        </span>

        <h1 className="mt-3.5 text-[24px] font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-[28px]">
          DocuFlow: Solusi Cepat, Andal &amp; Aman untuk Segala Kebutuhan Dokumen Anda
        </h1>

        <p className="mt-3 text-[13px] leading-relaxed text-[#64748B]">
          Misi kami adalah mendemokratisasi produktivitas berkas digital. Tanpa unduhan software
          berat, tanpa login rumit—hanya pengolahan PDF dan dokumen gambar yang instan, elegan,
          dan privat.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-[#F4F7FF] p-3 text-center">
            <p className="text-lg font-extrabold tracking-tight text-[#B91C1C] sm:text-xl">4+</p>
            <p className="mt-0.5 text-[10px] font-semibold text-slate-500">Alat PDF Praktis</p>
          </div>
          <div className="rounded-2xl bg-[#F4F7FF] p-3 text-center">
            <p className="text-lg font-extrabold tracking-tight text-[#0F172A] sm:text-xl">100%</p>
            <p className="mt-0.5 text-[10px] font-semibold text-slate-500">Proses Lokal</p>
          </div>
          <div className="rounded-2xl bg-[#F4F7FF] p-3 text-center">
            <p className="text-lg font-extrabold tracking-tight text-[#2563EB] sm:text-xl">Gratis</p>
            <p className="mt-0.5 text-[10px] font-semibold text-slate-500">Tanpa Watermark</p>
          </div>
        </div>
      </section>

      {/* Komitmen Kualitas Card */}
      <section className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xs">
          <Award size={26} className="text-amber-300" />
        </div>
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider text-[#B91C1C] uppercase">
            <CheckCircle2 size={11} /> Komitmen Kualitas
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
            Dirancang dengan presisi demi memastikan alur kerja dokumen Anda tetap cepat, rapi, dan
            terjaga privasinya.
          </p>
        </div>
      </section>

      {/* Fitur Utama & Keunggulan */}
      <section aria-labelledby="fitur-unggulan-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#B91C1C]" />
            <h2
              id="fitur-unggulan-heading"
              className="text-[15px] font-extrabold tracking-tight text-[#0F172A]"
            >
              Fitur Utama &amp; Keunggulan
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Standar Industri</span>
        </div>

        <div className="space-y-2.5">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.iconBg}`}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Arsitektur & Teknologi Canggih */}
      <section className="rounded-3xl bg-[#EFF4FF] p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-[#B91C1C]" />
          <h2 className="text-[15px] font-extrabold tracking-tight text-[#0F172A]">
            Arsitektur &amp; Teknologi Canggih
          </h2>
        </div>
        <p className="mt-1 text-xs text-[#64748B]">
          Infrastruktur modern yang dibangun untuk performa real-time dan keandalan tinggi.
        </p>

        <div className="mt-3.5 space-y-2.5">
          {ARCHITECTURE.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-2xs"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 ${item.iconColor}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-extrabold text-[#0F172A]">{item.title}</p>
                    <p className="truncate text-[11px] text-[#64748B]">{item.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.badgeTone}`}
                >
                  {item.badge}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* DocuFlow Engineering Team */}
      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-sm font-extrabold text-white">
            DF
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-[#0F172A]">DocuFlow Engineering Team</h2>
            <p className="truncate text-[11px] text-[#64748B]">
              Dedikasi untuk utilitas produktivitas bebas hambatan
            </p>
          </div>
        </div>

        <a
          href="mailto:bantuan@docuflow.id"
          className="flex items-center justify-between rounded-xl bg-[#F8FAFF] px-3.5 py-2.5 text-xs font-bold text-[#0F172A] transition-colors hover:bg-[#EFF4FF]"
        >
          <span className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FFE4E6] text-[#B91C1C]">
              <Mail size={14} />
            </span>
            bantuan@docuflow.id
          </span>
          <ArrowRight size={15} className="text-slate-400" />
        </a>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/terms"
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#F4F7FF] text-xs font-bold text-[#0F172A] transition-colors hover:bg-[#E0E7FF]"
          >
            <Code2 size={14} className="text-slate-600" /> Ketentuan
          </Link>
          <Link
            href="/privacy"
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#F4F7FF] text-xs font-bold text-[#0F172A] transition-colors hover:bg-[#E0E7FF]"
          >
            <ShieldCheck size={14} className="text-[#2563EB]" /> Privasi
          </Link>
        </div>
      </section>

      {/* Bottom CTAs */}
      <div className="space-y-2.5">
        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D91B24] px-6 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-colors hover:bg-[#B8141C]"
        >
          <Rocket size={17} /> Mulai Olah Dokumen Sekarang
        </Link>

        <Link
          href="/privacy"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#EFF4FF] px-6 text-xs font-bold text-[#0F172A] transition-colors hover:bg-[#E0E7FF]"
        >
          <ShieldCheck size={16} className="text-emerald-600" /> Lihat Kebijakan Privasi &amp;
          Keamanan
        </Link>
      </div>
    </main>
  );
}
