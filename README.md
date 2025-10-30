# KudosFlow

KudosFlow is a real-time employee recognition application designed to foster a positive and appreciative work environment. It allows employees to send public or private "kudos" to their colleagues, which are then displayed in a live feed. The app also features AI-powered suggestions to help users craft their messages.

## Tech Stack

### Frontend

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Library**: [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)

### Backend

*   **API**: An integrated [GraphQL](https://graphql.org/) API built with [Apollo Server](https://www.apollographql.com/docs/apollo-server/). The API runs within the Next.js application and is accessible at `/api/graphql`.
*   **AI Features**: AI-powered suggestions are handled by [Genkit](https://firebase.google.com/docs/genkit), Google's generative AI toolkit. The Genkit flows are located in the `src/ai/flows` directory.
*   **Data Store**: For this prototype, the application uses in-memory mock data located in `src/lib/data.ts`.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Setup

1.  **Install Dependencies**:
    Open your terminal in the project root and run the following command to install the required packages:
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**:
    Create a new file named `.env` in the root of the project. You will need to add your Gemini API key to this file for the AI features to work.
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### Running the Application

This project requires two separate processes to be run concurrently in two separate terminals: the Next.js frontend server and the Genkit development server for AI features.

1.  **Start the Next.js Development Server**:
    In your first terminal, run:
    ```bash
    npm run dev
    ```
    This will start the main application. You can view it by opening [http://localhost:9002](http://localhost:9002) in your browser.

2.  **Start the Genkit Development Server**:
    In your second terminal, run:
    ```bash
    npm run genkit:watch
    ```
    This command starts the Genkit server in watch mode, which is necessary for the AI-powered suggestions to function correctly.

Once both servers are running, the application will be fully operational.
