# LangGraph Agent Chat UI

A modern, production-ready chat UI for interacting with any LangGraph server (following the LangGraph API), built on top of [agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui).

---

**Credits:**

- Original UI: [agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui) by LangChain
- Modified and extended by [devs-talha](https://github.com/devs-talha)

---

## ✨ Features

- Chat with any LLM agent via a beautiful Next.js interface
- Connects to any LangGraph backend (customizable, API-compatible)
- Environment-based configuration for API endpoints and credentials
- Supports authentication and secure deployments
- Easily dockerized for production

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/devs-talha/langgraph-agent-chat-ui.git
cd langgraph-agent-chat-ui
pnpm install  # or npm install / yarn install
```

### 2. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
# Edit .env with your LangGraph API URLs and credentials
```

See the [Environment Variables](#environment-variables) section for details.

### 3. Run Locally

```bash
pnpm dev  # or npm run dev
# go to http://localhost:3000
```

---

## 🐳 Docker Usage

Build and run the app using Docker:

```bash
docker build -t langgraph-agent-chat-ui .
docker run --env-file .env -p 3000:3000 langgraph-agent-chat-ui
```

- Edit `.env` for your deployment.
- All secrets/credentials should be passed at runtime (never hardcoded).

---

## ⚙️ Environment Variables

All configuration is done via environment variables. See `.env.example` for a full, documented list.

| Variable                      | Description                              | Required | Example Value                                 |
| ----------------------------- | ---------------------------------------- | -------- | --------------------------------------------- |
| NEXT_PUBLIC_PROXY_API_URL     | The Next.js API proxy endpoint           | Yes      | http://localhost:3000/api                     |
| NEXT_PUBLIC_ASSISTANT_ID      | Assistant/agent ID to use                | Yes      | agent                                         |
| NEXT_PUBLIC_GITHUB_REPO_URL   | GitHub repo for the UI (for About/links) | No       | https://github.com/devs-talha/langgraph-agent-chat-ui |
| NEXT_PUBLIC_APP_TITLE         | App title (browser tab, UI)              | No       | LangGraph Agent Chat                          |
| NEXT_PUBLIC_APP_DESCRIPTION   | App description (meta/about)             | No       | Chat UI for LangGraph agents                  |
| LANGGRAPH_API_URL             | URL of your LangGraph backend server     | Yes      | https://my-langgraph-server.example.com       |
| BASIC_AUTH_USERNAME           | Backend API username (if required)       | Maybe    | your-username                                 |
| BASIC_AUTH_PASSWORD           | Backend API password (if required)       | Maybe    | your-password                                 |
| NEXT_PUBLIC_ALLOW_ATTACHMENTS | Allow file uploads in chat               | Optional | true                                          |

- All `NEXT_PUBLIC_*` variables are exposed to the browser. **Never put secrets in these.**
- All other variables are server-only.
- For production, set these in your deployment platform.

---

## 📝 Project Structure

```
/ (root)
├── src/           # Main application code (components, providers, config)
├── public/        # Static assets
├── .env.example   # Example environment variables
├── Dockerfile     # Production Docker build
├── README.md      # This file
└── ...
```

---

## 🧑‍💻 Development

- Use `pnpm dev` to run locally with hot-reloading.
- Update `.env` for different backends or agents.
- UI and backend endpoints are fully configurable.

---

## 🛠️ Customization

- Fork or extend the UI for your own agent use-cases.
- Add new features or change branding via environment variables and config.

---

## 📦 Deployment

- Use Docker for reproducible, secure deployments.
- Set all secrets via your deployment platform (never commit them).
- Example cloud platforms: Vercel, AWS, GCP, DigitalOcean, CapRover, etc.

---

## 🙏 Credits & License

- **Original UI:** [agent-chat-ui](https://github.com/langchain-ai/agent-chat-ui) by LangChain
- **Modifications:** Generic LangGraph agent support by Talha
- **License:** See [LICENSE](./LICENSE) (inherits from upstream)

---

## 📚 Resources

- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [Next.js Docs](https://nextjs.org/docs)

---

## 💬 Support & Feedback

- Open an issue or discussion on GitHub
- PRs and suggestions welcome!

## Setup

> [!TIP]
> Don't want to run the app locally? Use the deployed site here: [agentchat.vercel.app](https://agentchat.vercel.app)!

First, clone the repository, or run the [`npx` command](https://www.npmjs.com/package/create-agent-chat-app):

```bash
npx create-agent-chat-app
```

or

```bash
git clone https://github.com/langchain-ai/agent-chat-ui.git

cd agent-chat-ui
```

Install dependencies:

```bash
pnpm install
```

Run the app:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Usage

Once the app is running (or if using the deployed site), you'll be prompted to enter:

- **Deployment URL**: The URL of the LangGraph server you want to chat with. This can be a production or development URL.
- **Assistant/Graph ID**: The name of the graph, or ID of the assistant to use when fetching, and submitting runs via the chat interface.
- **LangSmith API Key**: (only required for connecting to deployed LangGraph servers) Your LangSmith API key to use when authenticating requests sent to LangGraph servers.

After entering these values, click `Continue`. You'll then be redirected to a chat interface where you can start chatting with your LangGraph server.

## Environment Variables

You can bypass the initial setup form by setting the following environment variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:2024
NEXT_PUBLIC_ASSISTANT_ID=agent
```

> [!TIP]
> If you want to connect to a production LangGraph server, read the [Going to Production](#going-to-production) section.

To use these variables:

1. Copy the `.env.example` file to a new file named `.env`
2. Fill in the values in the `.env` file
3. Restart the application

When these environment variables are set, the application will use them instead of showing the setup form.

## Hiding Messages in the Chat

You can control the visibility of messages within the Agent Chat UI in two main ways:

**1. Prevent Live Streaming:**

To stop messages from being displayed _as they stream_ from an LLM call, add the `langsmith:nostream` tag to the chat model's configuration. The UI normally uses `on_chat_model_stream` events to render streaming messages; this tag prevents those events from being emitted for the tagged model.

_Python Example:_

```python
from langchain_anthropic import ChatAnthropic

# Add tags via the .with_config method
model = ChatAnthropic().with_config(
    config={"tags": ["langsmith:nostream"]}
)
```

_TypeScript Example:_

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic()
  // Add tags via the .withConfig method
  .withConfig({ tags: ["langsmith:nostream"] });
```

**Note:** Even if streaming is hidden this way, the message will still appear after the LLM call completes if it's saved to the graph's state without further modification.

**2. Hide Messages Permanently:**

To ensure a message is _never_ displayed in the chat UI (neither during streaming nor after being saved to state), prefix its `id` field with `do-not-render-` _before_ adding it to the graph's state, along with adding the `langsmith:do-not-render` tag to the chat model's configuration. The UI explicitly filters out any message whose `id` starts with this prefix.

_Python Example:_

```python
result = model.invoke([messages])
# Prefix the ID before saving to state
result.id = f"do-not-render-{result.id}"
return {"messages": [result]}
```

_TypeScript Example:_

```typescript
const result = await model.invoke([messages]);
// Prefix the ID before saving to state
result.id = `do-not-render-${result.id}`;
return { messages: [result] };
```

This approach guarantees the message remains completely hidden from the user interface.

## Rendering Artifacts

The Agent Chat UI supports rendering artifacts in the chat. Artifacts are rendered in a side panel to the right of the chat. To render an artifact, you can obtain the artifact context from the `thread.meta.artifact` field. Here's a sample utility hook for obtaining the artifact context:

```tsx
export function useArtifact<TContext = Record<string, unknown>>() {
  type Component = (props: {
    children: React.ReactNode;
    title?: React.ReactNode;
  }) => React.ReactNode;

  type Context = TContext | undefined;

  type Bag = {
    open: boolean;
    setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;

    context: Context;
    setContext: (value: Context | ((prev: Context) => Context)) => void;
  };

  const thread = useStreamContext<
    { messages: Message[]; ui: UIMessage[] },
    { MetaType: { artifact: [Component, Bag] } }
  >();

  return thread.meta?.artifact;
}
```

After which you can render additional content using the `Artifact` component from the `useArtifact` hook:

```tsx
import { useArtifact } from "../utils/use-artifact";
import { LoaderIcon } from "lucide-react";

export function Writer(props: {
  title?: string;
  content?: string;
  description?: string;
}) {
  const [Artifact, { open, setOpen }] = useArtifact();

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-lg border p-4"
      >
        <p className="font-medium">{props.title}</p>
        <p className="text-sm text-gray-500">{props.description}</p>
      </div>

      <Artifact title={props.title}>
        <p className="p-4 whitespace-pre-wrap">{props.content}</p>
      </Artifact>
    </>
  );
}
```

## Going to Production

Once you're ready to go to production, you'll need to update how you connect, and authenticate requests to your deployment. By default, the Agent Chat UI is setup for local development, and connects to your LangGraph server directly from the client. This is not possible if you want to go to production, because it requires every user to have their own LangSmith API key, and set the LangGraph configuration themselves.

### Production Setup

To productionize the Agent Chat UI, you'll need to pick one of two ways to authenticate requests to your LangGraph server. Below, I'll outline the two options:

### Quickstart - API Passthrough

The quickest way to productionize the Agent Chat UI is to use the [API Passthrough](https://github.com/langchain-ai/langgraph-nextjs-api-passthrough) package. This package provides a simple way to proxy requests to your LangGraph server, and handle authentication for you.

This repository already contains all of the code you need to start using this method. The only configuration you need to do is set the proper environment variables.

```bash
NEXT_PUBLIC_ASSISTANT_ID="agent"
# This should be the deployment URL of your LangGraph server
LANGGRAPH_API_URL="https://my-agent.default.us.langgraph.app"
# This should be the URL of your website + "/api". This is how you connect to the API proxy
NEXT_PUBLIC_API_URL="https://my-website.com/api"
# Your LangSmith API key which is injected into requests inside the API proxy
LANGSMITH_API_KEY="lsv2_..."
```

Let's cover what each of these environment variables does:

- `NEXT_PUBLIC_ASSISTANT_ID`: The ID of the assistant you want to use when fetching, and submitting runs via the chat interface. This still needs the `NEXT_PUBLIC_` prefix, since it's not a secret, and we use it on the client when submitting requests.
- `LANGGRAPH_API_URL`: The URL of your LangGraph server. This should be the production deployment URL.
- `NEXT_PUBLIC_API_URL`: The URL of your website + `/api`. This is how you connect to the API proxy. For the [Agent Chat demo](https://agentchat.vercel.app), this would be set as `https://agentchat.vercel.app/api`. You should set this to whatever your production URL is.
- `LANGSMITH_API_KEY`: Your LangSmith API key to use when authenticating requests sent to LangGraph servers. Once again, do _not_ prefix this with `NEXT_PUBLIC_` since it's a secret, and is only used on the server when the API proxy injects it into the request to your deployed LangGraph server.

For in depth documentation, consult the [LangGraph Next.js API Passthrough](https://www.npmjs.com/package/langgraph-nextjs-api-passthrough) docs.

### Advanced Setup - Custom Authentication

Custom authentication in your LangGraph deployment is an advanced, and more robust way of authenticating requests to your LangGraph server. Using custom authentication, you can allow requests to be made from the client, without the need for a LangSmith API key. Additionally, you can specify custom access controls on requests.

To set this up in your LangGraph deployment, please read the LangGraph custom authentication docs for [Python](https://langchain-ai.github.io/langgraph/tutorials/auth/getting_started/), and [TypeScript here](https://langchain-ai.github.io/langgraphjs/how-tos/auth/custom_auth/).

Once you've set it up on your deployment, you should make the following changes to the Agent Chat UI:

1. Configure any additional API requests to fetch the authentication token from your LangGraph deployment which will be used to authenticate requests from the client.
2. Set the `NEXT_PUBLIC_API_URL` environment variable to your production LangGraph deployment URL.
3. Set the `NEXT_PUBLIC_ASSISTANT_ID` environment variable to the ID of the assistant you want to use when fetching, and submitting runs via the chat interface.
4. Modify the [`useTypedStream`](src/providers/Stream.tsx) (extension of `useStream`) hook to pass your authentication token through headers to the LangGraph server:

```tsx
const streamValue = useTypedStream({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID,
  // ... other fields
  defaultHeaders: {
    Authentication: `Bearer ${addYourTokenHere}`, // this is where you would pass your authentication token
  },
});
```
