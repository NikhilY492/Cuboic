# Graph Report - .  (2026-05-22)

## Corpus Check
- 51 files · ~59,956 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 111 nodes · 182 edges · 5 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 51 · Candidates: 65
- Excluded: 0 untracked · 29673 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `bf123b9`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `processFile()` - 2 edges
2. `processDirectory()` - 2 edges
3. `localDate()` - 2 edges
4. `getDateRange()` - 2 edges
5. `closeModal()` - 2 edges
6. `handleSave()` - 2 edges
7. `getTableNum()` - 2 edges
8. `buildTableSummaries()` - 2 edges
9. `pickImage()` - 2 edges
10. `uploadProfilePicture()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (2): pickImage(), uploadProfilePicture()

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (2): closeModal(), handleSave()

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (2): buildTableSummaries(), getTableNum()

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (2): getDateRange(), localDate()

### Community 9 - "Community 9"
Cohesion: 1
Nodes (2): processDirectory(), processFile()

## Knowledge Gaps
- **Thin community `Community 0`** (2 nodes): `pickImage()`, `uploadProfilePicture()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (2 nodes): `closeModal()`, `handleSave()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (2 nodes): `buildTableSummaries()`, `getTableNum()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `processDirectory()`, `processFile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._