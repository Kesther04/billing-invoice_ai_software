Product Name: RevPilot

FRONTEND STRUCTURE
```client/
└── src/
    │
    ├── app/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── router.tsx
    │   └── layout.tsx
    │
    ├── modules/
    │
    │   ├── billing/                     # Core Feature 1: Prompt-to-Invoice
    │   │   ├── components/
    │   │   │   ├── InvoicePromptInput.tsx
    │   │   │   ├── InvoicePreview.tsx
    │   │   │   ├── InvoiceEditor.tsx
    │   │   │   ├── InvoiceLineItems.tsx
    │   │   │   └── InvoiceStatusBadge.tsx
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── CreateInvoicePage.tsx
    │   │   │   └── InvoiceDetailsPage.tsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   └── useInvoiceAI.ts
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── revenue-automation/          # Core Feature 2: Payments + Reminders
    │   │   ├── components/
    │   │   │   ├── PaymentLinkGenerator.tsx
    │   │   │   ├── PaymentStatusTracker.tsx
    │   │   │   ├── ReminderScheduler.tsx
    │   │   │   ├── ReminderLog.tsx
    │   │   │   └── ReminderTemplateEditor.tsx
    │   │   │
    │   │   ├── pages/
    │   │   │   └── AutomationSettingsPage.tsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   └── useRevenueAutomation.ts
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── revenue-intelligence/        # Core Feature 3: Dashboard & Insights
    │   │   ├── components/
    │   │   │   ├── RevenueOverviewCard.tsx
    │   │   │   ├── RevenueTrendChart.tsx
    │   │   │   ├── PendingPaymentsCard.tsx
    │   │   │   ├── TopClientsCard.tsx
    │   │   │   └── AIInsightsSummary.tsx
    │   │   │
    │   │   ├── pages/
    │   │   │   └── DashboardPage.tsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   └── useRevenueAnalytics.ts
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── clients/                     # Supporting Domain
    │   │   ├── components/
    │   │   │   ├── ClientForm.tsx
    │   │   │   ├── ClientList.tsx
    │   │   │   └── ClientDetailsCard.tsx
    │   │   │
    │   │   ├── pages/
    │   │   │   └── ClientsPage.tsx
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │
    ├── shared/
    │   ├── components/
    │   │   ├── Button.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Input.tsx
    │   │   ├── Table.tsx
    │   │   ├── Loader.tsx
    │   │   └── Badge.tsx
    │   │
    │   ├── hooks/
    │   │   └── useDebounce.ts
    │   │
    │   ├── utils/
    │   │   ├── formatCurrency.ts
    │   │   ├── formatDate.ts
    │   │   ├── calculateTotals.ts
    │   │   └── generateInvoiceNumber.ts
    │   │
    │   └── constants/
    │       ├── invoiceStatus.ts
    │       └── reminderIntervals.ts
    │
    ├── services/
    │   └── http.ts
    │
    ├── styles/
    │   └── index.css
    │
    └── types/
```


