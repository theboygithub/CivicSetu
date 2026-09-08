# CivicSetu — Civic Problem to University Solver

A clean, modern, professional platform connecting real-world community problems with top engineering colleges and universities equipped to solve them.

---

## 🚀 Key Features & Flow

**Upload Problem → AI Analysis → Required Expertise → Find Institutions → Best Matches**

1. **Home Screen (`/`)**:
   - Clean civic overview
   - "Report a Problem" primary action
   - 1-Click Evaluation Presets (Broken Handpump, Clogged Drainage, Solar Streetlight, Potholes)

2. **Report Problem Screen**:
   - Drag & drop or camera photo upload with instant preview
   - Problem description input
   - Location selector with GPS auto-detect & regional suggestions
   - "Analyze Problem" trigger

3. **AI Analysis Screen**:
   - Problem diagnosis title
   - Category badge (Water Management, Civil Infrastructure, etc.)
   - Urgency & Severity indicator (Critical, High, Medium)
   - Required engineering & academic skills (Water Resources, Mechanical Engineering, IoT, Rural Infrastructure)
   - Actionable solution & innovation pathways
   - "Find Institutions" action

4. **Institution Results Screen**:
   - Ranked matching colleges (e.g., **NIT Jamshedpur — 94% Match**, **BIT Mesra — 88% Match**, **IIT Kharagpur — 85% Match**)
   - "Why they match" rationale bullet points
   - State and department filtering
   - "View Details" action

5. **Institution Details Screen**:
   - Institution name, NIRF rank, and type
   - Relevant departments & centers
   - Technical expertise tags
   - Specialized research areas & active laboratories
   - Match fit breakdown (Domain Relevance, Department Fit, Research & Labs, Proximity)
   - "Dispatch Problem Brief" collaboration trigger

---

## 🛠️ Technology Stack

- **Backend**: Node.js (JavaScript) + Express
- **Frontend**: React (JavaScript) + Vite + Tailwind CSS + Lucide Icons
- **AI Engine**: OpenRouter LLM integration with intelligent mock fallback

---

## ⚙️ Configuration & OpenRouter Setup

Open the backend environment file:
```bash
backend/.env
```

You will see:
```env
PORT=5000
OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

- **Without API Key**: The system automatically uses an intelligent domain-aware mock analysis engine that reproduces the exact hackathon prompt examples (e.g. handpump -> NIT Jamshedpur 94%, BIT Mesra 88%).
- **With API Key**: Simply paste your key into `OPENROUTER_API_KEY` and save. The backend will immediately start making live multimodal vision/text requests to OpenRouter!

---

## 🏃 Quick Start Guide

### 1. Start the Backend Server:
```bash
cd backend
npm install
node server.js
```
The backend starts at `http://localhost:5000`.

### 2. Start the Frontend App:
```bash
cd frontend
npm install
npm run dev
```
The React frontend starts at `http://localhost:3000` (or `http://localhost:5173`).

---

## 📋 Evaluation Example

1. Open the app and click **"Report a Problem"** (or click the **Broken Community Handpump** preset card).
2. Enter: *"This handpump has not worked for two months."* with location *"Jamshedpur, Jharkhand"*.
3. Click **"Analyze Problem"**.
4. Review the AI diagnosis:
   - **Problem:** Broken public handpump
   - **Category:** Water Management
   - **Severity:** High
   - **Required expertise:** Water Resources, Mechanical Engineering, IoT, Rural Infrastructure
5. Click **"Find Institutions"** to see:
   - **NIT Jamshedpur — 94% Match**
   - **BIT Mesra — 88% Match**
   - **IIT Kharagpur — 85% Match**
6. Click **"View Details"** to inspect departments, active labs, and match breakdown metrics.
