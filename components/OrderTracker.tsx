"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Package,
  Search,
  SearchX,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types & data                                                               */
/* -------------------------------------------------------------------------- */

type OrderStatus = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "PENDING_PAYMENT";
type TabId = "current" | "past";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
}

type SearchResult =
  | { kind: "found"; order: Order }
  | { kind: "notfound"; id: string };

// Mock Data (ครบทั้ง 4 สถานะ)
const mockOrders: Order[] = [
  { id: "ORD-2587965432159-458", date: "21/08/2026 15:42 น.", status: "IN_PROGRESS" },
  { id: "ORD-5555555555555-222", date: "21/08/2026 11:20 น.", status: "IN_QUEUE" },
  { id: "ORD-1234567890123-111", date: "20/08/2026 10:00 น.", status: "PENDING_PAYMENT" },
  { id: "ORD-9876543210987-999", date: "15/08/2026 09:30 น.", status: "COMPLETED" },
];

const ORDER_PATTERN = /^ORD-\d{13}-\d{3}$/;
const EXAMPLE_ID = "ORD-2587965432159-458";

const TABS: { id: TabId; label: string }[] = [
  { id: "current", label: "ออเดอร์ปัจจุบัน" },
  { id: "past", label: "ออเดอร์ที่ผ่านมา" },
];

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; hint: string; icon: LucideIcon; badge: string; iconWrap: string; accent: string }
> = {
  IN_QUEUE: {
    label: "อยู่ในคิว",
    hint: "ออเดอร์ของคุณอยู่ในคิว เราจะเริ่มดำเนินการตามลำดับ",
    icon: Clock,
    badge: "bg-amber-50 text-amber-900 ring-amber-200",
    iconWrap: "bg-amber-50 text-amber-700",
    accent: "border-l-amber-400",
  },
  IN_PROGRESS: {
    label: "กำลังดำเนินการ",
    hint: "ทีมงานกำลังดำเนินการออเดอร์ของคุณอยู่",
    icon: Package,
    badge: "bg-sky-50 text-sky-900 ring-sky-200",
    iconWrap: "bg-sky-50 text-sky-700",
    accent: "border-l-sky-400",
  },
  COMPLETED: {
    label: "เสร็จสิ้น",
    hint: "ออเดอร์นี้เสร็จสมบูรณ์แล้ว",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    iconWrap: "bg-emerald-50 text-emerald-700",
    accent: "border-l-emerald-400",
  },
  PENDING_PAYMENT: {
    label: "รอชำระเงิน",
    hint: "กรุณาชำระเงินเพื่อให้ออเดอร์เข้าสู่คิวดำเนินการ",
    icon: AlertCircle,
    badge: "bg-red-100 text-red-900 ring-red-300",
    iconWrap: "bg-red-100 text-red-700",
    accent: "border-l-red-600",
  },
};

const STEPS = ["ชำระเงิน", "อยู่ในคิว", "กำลังดำเนินการ", "เสร็จสิ้น"];
const STEP_INDEX: Record<OrderStatus, number> = {
  PENDING_PAYMENT: 0,
  IN_QUEUE: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
};

/* -------------------------------------------------------------------------- */
/* Small presentational components                                            */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, icon: Icon, badge } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${badge}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

