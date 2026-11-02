# Web Notepad 📝

A clean, fast, multi-tab web notepad built for developers. Works seamlessly offline out of the box using `localStorage` and optionally syncs your notes and open tabs across devices using Firebase Cloud Firestore.

Zero backend required — ready to deploy directly to Vercel with 1 click.

---

## ✨ Features

- **Multi-Tab Workspace**: Open multiple files simultaneously, close tabs, or double-click to rename them.
- **Rich Text & Selective Styling**: Apply text colors, background highlights, bold, italic, underline, custom fonts, and font sizes directly to selected text.
- **Developer Dark Theme**: Built-in VS Code-inspired dark theme with line numbers and a live word/character counter. Easily toggle to classic light mode anytime.
- **Real-Time Cross-Tab Sync**: Seamlessly syncs between multiple open browser tabs using the HTML5 `BroadcastChannel` API.
- **Cloud Backup (Firebase)**: Sign in with email and password to automatically backup and sync your workspace across devices with Firestore.
- **Works 100% Offline**: No account? No problem. Everything persists locally in `localStorage`.
- **Export Options**: Export clean paginated PDFs (`jsPDF`), print directly (`Ctrl+P`), or download as `.txt` / `.json` / `.md`.
- **Keyboard Shortcuts**: Standard shortcuts (`Ctrl+S`, `Ctrl+N`, `Ctrl+O`, `Ctrl+P`, `Ctrl+F`, `Ctrl+B`, `Ctrl+I`, `Ctrl+U`, `F11`, and `Tab` indentation).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, JavaScript / JSX)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth & Database**: [Firebase Auth & Cloud Firestore](https://firebase.google.com/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/web-notepad.git
cd web-notepad
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase (Optional for Cloud Sync)
Create a `.env.local` file in the root directory by copying the example:
```bash
cp .env.local.example .env.local
```

Add your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note:** In your Firebase Console, make sure to enable:
> 1. **Authentication** → Sign-in method → **Email/Password**
> 2. **Firestore Database** → Rules → Set to:
> ```javascript
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /{document=**} {
>       allow read, write: if request.auth != null;
>     }
>   }
> }
> ```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

1. Push this project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit of Web Notepad"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section on Vercel, add the 6 `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local`.
5. Click **Deploy**. Your notepad will be live in seconds!

---

## ⌨️ Shortcuts Cheatsheet

| Shortcut | Action |
| --- | --- |
| `Ctrl / Cmd + N` | Create a new tab |
| `Ctrl / Cmd + O` | Open local file |
| `Ctrl / Cmd + S` | Save document (Local & Cloud) |
| `Ctrl / Cmd + P` | Print document |
| `Ctrl / Cmd + F` | Find & Replace |
| `Ctrl / Cmd + B` | Bold selected text |
| `Ctrl / Cmd + I` | Italicize selected text |
| `Ctrl / Cmd + U` | Underline selected text |
| `Ctrl / Cmd + W` | Close active tab |
| `Tab` | Indent (insert 2 spaces) |
| `F11` | Fullscreen toggle |
| `Double Click Tab` | Rename tab |

---

## 📄 License
MIT License. Feel free to use and customize for your own personal or commercial projects.
