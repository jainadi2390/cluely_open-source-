# Cluely Lite 💬

A beautiful, minimalist chat interface powered by Google's Gemini AI. Built with React, TypeScript, and Tailwind CSS.

![Cluely Lite](https://img.shields.io/badge/React-18.3-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)

## ✨ Features

- **🤖 Gemini AI Integration**: Chat with Google's powerful Gemini AI model
- **🎨 Beautiful UI**: Clean, modern interface with rounded chat bubbles and soft gradient backgrounds
- **👁️ Focus Mode**: Toggle between normal and minimal UI for distraction-free conversations
- **🌓 Theme Support**: Switch between light and dark themes seamlessly
- **📝 Markdown Rendering**: Full support for formatted text, code blocks, and lists in responses
- **🔐 Secure API Key Storage**: Your API key is stored locally in your browser - never sent to any server
- **⚡ Real-time Error Handling**: Clear feedback for invalid keys, rate limits, and network issues
- **📱 Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed on your machine
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cluely_open-source-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Click on the Settings icon (⚙️)
   - Enter your Gemini API key
   - Start chatting!

## 🎯 Usage

### Setting Up Your API Key

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click the Settings icon in the top-right corner
3. Paste your API key in the input field
4. Click "Save Changes"

Your API key is stored locally in your browser's localStorage and is never sent to any server except Google's Gemini API.

### Focus Mode

Click the eye icon (👁️) in the header to toggle Focus Mode. This hides the header for a clean, distraction-free chat experience. Click the eye icon again to exit Focus Mode.

### Theme Switching

Toggle between light and dark themes in the Settings panel. Your preference is saved locally and will persist across sessions.

### Clearing Chat History

Click the trash icon (🗑️) in the header to clear all messages and start a fresh conversation.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4
- **AI Integration**: Google Generative AI SDK
- **Markdown Rendering**: react-markdown
- **Icons**: Lucide React
- **Build Tool**: Vite 6.0

## 📁 Project Structure

```
cluely_open-source-/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx    # Main chat component
│   │   │   ├── ChatInput.tsx        # Message input component
│   │   │   ├── MessageBubble.tsx    # Individual message display
│   │   │   └── Settings.tsx         # Settings modal
│   │   └── ui/
│   │       ├── button.tsx           # Reusable button component
│   │       ├── input.tsx            # Reusable input component
│   │       └── card.tsx             # Reusable card component
│   ├── lib/
│   │   ├── utils.ts                 # Utility functions
│   │   └── storage.ts               # LocalStorage helpers
│   ├── services/
│   │   └── gemini.ts                # Gemini API integration
│   ├── types/
│   │   └── chat.ts                  # TypeScript type definitions
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔒 Privacy & Security

- **Local Storage Only**: Your API key is stored in your browser's localStorage
- **No Backend**: This is a purely client-side application
- **Direct API Calls**: Messages are sent directly from your browser to Google's Gemini API
- **No Analytics**: We don't track any user data or conversations

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}
```

### Modifying Gradients

Update the gradient classes in `src/index.css`:

```css
.soft-gradient-light {
  background: linear-gradient(to bottom right, #your, #colors, #here);
}
```

## 📦 Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory. You can deploy this to any static hosting service like:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Double-check your API key in Settings
- Make sure you copied the entire key without extra spaces
- Verify your API key is active at [Google AI Studio](https://makersuite.google.com/app/apikey)

### "Rate Limit Exceeded" Error
- The free tier has usage limits
- Wait a few minutes before trying again
- Consider upgrading your API quota if needed

### Messages Not Sending
- Check your internet connection
- Verify your API key is set correctly
- Open browser DevTools console to see detailed error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by modern chat interfaces

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ by the Cluely team
