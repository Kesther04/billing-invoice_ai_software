Product Name: TraqBill

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
    │   ├── auth/                            # Auth module (was missing)
    │   │   ├── components/
    │   │   │   ├── LoginForm.tsx
    │   │   │   └── RegisterForm.tsx
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── LoginPage.tsx
    │   │   │   └── RegisterPage.tsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   └── useAuth.ts
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── billing/                         # Core Feature 1: Smart Invoicing
    │   │   ├── components/
    │   │   │   ├── InvoicePromptInput.tsx
    │   │   │   ├── InvoicePreview.tsx
    │   │   │   ├── InvoiceEditor.tsx
    │   │   │   ├── InvoiceLineItems.tsx
    │   │   │   ├── InvoiceStatusBadge.tsx
    │   │   │   ├── InvoiceViewReceipt.tsx   # tracks when client opens invoice
    │   │   │   ├── RecurringInvoiceForm.tsx # recurring invoice setup UI
    │   │   │   └── PartialPaymentBadge.tsx  # partial/deposit invoice indicator
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── CreateInvoicePage.tsx
    │   │   │   ├── InvoiceDetailsPage.tsx
    │   │   │   └── InvoiceListPage.tsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   ├── useInvoiceAI.ts
    │   │   │   └── useInvoiceTracking.ts    # view receipt hook
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── revenue-automation/              # Core Feature 2: AI Collection Engine
    │   │   ├── components/
    │   │   │   ├── PaymentLinkGenerator.tsx
    │   │   │   ├── PaymentStatusTracker.tsx
    │   │   │   ├── ReminderScheduler.tsx
    │   │   │   ├── ReminderLog.tsx
    │   │   │   ├── ReminderTemplateEditor.tsx
    │   │   │   ├── ClientRiskBadge.tsx      # Low / Medium / High risk label
    │   │   │   ├── ClientRiskCard.tsx       # risk score breakdown per client
    │   │   │   └── HighRiskInvoiceAlert.tsx # alert when invoicing a high-risk client
    │   │   │
    │   │   ├── pages/
    │   │   │   ├── AutomationSettingsPage.tsx
    │   │   │   └── ClientRiskPage.tsx       # full risk scoring view
    │   │   │
    │   │   ├── hooks/
    │   │   │   ├── useRevenueAutomation.ts
    │   │   │   └── useClientRisk.ts         # risk score data hook
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── revenue-intelligence/            # Core Feature 3: Cash Flow Intelligence
    │   │   ├── components/
    │   │   │   ├── RevenueOverviewCard.tsx
    │   │   │   ├── RevenueTrendChart.tsx
    │   │   │   ├── PendingPaymentsCard.tsx
    │   │   │   ├── TopClientsCard.tsx
    │   │   │   ├── AIInsightsSummary.tsx
    │   │   │   ├── CashFlowForecastCard.tsx # "₦850,000 expected in 14 days"
    │   │   │   ├── CashShortageAlert.tsx    # shortage warning component
    │   │   │   └── CollectionRateChart.tsx  # collection rate over time
    │   │   │
    │   │   ├── pages/
    │   │   │   └── DashboardPage.tsx
    │   │   │
    │   │   ├── hooks/
    │   │   │   ├── useRevenueAnalytics.ts
    │   │   │   └── useCashFlowForecast.ts   # forecast data hook
    │   │   │
    │   │   ├── api.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   ├── clients/                         # Supporting Domain
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
    │   │   ├── useDebounce.ts
    │   │   └── useOrganization.ts           # active org/tenant context
    │   │
    │   ├── utils/
    │   │   ├── formatCurrency.ts
    │   │   ├── formatDate.ts
    │   │   ├── calculateTotals.ts
    │   │   └── generateInvoiceNumber.ts
    │   │
    │   └── constants/
    │       ├── invoiceStatus.ts
    │       ├── paymentStatus.ts             # was missing on frontend
    │       └── reminderIntervals.ts
    │
    ├── services/
    │   └── http.ts
    │
    ├── styles/
    │   └── index.css
    │
    └── types/
        └── global.d.ts
