# Pixel Sprite Walker 🎮

A pixel-art based game built with React, TypeScript, and Vite. Battle enemies and guide your character through exciting pixel adventures!

## Overview

Pixel Sprite Walker adalah aplikasi game interaktif yang menampilkan:
- **Character Selection** - Pilih karakter untuk memulai petualangan
- **Sprite Canvas** - Canvas interaktif untuk menampilkan sprite character
- **Battle System** - Lawan zombies dan skeletons dengan attack animations
- **Pixel Art Graphics** - Grafis pixel yang retro dan menarik

# Quick Start

### Prerequisites
- **Node.js** (v18 atau lebih tinggi)
- **pnpm** (package manager)

### Installation

1. Clone repository atau buka folder proyek:
```bash
cd c:\vrnan\game-pixel
```

2. Install dependencies:
```bash
pnpm install
```

3. Jalankan development server:
```bash
pnpm dev
```

4. Buka browser dan akses:
```
http://localhost:3000
```

# Build & Deploy

### Development
```bash
pnpm dev
```
Menjalankan development server dengan hot-reload di port 3000.

### Production Build
```bash
pnpm build
```
Mengcompile project untuk production.

### Preview
```bash
pnpm preview
```
Preview hasil build sebelum deploy.

## Project Structure

```
game-pixel/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── CharacterSelection.tsx    # Character selection screen
│   ├── InfoPanel.tsx            # Information panel
│   ├── SpriteCanvas.tsx         # Main game canvas
│   ├── theme-provider.tsx       # Theme provider setup
│   └── ui/                      # Reusable UI components
├── hooks/                       # Custom React hooks
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
├── lib/                        # Utility functions
│   └── utils.ts                # Helper functions
├── public/                     # Static assets
│   ├── mo.png                  # Player sprite
│   ├── mo-attack.png           # Attack animation
│   ├── zombie.png              # Zombie sprite
│   └── skeleton.png            # Skeleton sprite
├── styles/                     # Global styles
│   └── globals.css
├── types.ts                    # TypeScript type definitions
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.mjs         # Tailwind CSS configuration
└── postcss.config.mjs          # PostCSS configuration
```

## 🎨 Components

### CharacterSelection
Komponen untuk pemilihan karakter sebelum memulai game.
- Menampilkan opsi karakter yang tersedia
- Trigger untuk memulai game

### SpriteCanvas
Canvas utama game yang menampilkan:
- Sprite character yang sedang bermain
- Enemy sprites (zombie dan skeleton)
- Attack animations
- Game logic dan interaksi

### InfoPanel
Panel informasi yang menampilkan:
- Status karakter
- Informasi pertempuran
- Data permainan lainnya

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 📝 Key Features

- ✨ Character selection system
- 🎮 Interactive sprite-based gameplay
- 🎨 Pixel art graphics
- 📱 Responsive design
- 🌙 Dark mode support (zinc color scheme)
- ⚡ Fast development with Vite
- 🔧 TypeScript for type safety

## 🎮 Game Features

### Sprites
- **mo.png** - Player character sprite
- **mo-attack.png** - Attack animation sprite
- **zombie.png** - Zombie enemy sprite
- **skeleton.png** - Skeleton enemy sprite

### Gameplay
- Pilih karakter di awal game
- Battle system melawan enemies
- Attack animations
- Game progression

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Environment Variables

Jika diperlukan, tambahkan file `.env.local` di root project:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📦 Dependencies

### Main Dependencies
- `react` - UI library
- `react-dom` - React DOM renderer
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Icon library
- `next` - React framework
- `@vercel/analytics` - Analytics

### Dev Dependencies
- `typescript` - Type checking
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - CSS framework

## 🚀 Deployment

Project ini sudah dikonfigurasi untuk deploy di **Vercel**:

1. Connect repository ke Vercel
2. Configure build settings (sudah ada di vercel.json)
3. Deploy dengan push ke main branch

Lihat `vercel.json` untuk konfigurasi deployment.

## 📖 Development Tips

1. **Hot Module Replacement (HMR)**: Perubahan code akan langsung ter-reflect di browser
2. **Component Library**: Gunakan komponen dari `components/ui/` yang sudah tersedia
3. **Styling**: Gunakan Tailwind CSS classes untuk styling
4. **Type Safety**: Manfaatkan TypeScript untuk menghindari bugs

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
pnpm dev -- --port 3001
```

### Dependencies error
```bash
# Clear cache dan reinstall
pnpm store prune
pnpm install
```

### Build error
```bash
# Clean build
pnpm build --force
```

## 📄 License

Private project - Game Pixel

## 👨‍💻 Development

### Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Useful Commands
```bash
# Install new dependency
pnpm add package-name

# Install dev dependency
pnpm add -D package-name

# Update dependencies
pnpm update

# Type check
npx tsc --noEmit
```

## 📞 Support

Untuk bantuan atau pertanyaan terkait project, silakan buat issue atau hubungi tim development.

---

**Happy Gaming! 🎮✨**
