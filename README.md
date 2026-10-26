# 🌱 PlantPulse.AI — Smart Plant Health & Disease Pathology

PlantPulse.AI is a full-stack agronomic diagnostic application featuring a React 19 frontend and a Python FastAPI backend powered by Google Gemini Vision AI.

---

## 🏗️ Architecture & Project Structure

```
plantpulse/
├── backend/                        # Python FastAPI Backend
│   ├── .env                        # Secure backend environment variables
│   ├── config.py                   # Configuration and key management
│   ├── main.py                     # FastAPI app with CORS & router integration
│   ├── requirements.txt            # Python dependencies
│   ├── run.py                      # Standalone runner for FastAPI server
│   ├── routes/
│   │   ├── health.py               # GET /health, /api/health, /api/gemini/health
│   │   └── analyze.py              # POST /api/analyze (Image upload & diagnosis)
│   └── services/
│       └── gemini_service.py       # Gemini Vision AI prompt engineering & validation
├── src/                            # React 19 + Tailwind CSS v4 Frontend
│   ├── components/                 # UI Components (Header, Scanner, Crop Cards, etc.)
│   ├── utils/                      # AI Vision client & validation helpers
│   ├── App.jsx                     # Root application container
│   └── main.jsx                    # Vite entry point
├── public/                         # Static assets
├── vite.config.js                  # Vite dev server configuration (Port 9091)
├── package.json                    # Frontend dependencies
└── start-plantpulse.bat            # One-click Windows startup script
```

---

## ⚡ Quick Start (Windows)

Double click or run `start-plantpulse.bat`:
```powershell
.\start-plantpulse.bat
```
This automatically starts:
- **FastAPI Backend**: `http://localhost:5000`
- **Vite Frontend**: `http://localhost:9091`

---

## 🛠️ Manual Installation & Startup

### 1. Backend (Python FastAPI)
1. **Navigate to the backend folder**:
   ```powershell
   cd backend
   ```
2. **Install Python dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```
3. **Configure your Gemini API Key**:
   Edit `backend/.env` and add your free Google AI Studio API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   PORT=5000
   HOST=0.0.0.0
   ```
4. **Start the FastAPI backend server**:
   ```powershell
   python run.py
   # Or using uvicorn directly:
   uvicorn backend.main:app --host 0.0.0.0 --port 5000 --reload
   ```

### 2. Frontend (React 19 + Vite)
1. **In the root folder**:
   ```powershell
   npm install
   ```
2. **Start Vite development server**:
   ```powershell
   npm run dev
   ```
3. **Open in browser**:
   Navigate to [http://localhost:9091](http://localhost:9091).

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health-check endpoint verifying backend status |
| `GET` | `/api/health` | Health verification endpoint for frontend indicator |
| `GET` | `/api/gemini/health` | Checks if Gemini API key is configured |
| `POST` | `/api/gemini/test` | Verifies active connection to Gemini Vision model |
| `POST` | `/api/analyze` | Accepts leaf image (`multipart/form-data`) & returns AI diagnosis |
| `POST` | `/api/save-key` | Securely stores API key in backend `.env` |

---

## 🔒 Security
The Google Gemini API key is stored exclusively in `backend/.env` and accessed server-side. It is never bundled into client-side JavaScript or exposed in public code.
