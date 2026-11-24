/** Keep new shared facts with their pending articles until the batch is published. */
export function selectClaimRevisions(approved, revisions, preview = false) {
  const originals = new Map(approved.map((claim) => [claim.id, claim]));
  const replacements = new Map();
  for (const claim of revisions) {
    const original = originals.get(claim.id);
    if (!original) throw new Error(`Unknown claim revision: ${claim.id}`);
    if (replacements.has(claim.id)) throw new Error(`Duplicate claim revision: ${claim.id}`);
    if (!Number.isInteger(claim.revision) || claim.revision <= original.revision) throw new Error(`Claim revision must be newer: ${claim.id}`);
    replacements.set(claim.id, claim);
  }
  return preview ? approved.map((claim) => replacements.get(claim.id) || claim) : approved;
}
