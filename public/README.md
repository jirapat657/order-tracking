# Order Tracking

หน้าติดตามสถานะออเดอร์ (Next.js App Router + TypeScript + Tailwind CSS + lucide-react)

## วิธีรันโปรเจกต์

ต้องมี Node.js 18.18 ขึ้นไป

```bash
npm install
npm install lucide-react   # ถ้ายังไม่มีในโปรเจกต์
npm run dev                # เปิด http://localhost:3000
```

คำสั่งอื่น: `npm run build` (ตรวจ build สำหรับ production) และ `npm run start`

## Figma และ Live Demo

- Figma: https://www.figma.com/design/Fi3KBUSc6g48MjhvD0xrCA (หน้า "Design System" = Variables/Text Styles/Components, หน้า "Order Tracking" = Desktop 1440, Mobile 390 และ State ต่าง ๆ)
- Live Demo: _(ใส่ลิงก์ Vercel/Netlify ถ้ามี)_

## ปัญหาที่เจอและวิธีแก้

| ปัญหา | วิธีแก้ |
| --- | --- |
| `globals.css` ของเทมเพลต Next.js กำหนดพื้นหลังตามโหมดมืดของเครื่อง และชนะคลาส Tailwind ทำให้หน้ามืดและข้อความอ่านไม่ออก | ล็อกเป็นโหมดสว่างใน `globals.css` (`color-scheme: light`) และเอากฎ `body` ออก |
| ฟอนต์ Inter ไม่รองรับภาษาไทย | ใช้ `Noto Sans Thai` ผ่าน `next/font` (`subsets: ["thai", "latin"]`) |
| ผู้ใช้อาจพิมพ์ตัวพิมพ์เล็กหรือมีช่องว่าง | `trim()` และ `toUpperCase()` ก่อน validate |
| `navigator.clipboard` อาจใช้ไม่ได้บางบริบท | ใช้ `try/catch` และแจ้งผลผ่าน `aria-live` |

## ไฟล์ในชุดนี้

| ไฟล์ | หน้าที่ |
| --- | --- |
| `app/layout.tsx` | ฟอนต์ไทย, metadata/SEO, navbar (โลโก้), footer |
| `app/page.tsx` | หัวข้อหลัก (H1) และ `<main>` |
| `components/OrderTracker.tsx` | ค้นหา, แท็บ, รายการออเดอร์, Status Badge, Loading/Empty/Error |
| `components/Logo.tsx` | โลโก้ (`LogoMark` และ `Logo` lockup) |
| `app/icon.svg` | favicon (Next.js ใช้ให้อัตโนมัติ) |
| `public/logo.svg` | ไฟล์โลโก้แยก สำหรับนำไปใช้ที่อื่น |

> ชื่อแบรนด์ "Orderly" เป็นชื่อสมมติ แก้ได้ที่ `components/Logo.tsx`, `app/layout.tsx` และ `public/logo.svg`
> ต้องมีแพ็กเกจ `lucide-react` (`npm i lucide-react`)

## การออกแบบ

- โทนสีแดงนุ่ม (`red-700` เป็นสีหลัก, พื้นหลัง `red-50`) คู่กับเทาอมน้ำตาล (`stone`) เพื่อไม่ให้แสบตา
- สถานะใช้สีต่างจากสีแบรนด์เพื่อแยกง่าย: อยู่ในคิว = เหลือง, กำลังดำเนินการ = ฟ้า, เสร็จสิ้น = เขียว, รอชำระเงิน = แดงเข้ม
  (ทุกสถานะมีไอคอนและข้อความกำกับ ไม่พึ่งสีอย่างเดียว)
- ข้อมูลออเดอร์เป็น mock data ใน `OrderTracker.tsx` ให้เปลี่ยนเป็นการเรียก API จริงที่ `handleSubmit`

## การปรับ SEO และเหตุผล

| จุดที่ปรับ | เหตุผล |
| --- | --- |
| `<title>` และ `meta description` เฉพาะหน้า (มี title template) | ให้ผู้ใช้และแอปแชร์ลิงก์ (LINE, Facebook) เห็นหัวข้อที่สื่อความหมาย |
| `<html lang="th">` | ให้ browser/screen reader/เครื่องมือค้นหารู้ภาษาของหน้า |
| Semantic HTML: `nav`, `main`, `section`, `header`, `footer`, `form`, `button` | ช่วยให้เครื่องมืออ่านหน้าเว็บเข้าใจโครงสร้างและช่วย accessibility |
| ลำดับ Heading: H1 (ติดตามออเดอร์) → H2 (แต่ละส่วน) → H3 (เลขออเดอร์) | โครงสร้างเนื้อหาเป็นระบบ ไม่ข้ามระดับ |
| แท็บใช้ `role="tablist/tab/tabpanel"` และรองรับปุ่มลูกศร | ใช้งานด้วยคีย์บอร์ดและ screen reader ได้ถูกต้อง |
| `aria-label` บน `nav`, ปุ่ม icon; `aria-hidden` บนรูปตกแต่ง | รูปที่ไม่มีความหมายไม่รบกวน screen reader ส่วนโลโก้อ่านชื่อแบรนด์จากลิงก์ |
| `public/logo.svg` มี `<title>` | รูปที่มีความหมายมีข้อความทดแทน |
| ฟอนต์ `Noto Sans Thai` ผ่าน `next/font` + `display: swap` | โหลดแบบ self-host ไม่เพิ่ม request ภายนอก ลดตัวอักษรกระพริบ (CLS) |
| โลโก้/ไอคอนเป็น SVG inline และ favicon เป็น SVG | ไฟล์เล็ก ไม่มีรูปแรสเตอร์ จึงไม่กระทบเวลาโหลด |
| ลิงก์ "ข้ามไปยังเนื้อหาหลัก" | ช่วยผู้ใช้คีย์บอร์ดและ screen reader |

## หน้านี้ควรให้ Search Engine Index หรือไม่

**ไม่ควร** จึงตั้ง `robots: { index: false, follow: false }` ไว้ใน `layout.tsx`

- เป็นหน้าเฉพาะบุคคลและเกี่ยวกับธุรกรรม หมายเลขออเดอร์เป็นข้อมูลส่วนตัวที่ไม่ควรไปปรากฏในผลการค้นหา
- ไม่มีเนื้อหาสาธารณะที่คนจะค้นหาจาก Google ผู้ใช้เข้าหน้านี้จากอีเมล ลิงก์ในแชต หรือเว็บหลักอยู่แล้ว
- เนื้อหามีน้อย (thin content) การ index อาจทำให้คุณภาพโดยรวมของเว็บดูลดลงและเปลืองงบการ crawl

ข้อควรระวัง:

- **อย่าใส่ `Disallow` ของหน้านี้ใน `robots.txt`** เพราะบอทจะไม่เข้ามาอ่านแท็ก `noindex` และอาจยังแสดง URL ในผลการค้นหาได้
- ไม่ต้องใส่หน้านี้ใน `sitemap.xml`
- หน้า Landing หลักของบริษัทค่อยทำ SEO แบบ index ตามปกติ
