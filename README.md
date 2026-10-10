# Molecular Geometry Calculator

**Live:** https://rubixion.github.io/molecular-geometry-calculator/

A 3D molecule viewer that runs in the browser. Type a name or formula, and it renders the structure with Three.js using real data from the PubChem API.

It started as a C++ console app that parsed chemical formulas, worked out VSEPR geometry, and printed bond angles. The original code is still in [`legacy/`](legacy/).

## Features

- Search by name (*caffeine*, *aspirin*) or formula (*H2O*, *Na2SO4*)
- Uses PubChem's 3D conformer when one exists, and falls back to the 2D layout when it doesn't
- Ionic compounds with no PubChem entry, like Na₂SO₄, are built from the formula unit instead
- Compound summary: VSEPR geometry, bond angle, bond and atom counts, molar mass, bond type, polarity, and intermolecular forces
- Click any atom to see its element data, electronegativity, oxidation states, hybridization, lone pairs, and formal charge
- Settings for the background colour, dot grid, and auto-rotate speed
- Built-in bug report form (sent through Formspree)

## Controls

| Input | Action |
|---|---|
| Drag | Orbit |
| Scroll | Zoom |
| Right-drag | Pan |
| Click atom | Atom info |
| R | Reset view |

## Run locally

There's no build step. Serve the folder with any static server:

```sh
npx serve .
# or
python -m http.server
```

Then open the printed URL. Opening `index.html` directly as a `file://` page won't work, because browsers block ES module imports from file URLs.

## Deploy

It's hosted on GitHub Pages from the root of the `master` branch (Settings → Pages → Deploy from a branch → `master` / `(root)`).

## Stack

- Three.js r169: the WebGPU renderer with TSL materials, falling back to WebGL2 when WebGPU isn't available
- PubChem PUG REST API
- A single `index.html`, with Three.js loaded from the jsDelivr CDN

## Repo layout

```
index.html   the web app
legacy/      the original C++ console version (Visual Studio project)
```
