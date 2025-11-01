# Cluely Desktop 🖥️✨

A powerful desktop AI assistant powered by Google's Gemini AI. Built with Electron, React, TypeScript, and Tailwind CSS. Features screenshot capture with AI analysis, always-on-top floating window, and global hotkeys for instant access.

![Cluely Desktop](https://img.shields.io/badge/Electron-33.2-blue?logo=electron) ![React](https://img.shields.io/badge/React-19.1-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)

## ✨ Features

### 🖥️ Desktop App Features
- **📸 Screenshot Capture**: Capture your screen with `Cmd/Ctrl+H` and analyze with AI
- **🪟 Always-on-Top Window**: Floating, transparent window that stays above all apps
- **⌨️ Global Hotkeys**: Access from anywhere with keyboard shortcuts
- **🎯 System Tray**: Run in background with system tray integration
- **🔄 Cross-Platform**: Works on macOS, Windows, and Linux
- **🎪 Draggable & Resizable**: Customize window position and size

### 🤖 AI Features
- **🧠 Gemini AI Integration**: Chat with Google's Gemini 2.0 Flash Experimental model
- **👁️ Vision Analysis**: Analyze screenshots, images, and visual content with AI
- **💬 Contextual Chat**: Maintains conversation context across messages
- **📝 Markdown Rendering**: Full support for formatted text, code blocks, and lists
- **⚡ Real-time Responses**: Fast, streaming AI responses

### 🎨 UI Features
- **✨ Beautiful Modern UI**: Clean interface with gradient backgrounds
- **🌓 Theme Support**: Light and dark themes
- **👁️ Focus Mode**: Distraction-free conversation mode
- **📊 Tabbed Interface**: Chat, Screenshots, and Transcript tabs
- **🎭 Animations**: Smooth transitions with Framer Motion
- **🔐 Secure Storage**: API key stored locally on your machine

## 🚀 Getting Started

### Prerequisites

- **Node.js 16+** installed on your machine
- **A Google Gemini API key** ([Get one free here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cluely-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the desktop app**
   ```bash
   npm start
   ```

   This will:
   - Start the Vite dev server on port 5180
   - Launch the Electron app
   - Open the floating window

4. **Set up your API key**
   - Click the Settings icon (⚙️) in the window
   - Paste your Gemini API key
   - Click "Save Changes"

## ⌨️ Keyboard Shortcuts

### Global Shortcuts (Work anywhere, even when app is hidden)
- `Cmd/Ctrl + Shift + Space` - Show and center the window
- `Cmd/Ctrl + H` - Take screenshot
- `Cmd/Ctrl + B` - Toggle window visibility
- `Cmd/Ctrl + R` - Clear all screenshots and reset
- `Cmd/Ctrl + Arrow Keys` - Move window position

### In-App Shortcuts
- `Enter` - Send message
- `Shift + Enter` - New line in message
- `Escape` - Close modals

## 📸 Screenshot Feature

1. **Capture Screenshot**:
   - Press `Cmd/Ctrl + H` anywhere on your system
   - The window briefly hides to capture your full screen
   - Screenshot is automatically added to the Screenshots tab

2. **Analyze Screenshots**:
   - Go to the **Screenshots** tab
   - Select one or more screenshots by clicking them
   - Add an optional prompt (e.g., "What's in this image?")
   - Click "Analyze Selected"
   - AI analysis appears in the Chat tab

3. **Manage Screenshots**:
   - Hover over any screenshot and click X to delete
   - Click "Clear All Screenshots" to remove everything
   - Maximum 10 screenshots stored at a time

## 🎯 Usage Tips

### For Meetings & Presentations
- Keep the window visible in Focus Mode during calls
- Capture slides or shared screens with `Cmd/Ctrl+H`
- Ask AI for quick explanations or context

### For Development
- Capture error messages and get instant solutions
- Screenshot code and ask for explanations
- Debug with AI-powered visual analysis

### For Learning
- Capture diagrams, charts, or documents
- Get instant explanations and summaries
- Ask follow-up questions in the chat

## 🛠️ Tech Stack

### Desktop Framework
- **Electron 33.2**: Cross-platform desktop app framework
- **screenshot-desktop**: Native screenshot capture
- **Sharp**: Image processing

### Frontend
- **React 19.1**: UI framework
- **TypeScript 5.9**: Type safety
- **Vite 7.1**: Fast build tool
- **Tailwind CSS 3.4**: Utility-first styling
- **Framer Motion 12**: Smooth animations
- **react-draggable**: Draggable windows
- **react-markdown**: Markdown rendering

### AI Integration
- **@google/generative-ai**: Gemini API SDK
- **Gemini 2.0 Flash Experimental**: Latest AI model with vision

## 📁 Project Structure

```
cluely-desktop/
├── electron/                      # Electron main process
│   ├── main.ts                   # App entry point & state management
│   ├── WindowHelper.ts           # Window management (always-on-top, etc.)
│   ├── ScreenshotHelper.ts       # Screenshot capture & queue
│   ├── LLMHelper.ts              # Gemini AI integration
│   ├── ShortcutsHelper.ts        # Global keyboard shortcuts
│   ├── ipcHandlers.ts            # IPC communication handlers
│   ├── preload.ts                # Secure renderer bridge
│   └── tsconfig.json             # TypeScript config for Electron
│
├── src/                          # React renderer process
│   ├── components/
│   │   ├── chat/                 # Chat UI components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Toolbar.tsx
│   │   ├── ScreenshotGallery.tsx # Screenshot management UI
│   │   ├── ChatOverlay.tsx       # Main draggable chat window
│   │   ├── Dashboard.tsx         # Landing dashboard
│   │   └── ui/                   # Reusable UI components
│   ├── hooks/
│   │   └── useGeminiChat.ts      # Chat state management hook
│   ├── services/
│   │   └── gemini.ts             # Gemini API service
│   ├── types/
│   │   ├── chat.ts               # Chat type definitions
│   │   └── electron.d.ts         # Electron API types
│   ├── lib/
│   │   ├── utils.ts              # Utility functions
│   │   └── storage.ts            # LocalStorage helpers
│   ├── pages/
│   │   └── AppLayout.tsx         # Main app layout
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
│
├── dist/                         # Vite build output
├── dist-electron/                # Compiled Electron code
├── release/                      # Built desktop apps
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite configuration
└── tsconfig.json                 # TypeScript configuration
```

## 📦 Building for Production

### Build Desktop App
```bash
npm run dist
```

This creates platform-specific installers in the `release/` folder:
- **macOS**: `.dmg` installer
- **Windows**: `.exe` installer (NSIS) and portable `.exe`
- **Linux**: `.AppImage` and `.deb` packages

### Web Version
```bash
npm run build
```

Builds a web-only version (without Electron features) to `dist/` folder.

## 🔒 Privacy & Security

- **Local Storage**: Your API key is stored locally on your machine
- **No Backend**: Direct communication with Gemini API only
- **Screenshot Privacy**: Screenshots are stored temporarily and can be cleared anytime
- **No Analytics**: No tracking or data collection
- **Secure IPC**: Context isolation and sandboxed renderer process

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Make sure you copied the entire key without extra spaces
- Check that the key has not expired

### Screenshot Not Working
- Make sure you granted screen recording permissions (macOS)
- Try restarting the app
- Check that no other screenshot tool is capturing the same hotkey

### Window Not Showing
- Press `Cmd/Ctrl + Shift + Space` to center and show
- Check system tray for the app icon
- Try quitting and restarting: `Cmd/Ctrl + Q`

### Installation Issues
If npm install fails with Sharp or Electron errors:
```bash
# Try with specific flags
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --ignore-scripts
npm rebuild sharp
npm rebuild electron
```

### Port Already in Use
If port 5180 is already in use:
```bash
# Find and kill the process
lsof -i :5180
kill [PID]

# Then restart
npm start
```

## 🎨 Customization

### Changing Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* Customize more variables */
}
```

### Modifying Shortcuts
Edit `electron/ShortcutsHelper.ts` to change global shortcuts:
```typescript
globalShortcut.register("CommandOrControl+H", async () => {
  // Your custom screenshot logic
});
```

### Window Size & Position
Edit `electron/WindowHelper.ts` to change default window settings:
```typescript
const windowSettings = {
  width: 450,  // Change width
  height: 700, // Change height
  // More options...
};
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain the existing code style
- Add comments for complex logic
- Test on all platforms when possible

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Inspired by**: [Free Cluely](https://github.com/Prat011/free-cluely) - Open source Cluely implementation
- **Built with**: [React](https://react.dev/), [Electron](https://www.electronjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Powered by**: [Google Gemini AI](https://ai.google.dev/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Design**: Inspired by modern chat interfaces and productivity tools

## 📞 Support

If you encounter any issues or have questions:
- 🐛 [Open an issue](https://github.com/yourusername/cluely-desktop/issues)
- 💬 Start a discussion in the repository
- 📧 Contact the maintainers

## 🌟 Star History

If Cluely Desktop helps you, please consider giving it a star! ⭐

---

**Made with ❤️ by the Cluely community**

*Empowering productivity with AI-powered desktop assistance*
