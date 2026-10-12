# AdaptLearn AI - Dynamic Learner Modeling & Explainable AI Platform

AdaptLearn AI is an intelligent, accessible adaptive learning platform engineered specifically for neurodiverse learners (such as students with dyslexia). It continuously models learner performance, reading accuracy, response latencies, and modality preferences in real time, leveraging Machine Learning and Explainable AI (XAI / SHAP) to dynamically personalize content modality, difficulty, pacing, and feedback strategies.

---

## 🌟 Key Features

- **Personalized Multimodal Adaptation**: Adapts presentation modes between text, bimodal audio-text, and highlighted text based on learner metrics.
- **Explainable AI (XAI)**: SHAP-based feature importance attribution explaining *why* specific adaptations, modalities, or difficulty adjustments are recommended.
- **Dyslexia-Friendly Interface**: Built with specialized dyslexia-friendly typography (OpenDyslexic), adjustable letter/line spacing, reading speed control, high-contrast mode, and focus overlays.
- **Comprehensive Analytics**: Teacher and researcher portals featuring real-time learning gain metrics, engagement scores, and intervention indicators.
- **Microservice Architecture**: Decoupled Next.js client, Express + Prisma backend API, and Python FastAPI ML engine.

---

## 🏛️ System Architecture

```
                    ┌─────────────────────────┐
                    │    Next.js Frontend     │
                    │       (Port 3000)       │
                    └────────────┬────────────┘
                                 │ HTTP / REST
                                 ▼
                    ┌─────────────────────────┐
                    │   Express.js Backend    │
                    │       (Port 5000)       │
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             │ Internal REST                         │ Prisma ORM
             ▼                                       ▼
┌─────────────────────────┐             ┌─────────────────────────┐
│     FastAPI ML/XAI      │             │     SQLite Database     │
│       (Port 8000)       │             │       (dev.db)          │
└─────────────────────────┘             └─────────────────────────┘
```

- **Frontend (`/frontend`)**: Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend (`/backend`)**: Node.js, Express, TypeScript, Prisma ORM, JWT authentication, bcryptjs, Zod validation.
- **ML & XAI Service (`/ml-service`)**: Python, FastAPI, Uvicorn, Scikit-Learn, XGBoost, SHAP.
- **Shared Types (`/shared`)**: Shared TypeScript typings and contracts.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher
- **Git**

---

### One-Click Startup (Windows)

To launch all services simultaneously:
```cmd
run_all.bat
```

To terminate all running services:
```cmd
stop_all.bat
```

---

### Manual Setup & Execution

#### 1. ML Service (FastAPI)
```bash
cd ml-service
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Health Check & Docs:*
- API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

#### 2. Backend API (Express + Prisma)
```bash
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```
*Health Check:*
- API Endpoint: [http://localhost:5000/api](http://localhost:5000/api)
- Health: [http://localhost:5000/health](http://localhost:5000/health)

#### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Access the Web Application:*
- Web Portal: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing & Verification

1. **Verify Backend**:
   ```bash
   curl http://localhost:5000/health
   ```
2. **Verify ML Service**:
   ```bash
   curl http://127.0.0.1:8000/health
   ```
3. **Verify Frontend**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📄 License
This project is developed as an academic capstone project.
