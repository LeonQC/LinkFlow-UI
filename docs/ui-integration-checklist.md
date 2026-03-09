# LinkFlow UI Integration Checklist

## 1. API Source of Truth

Use backend docs from:

- `../LinkFlowServices/docs/architecture/LinkFlow-api-schema.md`

Do not maintain duplicated API schema in UI repo.

## 2. Frontend Priority Pages

1. Login/Register
2. Link Create/List/Edit
3. Realtime Dashboard
4. Risk Alerts panel (admin)

## 3. Frontend API Modules

- `src/services/auth.ts`
- `src/services/links.ts`
- `src/services/analytics.ts`
- `src/services/ai.ts`
- `src/services/risk.ts`
- `src/services/monitoring.ts`

## 4. Realtime Requirements

- Obtain ws token from backend first
- Subscribe to analytics and risk channels
- Show reconnection state in UI
