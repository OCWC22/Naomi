## 04-19-2025 - Added .gitignore file

### Files Updated:
- `/Users/chen/Desktop/Projects/Naomi/.gitignore`: Created file and added `.DS_Store`

### Description:
Created a `.gitignore` file to prevent macOS system files (`.DS_Store`) from being tracked by Git.

### Reasoning:
`.DS_Store` files are specific to macOS Finder and contain folder view options. They are not relevant to the project's code or functionality and should not be committed to the repository.

### Trade-offs:
- None. Ignoring these files is standard practice.

### Considerations:
- Ensures a cleaner Git history by excluding system-specific metadata.

### Future Work:
- Consider adding other common entries to `.gitignore` (e.g., `node_modules`, environment files, build outputs) as the project evolves.
