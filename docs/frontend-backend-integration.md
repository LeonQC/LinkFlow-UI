# Frontend Backend Integration Status

## Actual Frontend App Location

The buildable Figma-generated frontend currently lives in:

- `LinkFlow-UI/LinkFlow UI Design/`

The repo root `LinkFlow-UI/src/` is still an empty scaffold and is not the active app.

## Route Match Against API/UI Design

The frontend routes match the documented UI pages:

- `/auth/login`
- `/dashboard`
- `/links`
- `/links/:id`
- `/qr-codes`
- `/alerts`
- `/monitoring`

These routes align with the backend API schema document intent in:

- `../LinkFlowServices/docs/architecture/LinkFlow-api-schema.md`

## Current Integration Mode

Environment variables:

- `VITE_API_BASE_URL=http://localhost:8080`
- `VITE_API_MODE=hybrid`

Mode meanings:

- `mock`: all pages use local mock data
- `live`: all configured services call the backend directly
- `hybrid`: only selected completed backend features call live APIs, others stay on mock data

Current hybrid live feature set:

- `register`

## What Is Already Connected

Live:

- Register form calls `POST /api/v1/auth/register`

Integration prerequisites added:

- unified frontend API client
- backend CORS for Vite dev server (`localhost:5173`)
- route switched to the React Query dashboard page

## What Still Does Not Fully Match Yet

### Auth

- `register` is live
- `login`, `refresh`, `logout`, `me` are not implemented in backend yet
- login page still uses demo local storage flow

### Links

- frontend has service definitions aligned to `/api/v1/links`
- backend link CRUD endpoints are not implemented yet
- `links`, `link detail`, `qr-codes` still cannot complete real live CRUD until backend endpoints land

### Dashboard

- frontend service target is `/api/v1/dashboard/summary`
- route now points to the query-driven dashboard page
- backend dashboard endpoints are not implemented yet, so hybrid mode keeps these on mock

### Risk Alerts

- frontend contract should use:
  - `GET /api/v1/risk/alerts`
  - `POST /api/v1/admin/risk/alerts/{alert_id}/review`
- backend endpoints are not implemented yet
- alerts page is still demo-first

### Monitoring

- page is currently static presentation data
- backend monitoring endpoints are not connected yet

## Key Mismatches Found During Audit

1. The original Figma app used page-local mock data, `setTimeout`, and `localStorage` instead of real HTTP requests.
2. Several frontend internal field names are camelCase UI models, while backend schema uses snake_case API fields.
3. Original alert mock status used `resolved`, which does not exist in backend API schema.
4. Root `LinkFlow-UI/src/` does not contain the actual app; the real app is under `LinkFlow UI Design/`.

## Recommended Demo Framing

You can accurately say:

1. The frontend route structure matches the product page design.
2. I added a real API client and cross-origin support for frontend-backend integration.
3. The register flow is already connected to the backend.
4. Other pages are prepared for integration, but remain mock-backed because the corresponding backend endpoints are not implemented yet.
