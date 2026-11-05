# Backlog

## Shelved: JSON export/import on calculators (Alik decision Nov 4, 2026)

1. Feature: Export JSON / Import JSON for saved calculator scenarios.
2. Where it lived on the live r25 web:
   1. Cash Flow Calc: `/workspace/repos/rec/ric.js` — `doExport()`, `handleImportFile()`, UI buttons `#btn-export` and `#import-file-input` injected in `injectSavesUI()` into `#saved-panel-anchor` on the Carrd `#calc` section.
   2. Equity Calc: `/workspace/repos/rec/eec.js` — same pattern with `#eec-btn-export` and `#eec-import-input` in `injectSavesUI()` on `#equitycalc`.
3. What removing it touched in this repo:
   1. `assets/js/ric.js` — removed `doExport` / `handleImportFile`, the hidden file input, Export/Import toolbar controls, and their event listeners. LocalStorage save/load/overwrite/delete and print remain.
   2. `assets/js/eec.js` — same removals for the equity calculator.
4. Not present in `rentcomps` / RentalComp beyond ordinary `JSON.parse` / `JSON.stringify` for API and localStorage caches (kept).
5. Status: shelved; do not re-add without Alik asking.

## Other future items

1. Owner Guides listicle content (hub stubs only today).
2. Compress `assets/img/AgentReferrals-HowItWorks.png` (about 1.2 MB) to WebP under 150 KB.
3. RentalComp Code of Ethics review of live comps with full addresses and Zillow links (flagged for Alik; fetch behavior unchanged).
