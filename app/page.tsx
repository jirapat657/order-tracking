import { PackageSearch } from "lucide-react";
import OrderTracker from "@/components/OrderTracker";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:pt-14">
      <header className="mb-8 text-center sm:mb-10">
        <span
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 ring-8 ring-red-50"
          aria-hidden="true"
        >
          <PackageSearch className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          ติดตามออเดอร์
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-stone-600">
          กรอกหมายเลขคำสั่งซื้อของคุณเพื่อตรวจสอบสถานะล่าสุด ได้ตลอด 24 ชั่วโมง
        </p>
      </header>

      <OrderTracker />
    </main>
  );
}
