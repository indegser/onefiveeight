# Symbolic Analysis Example

Task pattern:

- Input: photographed chart, PDF lead sheet, or existing alignment JSON
- Preferred path: existing symbolic extraction or alignment artifact
- Output: normalized lead sheet plus harmonic analysis with uncertainty

Expected implementation shape:

- Adapter converts source artifact into measure-level symbolic evidence
- Symbolic pipeline normalizes chord symbols and section structure
- Theory layer estimates key and meter, then assigns roman numerals
- Critic layer flags unreadable bars, low-confidence key choice, and retry suggestions
