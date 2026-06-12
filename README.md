# Para Ti ❤️ — Interactive Love Letter Experience

A fully static, cinematic love-letter website deployable to **GitHub Pages** in one click.

## ✨ Features

| Feature | Details |
|---|---|
| **Intro screen** | Full-screen dark gradient with floating particles and a pulsing heart button |
| **Cinematic transition** | Heart expands → envelope appears → flap opens → letter rises |
| **Letter screen** | Cream paper with elegant handwritten typography, inner scroll |
| **SongEventEngine** | Fires animated hearts, stars, flowers, sparkles & more at timed song moments |
| **Dynamic background** | Animated gradient + continuous floating particles |
| **Controls** | Play/Pause music · Restart experience · Fullscreen toggle |
| **Keyboard shortcuts** | `Space` – music, `F` – fullscreen, `R` – restart, `Enter` – start |
| **Responsive** | Mobile, tablet & desktop |
| **Accessible** | ARIA labels, focus-visible styles, keyboard navigation |

---

## 🚀 Setup

### 1 · Add the music

Place the song file at:

```
assets/audio/song.mp3
```

The song configured for the experience is **"Congratulations" – Mac Miller**.  
You must supply the audio file yourself (the file is not included for copyright reasons).

An `.ogg` fallback is also supported (`assets/audio/song.ogg`).

### 2 · Personalise the letter

Edit **`data/letter.js`** — change the title, date, greeting, paragraphs, closing and signature without touching any logic code.

### 3 · Adjust song event timing

Edit **`js/song-events.js`** → `songEvents` array.  
Each entry has a `time` (seconds from start), a `type`, and an optional `count`:

```js
{ time: 52, type: 'hearts', count: 15 }
```

Supported types: `hearts` · `stars` · `flowers` · `constellation` · `lights` · `polaroids` · `romantic`

---

## 🌐 Deploy to GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically publishes the site to GitHub Pages on every push to `main`.

**One-time setup:**

1. Go to **Settings → Pages** in your repository.
2. Under *Source*, select **GitHub Actions**.
3. Push to `main` — the workflow handles the rest.

The live URL will be: `https://<your-username>.github.io/<repo-name>/`

---

## 🗂 Project Structure

```
/
├── index.html
├── css/
│   ├── styles.css        – layout, colours, typography, responsive
│   └── animations.css    – all @keyframes & animation helpers
├── js/
│   ├── app.js            – main orchestrator
│   ├── audio-engine.js   – AudioEngine class
│   ├── animation-engine.js – AnimationEngine class
│   └── song-events.js    – SongEventEngine + timed event list
├── data/
│   └── letter.js         – ✏️ edit this to change the letter text
├── assets/
│   ├── audio/            – place song.mp3 here
│   └── images/           – optional additional images
└── .github/
    └── workflows/
        └── deploy.yml    – GitHub Pages auto-deploy
```

---

## 🎨 Colour Palette

| Name | Hex |
|---|---|
| Night | `#0d0815` |
| Deep Purple | `#1a0a2e` |
| Rose | `#e8a0b0` |
| Gold | `#d4af7a` |
| Cream | `#fdf6e3` |
| Lavender | `#b39ddb` |

---

## 📝 Keyboard Shortcuts

| Key | Action |
|---|---|
| `Enter` | Start experience (intro screen) |
| `Space` | Toggle music (letter screen) |
| `F` | Toggle fullscreen |
| `R` | Restart experience |
