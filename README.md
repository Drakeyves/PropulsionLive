# Propulsion Society

A modern web application for AI entrepreneurs and enthusiasts.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Supabase account and project

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd propulsion-society
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## VS Code Setup

This project includes recommended VS Code settings and extensions. When you open the project in VS Code, you'll be prompted to install the recommended extensions.

### Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense
- Code Spell Checker

### Features

- TypeScript support
- ESLint configuration
- Prettier formatting
- Tailwind CSS IntelliSense
- Git ignore settings
- VS Code workspace settings
- Automatic formatting on save
- Path aliases
- Type checking

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── lib/           # Utility functions and configurations
│   ├── pages/         # Page components
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── supabase/         # Supabase configurations and migrations
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is private and confidential.