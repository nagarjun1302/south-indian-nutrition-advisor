# NutriWise South — Smart South Indian AI Nutrition Advisor

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.1_Flash-4285F4?logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_|_Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Deployed on Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white)](https://render.com/)

**NutriWise South** is a full-stack, AI-powered nutrition advisor and meal tracking platform specifically engineered for **South Indian cuisine**. Built with React 19, FastAPI, LangGraph, Google Gemini LLMs, and Supabase, it translates traditional South Indian meals into detailed nutritional breakdowns, glycemic risk assessments, and practical, culturally appropriate ingredient swaps for managing condition-specific health goals (such as Type 2 Diabetes, Hypertension, and High Cholesterol).

---

## 🌟 Key Features

* 🥗 **South Indian Food Intelligence**: Trained on regional South Indian culinary data (Idli, Masala Dosa, Sambar, Rasam, Pongal, Vada, Chutney, Parotta, Curd Rice).
* 🤖 **AI-Driven Ingredient Analysis**: Uses Google Gemini to deconstruct dishes, estimate hidden cooking fats/oils, and assess glycemic impact.
* 💡 **Millet & Legume Swap Engine**: Generates actionable, culturally sensitive modifications (e.g. replacing white rice batter with Foxtail Millet/Thinai, Ragi, or Pesarattu).
* 📊 **Live Macro & Calorie Dashboard**: Real-time calorie rings, macro ratio graphs, and active tracking streaks.
* 🔐 **Secure Supabase Auth & Database**: Google OAuth + Email authentication with Row Level Security (RLS) policies protecting user profiles and meal logs.
* 📧 **Automated HTML Email Reports**: Delivers personalized nutrition summaries to patient inboxes via official Gmail REST API over HTTPS.
* 📈 **Real-Time Streak & History Tracking**: Automatically computes consecutive daily logging streaks from authenticated database logs.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Dark/Light modern SaaS layout
- **Icons**: Lucide React (`HeartPulse`, `Utensils`, `Activity`, `Sparkles`)
- **Authentication & DB SDK**: `@supabase/supabase-js`

### Backend
- **Framework**: Python 3.10+ with FastAPI & Uvicorn
- **AI Orchestration**: LangGraph, LangChain, Google Gemini API (`ChatGoogleGenerativeAI`)
- **Email Delivery**: Official Gmail REST API over HTTPS (`google.oauth2`, `requests`)

### Database & Deployment
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render

---

## 📁 Repository Structure

```text
south-indian-nutrition-advisor/
├── backend/
│   ├── api.py                    # FastAPI routes (/health, /analyze)
│   └── nutrition_advisor.py      # LangGraph state workflow & Gemini prompts
├── frontend/
│   ├── src/
│   │   ├── components/           # Dashboard, Sidebar, Navbar, Analyzer, History
│   │   ├── services/             # api.js & supabaseService.js
│   │   ├── supabaseClient.js     # Supabase initialization & OAuth helpers
│   │   ├── App.jsx               # Main React SPA entry point
│   │   └── index.css             # Core CSS design system
│   ├── index.html
│   └── vite.config.js
├── ingredient_analyzer.py        # Gemini South Indian ingredient analyzer
├── messaging_service.py          # Email delivery engine (Gmail REST API)
├── requirements.txt              # Backend Python dependencies
├── README.md                     # Documentation
└── .gitignore                    # Environment & build exclusions
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
- **Supabase Project** (from [Supabase Console](https://supabase.com/))

---

### 2. Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/south-indian-nutrition-advisor.git
   cd south-indian-nutrition-advisor
   ```

2. **Create & activate a Python virtual environment**:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1   # On Windows
   # source .venv/bin/activate    # On Linux/macOS
   ```

3. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file in the root directory**:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash-lite
   SMTP_EMAIL=your.email@gmail.com
   GMAIL_CLIENT_ID=your_google_client_id
   GMAIL_CLIENT_SECRET=your_google_client_secret
   GMAIL_REFRESH_TOKEN=your_google_refresh_token
   ```

5. **Start the FastAPI backend server**:
   ```bash
   python -m uvicorn backend.api:app --reload --port 8000
   ```
   > Backend live at: `http://localhost:8000` | Docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   > Frontend live at: `http://localhost:5173`

---

## 🗄️ Database Setup (Supabase SQL)

To create the required database tables and security policies in Supabase, run the following script in your **Supabase SQL Editor**:

```sql
-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  age TEXT,
  gender TEXT,
  target_weight TEXT,
  diet_pref TEXT,
  health_goals JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create MEAL_LOGS Table
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_id TEXT,
  patient_name TEXT,
  meal_time TEXT,
  food_items JSONB DEFAULT '[]'::jsonb,
  medical_conditions JSONB DEFAULT '[]'::jsonb,
  nutritional_breakdown JSONB DEFAULT '{}'::jsonb,
  detailed_recommendations JSONB DEFAULT '[]'::jsonb,
  ingredient_modifications JSONB DEFAULT '{}'::jsonb,
  message_sent BOOLEAN DEFAULT false,
  positive_notes JSONB DEFAULT '[]'::jsonb,
  general_tips JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users access own meal logs" ON public.meal_logs FOR ALL USING (auth.uid() = user_id);
```

---

## 🌐 Production Deployment

- **Backend (Render)**: Deployed as a Python Web Service running `uvicorn backend.api:app --host 0.0.0.0 --port $PORT`.
- **Frontend (Vercel)**: Deployed as a Vite SPA with `VITE_API_URL` pointing to the Render backend service.

---

