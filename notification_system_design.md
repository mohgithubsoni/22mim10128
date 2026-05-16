# Backend Internship Assessment

Two microservices built with Node.js and Express as part of a backend evaluation.

## Structure

```
├── logging_middleware/         # reusable logger that sends logs to evaluation server
├── vehicle_maintence_scheduler/  # knapsack-based vehicle task optimizer
├── notification_app_be/        # campus notification REST API
└── notification_system_design.md
```

## Services

**Logging Middleware**
Reusable `Log(stack, level, package, message)` function that sends structured
logs to a central log server via HTTP. Used across all services.

**Vehicle Maintenance Scheduler**
Fetches depot budgets and vehicle tasks from an evaluation API, then runs a
0/1 knapsack algorithm to pick the highest-impact set of tasks within each
depot's mechanic-hour budget.

**Notification Backend**
Express API that fetches campus notifications and serves them with a priority
inbox — placements ranked highest, then results, then events, sorted by recency.

## Stack

- Node.js, Express
- axios, dotenv, cors

## Running locally

```bash
# logger
cd logging_middleware && node logger.js

# scheduler
cd vehicle_maintence_scheduler && node scheduler.js

# notification server
cd notification_app_be && node index.js
```

API runs at `http://localhost:3000`

| Endpoint | Description |
|----------|-------------|
| GET /health | server status |
| GET /notifications | all notifications |
| GET /notifications/priority?n=10 | top n by priority |