function Stepper({ status }: { status: OrderStatus }) {
  const current = STEP_INDEX[status];
  const isCompleted = status === "COMPLETED";

  return (
    <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="ขั้นตอนของออเดอร์">
      {STEPS.map((label, i) => {
        const done = isCompleted || i < current;
        const active = !isCompleted && i === current;
        return (
          <li key={label} className="flex flex-col gap-1.5" aria-current={active ? "step" : undefined}>
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full ${done ? "bg-red-700" : active ? "bg-red-300" : "bg-stone-200"}`}
            />
            <span
              className={`text-xs leading-tight ${done || active ? "font-medium text-stone-800" : "text-stone-500"}`}
            >
              {label}
              <span className="sr-only">{done ? " (เสร็จแล้ว)" : active ? " (ขั้นตอนปัจจุบัน)" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

interface OrderCardProps {
  order: Order;
  copiedId: string | null;
  onCopy: (id: string) => void;
}

function OrderCard({ order, copiedId, onCopy }: OrderCardProps) {
  const { icon: Icon, iconWrap, accent, hint } = STATUS_CONFIG[order.status];
  const copied = copiedId === order.id;

  return (
    <li className={`border-l-4 p-5 transition-colors hover:bg-red-50/30 sm:p-6 ${accent}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`mt-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex ${iconWrap}`}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-all font-mono text-base font-semibold text-stone-900">{order.id}</h3>
              <button
                type="button"
                onClick={() => onCopy(order.id)}
                aria-label={`คัดลอกหมายเลข ${order.id}`}
                title="คัดลอกหมายเลข"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
              {copied && <span className="text-xs font-medium text-emerald-700">คัดลอกแล้ว</span>}
            </div>
            <p className="mt-1 text-sm text-stone-600">วันที่ทำรายการ: {order.date}</p>
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <Stepper status={order.status} />
      <p className="mt-3 text-sm text-stone-600">{hint}</p>
    </li>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-300">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-stone-800">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600">{description}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div role="status" className="animate-pulse p-6">
      <span className="sr-only">กำลังค้นหาออเดอร์...</span>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/5 rounded bg-stone-200" />
          <div className="h-3 w-2/5 rounded bg-stone-200" />
        </div>
        <div className="h-7 w-28 rounded-full bg-stone-200" />
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 rounded-full bg-stone-200" />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

const cardClass = "overflow-hidden rounded-2xl bg-white shadow-lg shadow-red-900/5 ring-1 ring-stone-200/70";

export default function OrderTracker() {
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("current");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  /* ----------------------------- Search handlers ---------------------------- */

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchInput.trim().toUpperCase();
    setSearchInput(value);
    setResult(null);

    if (!value) {
      setSearchError("กรุณากรอกหมายเลขคำสั่งซื้อ");
      return;
    }
    if (!ORDER_PATTERN.test(value)) {
      setSearchError(`รูปแบบไม่ถูกต้อง ตัวอย่าง: ${EXAMPLE_ID}`);
      return;
    }

    setSearchError("");
    setIsLoading(true);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    // จำลองการเรียก API
    searchTimer.current = setTimeout(() => {
      const order = mockOrders.find((o) => o.id === value);
      setResult(order ? { kind: "found", order } : { kind: "notfound", id: value });
      setIsLoading(false);
    }, 800);
  };

  const clearSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearchInput("");
    setSearchError("");
    setResult(null);
    setIsLoading(false);
  };

  /* ------------------------------ Copy handler ------------------------------ */

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setAnnouncement(`คัดลอกหมายเลข ${id} แล้ว`);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopiedId(null);
        setAnnouncement("");
      }, 2000);
    } catch {
      setAnnouncement("คัดลอกไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง");
    }
  };

  /* ------------------------------- Tab handlers ----------------------------- */

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.findIndex((t) => t.id === activeTab);
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;

    e.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const ordersFor = (tab: TabId) =>
    mockOrders.filter((o) => (tab === "current" ? o.status !== "COMPLETED" : o.status === "COMPLETED"));

  const showResultSection = isLoading || result !== null;
  const hasError = searchError !== "";

  return (
    <div className="space-y-8">
      {/* ประกาศผลให้ screen reader (เช่น คัดลอกสำเร็จ) */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* ------------------------------ Search ------------------------------ */}
      <section aria-labelledby="search-heading" className={`${cardClass} p-5 sm:p-7`}>
        <h2 id="search-heading" className="text-lg font-semibold text-stone-900">
          ค้นหาด้วยหมายเลขคำสั่งซื้อ
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <label htmlFor="order-search" className="mb-1.5 block text-sm font-medium text-stone-800">
            หมายเลขคำสั่งซื้อ (Order Numbers){" "}
            <span className="text-red-700" aria-hidden="true">
              *
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-[15px] h-5 w-5 text-stone-400"
                aria-hidden="true"
              />
              <input
                id="order-search"
                name="order"
                type="text"
                required
                autoComplete="off"
                spellCheck={false}
                placeholder={EXAMPLE_ID}
                value={searchInput}
                aria-invalid={hasError}
                aria-describedby={hasError ? "order-error" : "order-help"}
                onChange={(e) => {
                  setSearchInput(e.target.value.toUpperCase());
                  if (hasError) setSearchError("");
                }}
                className={`h-[50px] w-full rounded-xl border bg-white pl-11 pr-10 font-mono text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 sm:text-base ${
                  hasError
                    ? "border-red-500 bg-red-50/40 focus:border-red-600 focus:ring-red-100"
                    : "border-stone-300 focus:border-red-600 focus:ring-red-100"
                }`}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="ล้างข้อความค้นหา"
                  className="absolute right-2 top-[9px] inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              {hasError ? (
                <p id="order-error" role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {searchError}
                </p>
              ) : (
                <p id="order-help" className="mt-2 text-sm text-stone-600">
                  รูปแบบ: <span className="font-mono">ORD-</span> ตามด้วยตัวเลข 13 หลัก - ตัวเลข 3 หลัก (เช่น{" "}
                  <span className="font-mono">{EXAMPLE_ID}</span>)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-red-700 px-8 font-semibold text-white shadow-sm shadow-red-900/20 transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />
                  กำลังค้นหา
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" aria-hidden="true" />
                  ค้นหา
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ---------------------------- Search result ---------------------------- */}
      {showResultSection && (
        <section aria-labelledby="result-heading" className={cardClass}>
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 sm:px-6">
            <h2 id="result-heading" className="text-lg font-semibold text-stone-900">
              ผลการค้นหา
            </h2>
            {!isLoading && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-lg px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
              >
                ล้างผลการค้นหา
              </button>
            )}
          </div>

          {isLoading && <SkeletonCard />}
          {!isLoading && result?.kind === "found" && (
            <ul>
              <OrderCard order={result.order} copiedId={copiedId} onCopy={handleCopy} />
            </ul>
          )}
          {!isLoading && result?.kind === "notfound" && (
            <EmptyState
              icon={SearchX}
              title="ไม่พบหมายเลขคำสั่งซื้อนี้"
              description={`ไม่พบข้อมูลของ ${result.id} กรุณาตรวจสอบหมายเลขอีกครั้ง หรือติดต่อฝ่ายบริการลูกค้า`}
            />
          )}
        </section>
      )}

      {/* ------------------------------ Orders list ----------------------------- */}
      <section aria-labelledby="orders-heading" className={cardClass}>
        <h2 id="orders-heading" className="px-5 pb-1 pt-5 text-lg font-semibold text-stone-900 sm:px-6">
          รายการออเดอร์ของคุณ
        </h2>

        <div role="tablist" aria-label="ประเภทออเดอร์" className="mt-3 flex border-b border-stone-200">
          {TABS.map((tab, i) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`-mb-px flex flex-1 items-center justify-center gap-2 border-b-2 py-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-red-200 md:text-base ${
                  selected
                    ? "border-red-700 bg-red-50/60 text-red-800"
                    : "border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    selected ? "bg-red-700 text-white" : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {ordersFor(tab.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {TABS.map((tab) => {
          const orders = ordersFor(tab.id);
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              tabIndex={0}
              className="focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-red-200"
            >
              {orders.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="ไม่พบรายการออเดอร์"
                  description={
                    tab.id === "current"
                      ? "ตอนนี้ยังไม่มีออเดอร์ที่กำลังดำเนินการ"
                      : "ยังไม่มีออเดอร์ที่เสร็จสิ้น"
                  }
                />
              ) : (
                <ul className="divide-y divide-stone-100">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} copiedId={copiedId} onCopy={handleCopy} />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
