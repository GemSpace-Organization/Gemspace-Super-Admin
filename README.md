# Gemspace Super Admin 🚀

A modern, scalable admin dashboard built with Next.js 16 and cutting-edge technologies.

## 🛠 Technology Stack

- **Framework**: Next.js 16.1.6 with Turbopack
- **Runtime**: React 19.2.4
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: shadcn/ui (radix-mira style)
- **Icons**: Lucide React
- **Theme**: next-themes with dark/light mode
- **Code Quality**: ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm, npm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/GemSpace-Organization/Gemspace-Super-Admin.git
cd Gemspace-Super-Admin

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
# Start development server with Turbopack
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build the application
npm run build
npm run start

# Or with other package managers
pnpm build && pnpm start
yarn build && yarn start
```

## 📁 Project Structure

```
gemspace-super-admin/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── theme-provider.tsx # Theme management
│   └── ui/                # shadcn/ui components
│       └── button.tsx     # Button component
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   └── utils.ts           # Class name utilities
├── public/                # Static assets
└── [config files]        # Configuration files
```

## 🎨 Features

### Theme System

- **Dark/Light Mode**: Automatic system detection
- **Manual Toggle**: Press `d` key to switch themes
- **OKLCH Color System**: Modern perceptual color space
- **CSS Variables**: Comprehensive design tokens

### Component System

- **shadcn/ui Integration**: High-quality, accessible components
- **Variant Support**: Multiple styles and sizes
- **TypeScript**: Full type safety
- **Customizable**: Easy theme and style modifications

### Developer Experience

- **Hot Reload**: Turbopack for instant updates
- **Code Quality**: ESLint + Prettier configuration
- **Type Safety**: Strict TypeScript setup
- **Path Aliases**: Clean import statements with `@/`

## 🧩 Adding Components

Add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add table
```

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check with TypeScript

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives

---

Built with ❤️ by the GemSpace Organization
