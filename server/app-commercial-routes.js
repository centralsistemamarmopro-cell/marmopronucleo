// Commercial route definitions are kept separately so the core API can be wired safely.
// Endpoints: /api/commercial/dashboard, /api/projects, /api/technical, /api/budgets, /api/orders.
// Domain implementation: server/commercial.js
export { ensureCommercial, commercialDashboard, createProject, createTechnicalAnalysis, createBudget, updateBudget, createOrder, updateOrder, COMMERCIAL_STAGES } from './commercial.js';
