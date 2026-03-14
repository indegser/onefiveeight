import fs from "node:fs/promises"
import path from "node:path"
import { schemas } from "./schemas.mjs"
import { KNOWLEDGE_PATTERNS_DIR } from "./shared-state.mjs"

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "app",
  "build",
  "for",
  "from",
  "in",
  "into",
  "is",
  "of",
  "on",
  "or",
  "page",
  "screen",
  "the",
  "to",
  "with"
])

export async function buildTaskMemory({ ideaFilePath, goal, constraints = [] }) {
  const patterns = await loadKnowledgePatterns()

  if (patterns.length === 0) {
    return {
      patterns: [],
      notes: ["No knowledge patterns were available when this run was initialized."]
    }
  }

  const ideaText = await fs.readFile(ideaFilePath, "utf8")
  const queryTerms = collectQueryTerms([goal, ideaText, constraints.join(" ")])

  const selectedPatterns = patterns
    .map((pattern) => scorePattern(pattern, queryTerms))
    .filter((pattern) => pattern.applicability_score > 0)
    .sort((left, right) => right.applicability_score - left.applicability_score)
    .slice(0, 5)

  return {
    patterns: selectedPatterns,
    notes: [
      "Task memory is derived from ./.ai/knowledge/patterns at run initialization.",
      selectedPatterns.length > 0
        ? "Patterns were selected using simple keyword overlap with the goal, constraints, and idea file."
        : "No stored patterns matched the current task strongly enough to preload."
    ]
  }
}

async function loadKnowledgePatterns() {
  let entries = []

  try {
    entries = await fs.readdir(KNOWLEDGE_PATTERNS_DIR, { withFileTypes: true })
  } catch {
    return []
  }

  const jsonFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  const patterns = []

  for (const entry of jsonFiles) {
    const filePath = path.join(KNOWLEDGE_PATTERNS_DIR, entry.name)
    const raw = await fs.readFile(filePath, "utf8")
    const pattern = JSON.parse(raw)
    schemas.knowledgePattern.parse(pattern)
    patterns.push(pattern)
  }

  return patterns
}

function collectQueryTerms(values) {
  return new Set(
    values
      .flatMap((value) => tokenize(value))
      .filter((token) => !STOP_WORDS.has(token))
  )
}

function scorePattern(pattern, queryTerms) {
  const searchableTerms = new Set(
    tokenize([
      pattern.id,
      pattern.title,
      pattern.summary,
      ...pattern.tags,
      ...pattern.when_to_use,
      ...pattern.constraints,
      ...pattern.solution_outline,
      ...pattern.source_projects
    ].join(" "))
  )

  let score = 0
  const matchedTerms = []

  for (const term of queryTerms) {
    if (searchableTerms.has(term)) {
      score += 1
      matchedTerms.push(term)
    }
  }

  return {
    ...pattern,
    applicability_score: score,
    selected_because:
      matchedTerms.length > 0
        ? `Matched task terms: ${matchedTerms.slice(0, 6).join(", ")}`
        : "Pattern was not matched by the current task context."
  }
}

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 3)
}
