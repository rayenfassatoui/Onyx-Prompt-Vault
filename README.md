# Onyx Prompt Vault

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Onyx Prompt Vault" width="100%" />
</div>

A premium, Swiss-style utility for prompt engineering. Select a template, inject variables, and deploy your payload with precision.

## Features

- **Prompt Management**: Create, read, update, and delete prompt templates.
- **Dynamic Variables**: Automatically detects `{{variables}}` in your prompts for quick injection.
- **Tagging System**: Organize prompts with a flexible tagging system.
- **Airlock Security**: Secure access with a passcode-protected entry.
- **Time Travel**: View and revert to previous versions of your prompts (Visual effect).
- **Onyx Aesthetics**: A dark, immersive interface designed for focus.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, GSAP
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Runtime**: Bun (recommended) or Node.js

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+) or Node.js (v18+)
- A [Neon](https://neon.tech) PostgreSQL database

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd onyx-prompt-vault
    ```

2.  **Install dependencies**
    ```bash
    bun install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
    ACCESS_CODE="1234"
    PORT=3001
    ```

4.  **Database Migration**
    Push the schema to your Neon database:
    ```bash
    bunx drizzle-kit push
    ```

### Running the App

You need to run both the backend server and the frontend client.

1.  **Start the Backend Server**
    ```bash
    bun run server
    ```
    Server runs on `http://localhost:3001`

2.  **Start the Frontend**
    ```bash
    bun run dev
    ```
    Client runs on `http://localhost:3000`

## Project Structure

- `/components` - React UI components (Dashboard, Airlock, PrismModal, etc.)
- `/server` - Backend Express server and database configuration
- `/src` - Frontend logic and API client
- `drizzle.config.ts` - Drizzle ORM configuration
