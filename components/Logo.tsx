type LogoMarkProps = {
  className?: string;
};

/**
 * สัญลักษณ์โลโก้: กล่องพัสดุ 3 มิติ + เครื่องหมายถูก (ติดตามจนเสร็จสิ้น)
 * เป็นรูปตกแต่ง จึงซ่อนจาก screen reader (aria-hidden) — ชื่อแบรนด์อ่านจากข้อความข้าง ๆ แทน
 */
export function LogoMark({ className = "h-10 w-10" }: LogoMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="orderly-logo-bg" x1="6" y1="2" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D1493F" />
          <stop offset="1" stopColor="#A32B27" />
        </linearGradient>
      </defs>

      {/* พื้นหลังสี่เหลี่ยมมุมมน */}
      <rect width="48" height="48" rx="13" fill="url(#orderly-logo-bg)" />

      {/* กล่องพัสดุ (isometric) */}
      <path d="M22 9 35 16.5 22 24 9 16.5Z" fill="#FFFFFF" />
      <path d="M9 16.5 22 24V38L9 30.5Z" fill="#FFFFFF" fillOpacity="0.82" />
      <path d="M35 16.5 22 24V38L35 30.5Z" fill="#FFFFFF" fillOpacity="0.6" />
      {/* เทปกล่อง */}
      <path d="M15.5 12.75 28.5 20.25" stroke="#D1493F" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />

      {/* ป้ายเครื่องหมายถูก */}
      <circle cx="36" cy="35" r="8" fill="#FFFFFF" />
      <circle cx="36" cy="35" r="6.25" fill="#A32B27" />
      <path d="m32.9 35.2 2.1 2.1 4.1-4.3" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type LogoProps = {
  /** แสดงข้อความ tagline ใต้ชื่อแบรนด์ */
  showTagline?: boolean;
  className?: string;
};

/** Logo lockup: สัญลักษณ์ + ชื่อแบรนด์ (เปลี่ยนชื่อ "Orderly" เป็นชื่อบริษัทจริงได้ที่นี่ที่เดียว) */
export default function Logo({ showTagline = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-stone-900">
          Order<span className="text-red-700">ly</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[11px] font-medium text-stone-500">ติดตามออเดอร์ง่าย ๆ</span>
        )}
      </span>
    </span>
  );
}
