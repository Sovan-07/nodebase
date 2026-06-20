# 🚀 NodeBase

**NodeBase** is a modern no-code workflow automation platform inspired by tools like n8n and Zapier. It enables users to visually build, manage, and execute automated workflows using a node-based interface, integrating triggers, actions, credentials, and execution monitoring into a seamless experience.

🌐 **Live Demo:** https://nodebase-rosy.vercel.app

---

## ✨ Features

### 🔄 Visual Workflow Builder

* Drag-and-drop workflow editor powered by React Flow.
* Connect nodes visually to design automation pipelines.
* Real-time workflow configuration and management.

### ⚡ Workflow Execution

* Execute workflows on-demand.
* Track execution history and status.
* Monitor workflow runs with detailed execution logs.

### 🔐 Credential Management

* Securely store and manage third-party service credentials.
* Create, update, and organize credentials.
* Credential validation and association with workflows.

### 🌐 Webhook Triggers

* Google Forms webhook integration.
* Stripe webhook integration.
* Event-driven workflow execution.

### 👤 Authentication & Authorization

* Secure user authentication.
* Protected routes and resources.
* User-specific workflows and credentials.

### 📊 Execution Monitoring

* View workflow execution history.
* Inspect execution details.
* Track success and failure states.

### 🎨 Modern UI/UX

* Responsive dashboard design.
* Dark-mode friendly interface.
* Built with reusable UI components.

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 15**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn/UI**
* **React Flow**

### Backend

* **Next.js App Router**
* **tRPC**
* **Prisma ORM**
* **PostgreSQL**

### Authentication

* **Better Auth**

### Workflow & Events

* **Inngest**

### State Management & Data Fetching

* **TanStack Query**

### Validation

* **Zod**

### Deployment

* **Vercel**

---

## 📂 Project Structure

```bash
src/
├── app/                    # Next.js App Router
├── components/             # Shared UI Components
├── features/               # Feature-based modules
│   ├── workflows/
│   ├── credentials/
│   ├── executions/
│   └── auth/
├── inngest/                # Workflow event handling
├── lib/                    # Shared utilities
├── modules/                # Workflow node modules
├── trpc/                   # API layer
└── generated/              # Prisma generated client
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL Database
* npm / pnpm

### Clone the Repository

```bash
git clone https://github.com/Sovan-07/nodebase.git

cd nodebase
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```


## 🔗 API Endpoints

### Authentication

```txt
/api/auth/[...all]
```

### tRPC

```txt
/api/trpc/[trpc]
```

### Inngest

```txt
/api/inngest
```

### Webhooks

```txt
/api/webhooks/google-form
/api/webhooks/stripe
```

---

## 🧩 Workflow Nodes

Current node system supports:

* Trigger Nodes
* Action Nodes
* Webhook Nodes
* Future Third-Party Integrations

The architecture is designed to be easily extensible for custom node development.

---

## 📈 Roadmap

* [ ] Gmail Integration
* [x] Slack Integration
* [x] Discord Integration
* [ ] Scheduled Triggers
* [ ] Workflow Templates
* [ ] Team Collaboration
* [ ] Workflow Analytics
* [ ] Marketplace for Custom Nodes

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to your branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Sovan Mondal**

* GitHub: https://github.com/Sovan-07
* LinkedIn: https://www.linkedin.com/in/sovan-mondal

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project helpful, consider giving it a star on GitHub.
