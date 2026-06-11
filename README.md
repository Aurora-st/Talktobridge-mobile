# TalkBridge AI

A real-time AI-powered speech translation and conversation assistant.

> **Real-time translation + conversational help**, designed for mobile-first use.

---

## Project Overview

TalkBridge AI helps people communicate across languages by combining:

- **Real-time speech translation**: record speech, translate it, and play translated audio.
- **AI conversation assistance**: generate helpful conversational guidance during multilingual exchanges.
- **Audio recording & playback**: record audio on-device and play translated responses.
- **FastAPI backend integration**: the app uploads audio to a backend service that performs transcription and translation using AI.

### What TalkBridge AI does

1. The user records speech in the mobile app.
2. The app sends the audio to the FastAPI backend.
3. The backend uses **Whisper** (and related AI services) to transcribe and generate translation output.
4. The translated audio is returned and played back in the app.

---

## Features

- **Speech-to-Text** (Whisper-powered backend)
- **AI Translation** (multilingual translation pipeline)
- **Audio Recording** (Expo audio recording)
- **Audio Playback** (play generated/returned audio)
- **Multi-language support**
- **Backend Health Monitoring** (e.g., `/health` checks)
- **Mobile-first UI**
- **Expo SDK 56 support**

---

## Tech Stack

### Frontend

- **React Native**
- **Expo SDK 56**
- **TypeScript**
- **React Navigation**
- **Axios**

### Backend

- **FastAPI**
- **Python**
- **Whisper**
- AI services (translation + optional conversation assistance)

---

## Architecture

```text
Mobile App
   ↓  (HTTP API calls: upload audio, request translation/health)
HTTP API
   ↓
FastAPI Backend
   ↓  (Whisper / AI Services)
Whisper / AI Services
```

---

## Installation

### Frontend (Mobile)

```bash
git clone <repo>
cd talkbridge
npm install
npx expo start
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Configuration

Example API URL:

- `http://YOUR_LOCAL_IP:8000`

> Update the API base URL in the app configuration (the mobile app uses Axios requests to the backend endpoints).

---

## Project Structure

Example (high-level):

```text
.
├─ src/                         # Expo (React Native) mobile app
│  ├─ screens/                  # App screens (Home, Conversation, History, Settings)
│  ├─ components/              # Reusable UI components
│  ├─ services/                # API client, translation service, audio recording service
│  ├─ store/                   # App providers (theme/settings/conversation)
│  └─ navigation/              # React Navigation setup
│
├─ backend/                    # FastAPI backend (Whisper + AI services)
│  ├─ main.py
│  ├─ requirements.txt
│  └─ (other backend modules)
│
└─ assets/                     # App icons/splash assets
```

---

## Development Notes

- **Expo audio migration**: `expo-av` is removed and the project is migrated to **`expo-audio`**.
- **SDK 56 compatible**: the project dependencies target **Expo SDK 56**.
- **expo-doctor passes**: setup is aligned with Expo’s latest checks for SDK 56.

---

## Future Improvements

- Cloud deployment
- User accounts
- More languages
- Voice cloning
- AI conversation memory

---

## Author

**Abhinav Singh**

---

## License

MIT

