# ReviewPilot 🚀

ReviewPilot is an AI-powered GitHub code review assistant that automatically analyzes your pull requests, provides constructive feedback, and helps you merge with confidence. Built with Next.js and powered by Google's Gemini 2.5 Flash, ReviewPilot understands your entire codebase to give context-aware code reviews.

## Features ✨

- **Automated PR Reviews**: Automatically generates detailed code reviews when a PR review is requested.
- **Context-Aware Analysis**: Uses Retrieval-Augmented Generation (RAG) to understand the context of the PR by analyzing your entire indexed codebase (powered by Pinecone).
- **Comprehensive Feedback**: Each review includes:
  - 📝 **Walkthrough**: File-by-file explanation of changes.
  - 📊 **Sequence Diagram**: Visualizes the flow of changes using Mermaid.js.
  - 🎯 **Strengths & Issues**: Highlights good practices and identifies potential bugs or code smells.
  - 💡 **Suggestions**: Actionable improvements for your code.
  - 🎨 **Poem**: A creative, short poem summarizing the PR changes!
- **Seamless GitHub Integration**: Posts the review directly as a comment on your pull request.
- **Dashboard**: View and manage all your repository reviews in one place.
- **Subscription Model**: Integrated with [Polar.sh](https://polar.sh/) for managing usage tiers and billing.

## Tech Stack 🛠️

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/) (GitHub OAuth)
- **AI Models**: Google Generative AI (`gemini-2.5-flash`), Vercel AI SDK
- **Vector Database**: [Pinecone](https://www.pinecone.io/) (for codebase RAG)
- **Background Jobs**: [Inngest](https://www.inngest.com/) for reliable event-driven queue processing
- **Payments & Subscriptions**: [Polar](https://polar.sh/)
- **Styling**: Tailwind CSS v4, Radix UI Primitives, shadcn/ui components

## Getting Started 🚀

### Prerequisites
- Node.js 20+
- PostgreSQL database
- GitHub OAuth App (for authentication and webhooks)
- Pinecone API Key
- Google Gemini API Key
- Polar Account (for handling subscriptions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/reviewpilot.git
   cd reviewpilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn / pnpm / bun install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and configure the required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/reviewpilot"
   
   # Next Auth / Better Auth
   BETTER_AUTH_SECRET="your-auth-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # AI & Vector DB
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   PINECONE_API_KEY="your-pinecone-api-key"
   
   # Inngest
   INNGEST_EVENT_KEY="local"
   INNGEST_SIGNING_KEY="local"
   
   # Polar Subscriptions
   POLAR_ACCESS_TOKEN="your-polar-access-token"
   POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"
   POLAR_SUCCESS_URL="http://localhost:3000/dashboard/subscription?success=true"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Start Inngest Dev Server (in a separate terminal)**
   ```bash
   npx inngest-cli@latest dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How it Works ⚙️

1. **Connect Repository**: Users authenticate via GitHub and connect a repository.
2. **Codebase Indexing**: The `index-repo` Inngest function triggers, reading the repository's files and indexing them into Pinecone for semantic search.
3. **PR Review Trigger**: When a `pr.review.requested` event occurs, the `generate-review` Inngest function is triggered.
4. **Context Retrieval**: ReviewPilot fetches the PR diff and queries the Pinecone vector database using the PR title and description to fetch relevant codebase context.
5. **AI Generation**: Gemini 2.5 Flash analyzes the diff and context to generate a comprehensive review.
6. **GitHub Comment**: The generated review is posted back to the GitHub PR automatically.

## License 📄

This project is open-source and available under the MIT License.
