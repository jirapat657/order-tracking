import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Logo from "@/components/Logo";

// ฟอนต์ที่รองรับภาษาไทยจริง + display: swap ลดอาการตัวอักษรกระพริบ (CLS)
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ติดตามสถานะออเดอร์ (Order Tracking) | Orderly",
    template: "%s | Orderly",
  },
  description:
    "ตรวจสอบสถานะคำสั่งซื้อของคุณได้ตลอด 24 ชั่วโมง เพียงกรอกหมายเลขออเดอร์ เช่น ORD-2587965432159-458",
  // หน้าเฉพาะบุคคล/ข้อมูลธุรกรรม — ไม่ให้ search engine เก็บ (เหตุผลใน README.md)
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "ติดตามสถานะออเดอร์ | Orderly",
    description: "ตรวจสอบสถานะคำสั่งซื้อของคุณได้ตลอด 24 ชั่วโมง",
    locale: "th_TH",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#A32B27",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body
        className={`${notoSansThai.className} flex min-h-screen flex-col antialiased`}
        // inline style ชนะ globals.css เดิม (body { background: var(--background) }) ในทุกกรณี
        style={{
          backgroundColor: "#fafaf9",
          backgroundImage:
            "linear-gradient(to bottom, #fef2f2 0%, #fafaf9 45%, #fafaf9 100%)",
          color: "#1c1917",
        }}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-red-800 focus:shadow-lg"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>

        <nav
          aria-label="เมนูหลัก"
          className="sticky top-0 z-40 w-full border-b border-red-100/80 bg-white/85 backdrop-blur"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              aria-label="Orderly กลับหน้าแรก"
              className="rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
            >
              <Logo />
            </Link>
          </div>
        </nav>

        <div id="main" className="flex-1">
          {children}
        </div>

        <footer className="border-t border-stone-200/80 bg-white/60">
          <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-stone-600 md:text-left">
            <p>
              มีข้อสงสัยเกี่ยวกับออเดอร์? ติดต่อฝ่ายบริการลูกค้าของเราได้ทุกวัน
            </p>
            <p className="mt-1 text-stone-500">© 2026 Orderly. สงวนลิขสิทธิ์</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
