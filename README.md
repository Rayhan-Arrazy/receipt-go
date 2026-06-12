# ReceiptGo 🧾✨

> **AI-Powered Receipt Scanner & Expense Tracker** — Upload receipt photos and let Google Gemini automatically extract all the data.

![ReceiptGo](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase) ![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google)

## ✨ Features

- 📷 **Upload receipt images** (JPEG, PNG, WebP) via drag-and-drop or file picker
- 🤖 **Automatic AI extraction** — Google Gemini 1.5 Flash reads store name, amount, date, and category
- ✏️ **Review & edit** — AI pre-fills the form, you can correct anything before saving
- 🗃️ **Receipt dashboard** — Grid/list view with search and category filter
- 📊 **Spending analytics** — Monthly bar chart + category donut chart with Recharts
- 🗑️ **Delete receipts** — With confirmation dialog
- 🌐 **Multi-currency** — USD, EUR, GBP, IDR, JPY, SGD, AUD, CAD

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript + React 19 |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| Database | PostgreSQL via Supabase |
| Image Storage | Supabase Storage |
| AI Extraction | Google Gemini 1.5 Flash Vision |
| Charts | Recharts |
| ORM | Prisma 7 |

## 🚀 Setup

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Supabase PostgreSQL (from Supabase Dashboard → Settings → Database)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase (from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Google Gemini AI (from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Supabase Storage Setup

In your Supabase dashboard:
1. Go to **Storage** → Create a bucket called `receipts`
2. Set it to **Public**
3. Add an RLS policy to allow uploads (or set to public for dev)

### 4. Database Migration

```bash
npx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── extract/route.ts    # Gemini AI extraction endpoint
│   │   └── receipts/
│   │       ├── route.ts        # GET all, POST create
│   │       └── [id]/route.ts   # GET one, DELETE one
│   ├── upload/page.tsx         # Upload & extraction page
│   ├── page.tsx                # Dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── image-uploader.tsx      # Drag & drop with AI trigger
│   ├── receipt-form.tsx        # Form with AI pre-fill
│   ├── receipt-card.tsx        # Receipt display card
│   ├── receipt-list.tsx        # Filterable receipt grid
│   └── spending-charts.tsx     # Recharts visualizations
└── lib/
    ├── prisma.ts               # Prisma client singleton
    ├── supabase.ts             # Supabase storage helpers
    ├── gemini.ts               # Google Gemini Vision extraction
    └── constants.ts            # Categories, formatting utils
```

## 🎨 Design

- Dark glassmorphism aesthetic with violet/indigo accents
- Smooth hover animations and micro-interactions
- Mobile-responsive layout
- Drag-and-drop image upload with progress feedback
