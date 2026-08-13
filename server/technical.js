import { id } from './store.js';

const technicalRules = [
  'Normalizar orientação de páginas antes da análise.',
  'Separar ambientes, peças, medidas, recortes, furos, colagens, nichos, materiais e observações.',
  'Preservar a origem da informação e sinalizar itens que exigem conferência.',
  'Não transformar interpretação técnica em regra permanente sem aprovação.',
];

export function normalizeOrientation(pages = []) {
  return pages.map((page, index) => ({ ...page, page: page.page || index + 1, rotation: 0, orientationNormalized: true }));
}

export function extractTechnicalData(input = {}) {
  const pages = normalizeOrientation(input.pages || []);
  return {
    id: id('tech'), projectId: input.projectId || null, sourceFiles: input.sourceFiles || [],
    status: 'review', confidence: input.confidence ?? null,
    pages, environments: input.environments || [], pieces: input.pieces || [],
    dimensions: input.dimensions || [], cuts: input.cuts || [], services: input.services || [],
    materials: input.materials || [], notes: input.notes || [], rulesApplied: technicalRules,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
}

export function approveTechnicalAnalysis(analysis, corrections = []) {
  analysis.corrections = corrections;
  analysis.status = 'approved';
  analysis.approvedAt = new Date().toISOString();
  analysis.updatedAt = analysis.approvedAt;
  return analysis;
}
