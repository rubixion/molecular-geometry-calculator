## Repo Move

This project is now integrated into the ollie frontend repo and hosted at:
https://www.ollieml.com/chemistry

# Molecular Geometry Calculator

Started as a C++ console app that parsed chemical formulas, calculated VSEPR geometry, and printed bond angles to stdout. It worked fine but wasn't very useful.

Rebuilt as a web viewer that reenders the actual 3D molecular structure using Three.js (WebGPU) and pulls real data from the PubChem API. Ionic compounds like Na₂SO₄ that don't have PubChem entries fall back to a synthetic structure built from the formula unit.

## What it does

- Search by name (*caffeine*, *aspirin*) or formula (*H₂O*, *Na₂SO₄*)
- 3D structure from PubChem's conformer database, 2D layout fallback if no conformer exists
- VSEPR geometry detection and bond angle for single-centre molecules
- Click any atom for element data, bonding info, formal charge, hybridisation

## Controls

| | |
|---|---|
| Drag | Orbit |
| Scroll | Zoom |
| Right-drag | Pan |
| R | Reset view |
| Click atom | Atom info |

## Stack

Three.js r169 (WebGPU renderer, TSL materials) · PubChem REST API · single HTML file, no build step