BACKEND STRUCTURE
```server/
└── src/
    │
    ├── server.ts                     # bootstrap only (listen)
    ├── app.ts                        # express setup
    │
    ├── modules/
    │
    │   ├── billing/                  # Core Feature 1: AI + Invoice Domain
    │   │   ├── ai/
    │   │   │   ├── ai.controller.ts
    │   │   │   ├── ai.service.ts
    │   │   │   ├── ai.routes.ts
    │   │   │   ├── ai.prompt.ts
    │   │   │   ├── ai.parser.ts
    │   │   │   ├── ai.repository.ts
    │   │   │   └── ai.types.ts
    │   │   │
    │   │   ├── invoices/
    │   │   │   ├── invoice.controller.ts
    │   │   │   ├── invoice.service.ts
    │   │   │   ├── invoice.routes.ts
    │   │   │   ├── invoice.repository.ts
    │   │   │   ├── invoice.status.ts
    │   │   │   └── invoice.types.ts
    │   │   │
    │   │   └── index.ts              # billing module router aggregator
    │   │
    │   ├── revenue-automation/       # Core Feature 2
    │   │   ├── payments/
    │   │   │   ├── payment.controller.ts
    │   │   │   ├── payment.service.ts
    │   │   │   ├── payment.routes.ts
    │   │   │   ├── payment.repository.ts
    │   │   │   └── payment.types.ts
    │   │   │
    │   │   ├── reminders/
    │   │   │   ├── reminder.controller.ts
    │   │   │   ├── reminder.service.ts
    │   │   │   ├── reminder.scheduler.ts
    │   │   │   ├── reminder.routes.ts
    │   │   │   ├── reminder.repository.ts
    │   │   │   └── reminder.types.ts
    │   │   │
    │   │   └── index.ts
    │   │
    │   ├── revenue-intelligence/     # Core Feature 3
    │   │   ├── analytics/
    │   │   │   ├── analytics.controller.ts
    │   │   │   ├── analytics.service.ts
    │   │   │   ├── analytics.routes.ts
    │   │   │   ├── analytics.repository.ts
    │   │   │   └── analytics.types.ts
    │   │   │
    │   │   └── index.ts
    │   │
    │   ├── clients/                  # Supporting Domain
    │   │   ├── client.controller.ts
    │   │   ├── client.service.ts
    │   │   ├── client.routes.ts
    │   │   ├── client.repository.ts
    │   │   └── client.types.ts
    │   │
    │   ├── users/                    # Auth + Accounts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.routes.ts
    │   │   ├── user.repository.ts
    │   │   ├── user.types.ts
    │   │   └── jwt.strategy.ts
    │   │
    │   └── organizations/            # NEW: Multi-tenant SaaS ready
    │       ├── org.controller.ts
    │       ├── org.service.ts
    │       ├── org.routes.ts
    │       ├── org.repository.ts
    │       └── org.types.ts
    │
    ├── shared/
    │   ├── middlewares/
    │   │   ├── auth.middleware.ts
    │   │   ├── error.middleware.ts
    │   │   ├── validate.middleware.ts
    │   │   ├── rate-limit.middleware.ts
    │   │   └── tenant.middleware.ts      # NEW (multi-tenant isolation)
    │   │
    │   ├── utils/
    │   │   ├── logger.ts
    │   │   ├── date.ts
    │   │   ├── currency.ts
    │   │   ├── calculateTotals.ts
    │   │   ├── sanitize.ts               # prompt injection safety
    │   │   └── invoiceNumber.ts
    │   │
    │   ├── validators/
    │   │   ├── invoice.validator.ts
    │   │   ├── ai.validator.ts
    │   │   ├── payment.validator.ts
    │   │   ├── reminder.validator.ts
    │   │   └── user.validator.ts
    │   │
    │   ├── database/
    │   │   ├── index.ts                 # DB connection / pool
    │   │   ├── migrations/
    │   │   ├── seed/
    │   │   └── models/                  # Optional ORM layer
    │   │
    │   └── constants/
    │       ├── invoiceStatus.ts
    │       ├── paymentStatus.ts
    │       └── reminderIntervals.ts
    │
    ├── config/
    │   ├── env.ts
    │   ├── database.ts
    │   ├── ai.ts
    │   ├── payment.ts
    │   ├── scheduler.ts
    │   └── storage.ts
    │
    └── types/
        ├── global.d.ts
        └── express.d.ts
```

```
Possible Background Operations
infrastructure/
  ├── queues/        # BullMQ / Redis
  ├── jobs/          # background processors
  └── events/        # event-driven billing updates
```


```
PostgreSQl commands
- \l, \dt \c -dbname, \d -tablenameWithQuotes,  SELECT tablename FROM pg_tables WHERE schemaname = 'public';, CREATE DATABASE ai_billing_invoice_db OWNER main;,  DROP DATABASE IF EXISTS ai_billing_invoice_db;
```