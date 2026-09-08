import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadAllUniversities() {
  try {
    const jsonPath = path.join(__dirname, 'universities.json');
    if (!fs.existsSync(jsonPath)) {
      return [];
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const list = JSON.parse(raw);

    return list.map(u => {
      // Generate clean kebab-case ID if not present
      const id = u.id || u.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const locationParts = (u.location || '').split(',');
      const state = locationParts.length > 1 ? locationParts[locationParts.length - 1].trim() : '';

      return {
        id,
        name: u.name,
        shortName: u.shortName || u.name,
        location: u.location || 'India',
        state: state || 'India',
        nirfRank: u.nirfRank || null,
        nirfCategory: u.nirfCategory || 'Engineering',
        type: u.type || 'Higher Educational Institution',
        departments: Array.isArray(u.departments) ? u.departments : [],
        expertise: Array.isArray(u.expertise) && u.expertise.length > 0 
          ? u.expertise 
          : (u.departments || []).map(d => d.replace(/Department of /i, '').trim()),
        researchAreas: Array.isArray(u.researchAreas) ? u.researchAreas : [],
        activeLabs: Array.isArray(u.activeLabs) ? u.activeLabs : [],
        portalUrl: u.portalUrl || null,
        contactEmail: u.contactEmail || null,
        sourceUrls: u.sourceUrls || []
      };
    });
  } catch (err) {
    console.warn(`[LoadUniversities Warning] Could not load universities.json: ${err.message}`);
    return [];
  }
}