```


BACKEND STRUCTURE
```server/
└── src/
    │
    ├── server.ts                            # bootstrap only (listen)
    ├── app.ts                               # express setup
    │
    ├── modules/
    │
    │   ├── billing/                         # Core Feature 1: Smart Invoicing
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
    │   │   │   ├── invoice.tracker.ts       # view receipt / open tracking
    │   │   │   ├── invoice.status.ts
    │   │   │   └── invoice.types.ts
    │   │   │
    │   │   └── index.ts
    │   │
    │   ├── revenue-automation/              # Core Feature 2: AI Collection Engine
    │   │   ├── payments/
    │   │   │   ├── payment.controller.ts
    │   │   │   ├── payment.service.ts
    │   │   │   ├── payment.webhook.ts       # Paystack webhook handler
    │   │   │   ├── payment.routes.ts
    │   │   │   ├── payment.repository.ts
    │   │   │   └── payment.types.ts
    │   │   │
    │   │   ├── reminders/
    │   │   │   ├── reminder.controller.ts
    │   │   │   ├── reminder.service.ts
    │   │   │   ├── reminder.ai.ts           # AI tone + message generation
    │   │   │   ├── reminder.scheduler.ts
    │   │   │   ├── reminder.escalation.ts   # gentle → firm → formal logic
    │   │   │   ├── reminder.routes.ts
    │   │   │   ├── reminder.repository.ts
    │   │   │   └── reminder.types.ts
    │   │   │
    │   │   ├── risk/                        # Client risk scoring (was missing)
    │   │   │   ├── risk.controller.ts
    │   │   │   ├── risk.service.ts          # scoring logic per client
    │   │   │   ├── risk.routes.ts
    │   │   │   ├── risk.repository.ts
    │   │   │   └── risk.types.ts
    │   │   │
    │   │   └── index.ts
    │   │
    │   ├── revenue-intelligence/            # Core Feature 3: Cash Flow Intelligence
    │   │   ├── analytics/
    │   │   │   ├── analytics.controller.ts
    │   │   │   ├── analytics.service.ts
    │   │   │   ├── analytics.ai.ts          # AI-narrated dashboard summaries
    │   │   │   ├── analytics.routes.ts
    │   │   │   ├── analytics.repository.ts
    │   │   │   └── analytics.types.ts
    │   │   │
    │   │   ├── forecasting/                 # Cash flow forecasting (was missing)
    │   │   │   ├── forecast.controller.ts
    │   │   │   ├── forecast.service.ts      # expected collections + shortage alerts
    │   │   │   ├── forecast.routes.ts
    │   │   │   ├── forecast.repository.ts
    │   │   │   └── forecast.types.ts
    │   │   │
    │   │   └── index.ts
    │   │
    │   ├── clients/                         # Supporting Domain
    │   │   ├── client.controller.ts
    │   │   ├── client.service.ts
    │   │   ├── client.routes.ts
    │   │   ├── client.repository.ts
    │   │   └── client.types.ts
    │   │
    │   ├── users/                           # Auth + Accounts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.routes.ts
    │   │   ├── user.repository.ts
    │   │   ├── user.types.ts
    │   │   └── jwt.strategy.ts
    │   │
    │   └── organizations/                   # Multi-tenant SaaS
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
    │   │   └── tenant.middleware.ts
    │   │
    │   ├── utils/
    │   │   ├── logger.ts
    │   │   ├── date.ts
    │   │   ├── currency.ts
    │   │   ├── calculateTotals.ts
    │   │   ├── sanitize.ts
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
    │   │   ├── index.ts
    │   │   ├── migrations/
    │   │   └── seed/
    │   │
    │   └── constants/
    │       ├── invoiceStatus.ts
    │       ├── paymentStatus.ts
    │       └── reminderIntervals.ts
    │
    ├── infrastructure/
    │   ├── queues/
    │   │   ├── reminder.queue.ts            # reminder job queue
    │   │   └── recurring-invoice.queue.ts   # recurring invoice queue
    │   │
    │   ├── jobs/
    │   │   ├── reminder.job.ts              # processes reminder queue
    │   │   ├── recurring-invoice.job.ts     # auto-generates recurring invoices
    │   │   ├── risk-score.job.ts            # recalculates client risk scores
    │   │   └── forecast.job.ts             # refreshes cash flow forecasts
    │   │
    │   └── events/
    │       ├── invoice.events.ts            # invoice created/paid/overdue
    │       ├── payment.events.ts            # payment confirmed via webhook
    │       └── reminder.events.ts           # reminder sent/cancelled
    │
    ├── prisma/                              # moved out of src/generated
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── seed.ts
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


```
/**
 * TraqBill — Route Registration
 * Add these routes inside your MainLayout <Route> wrapper.
 *
 * Install one extra peer dep if not already present:
 *   npm i nanoid recharts
 */

import { DashboardPage } from "./features/revenue-intelligence";
import { AutomationSettingsPage } from "./features/revenue-automation";
import { ClientsPage } from "./features/clients";
import { CreateInvoicePage, InvoiceDetailsPage } from "./features/billing";

/*
  Example router structure (React Router v6):

  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard"          element={<DashboardPage />} />
      <Route path="billing/create"     element={<CreateInvoicePage />} />
      <Route path="billing/:id"        element={<InvoiceDetailsPage />} />
      <Route path="automation"         element={<AutomationSettingsPage />} />
      <Route path="clients"            element={<ClientsPage />} />
    </Route>
    <Route path="auth/login"    element={<LoginPage />} />
    <Route path="auth/signup"   element={<SignupPage />} />
  </Routes>

  Landing page lives outside MainLayout (no sidebar/topbar):
  <Route path="/" element={<RevPilotLandingPage />} />
*/
```