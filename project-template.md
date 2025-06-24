# Project Name: [YOUR_PROJECT_NAME]

## Project Context & Overview
<project_context>
**Project Type:** [Web App/API/CLI Tool/Data Analysis/etc.]
**Primary Goal:** [What problem does this solve?]
**Target Users:** [Who will use this?]
**Tech Stack:** [List main technologies]
**Project Status:** [Planning/In Progress/Testing/Complete]
**Timeline:** [Expected completion date]
</project_context>

## Success Criteria
<success_criteria>
### Must-Have Features
- [ ] [Core feature 1 - specific and measurable]
- [ ] [Core feature 2 - specific and measurable]
- [ ] [Core feature 3 - specific and measurable]

### Nice-to-Have Features
- [ ] [Enhancement 1]
- [ ] [Enhancement 2]

### Performance Goals
- [ ] [Speed/efficiency requirements]
- [ ] [Quality/accuracy targets]
- [ ] [User experience standards]
</success_criteria>

## Project Structure
<project_structure>
```
project-root/
├── src/                    # Source code
│   ├── components/        # Reusable components
│   ├── pages/            # Main application pages
│   ├── utils/            # Helper functions
│   └── api/              # API endpoints
├── tests/                # Test files
├── docs/                 # Documentation
├── config/               # Configuration files
├── assets/               # Static assets
├── .env.example          # Environment variables template
├── README.md            # Project documentation
└── package.json         # Dependencies (or requirements.txt for Python)
```
</project_structure>

## Technical Specifications
<technical_specs>
### Architecture
**Pattern:** [MVC/Component-based/Microservices/etc.]
**Database:** [PostgreSQL/MongoDB/etc.]
**Authentication:** [JWT/OAuth/etc.]
**Deployment:** [Vercel/AWS/Docker/etc.]

### Key Dependencies
- [Library 1]: [Purpose and version]
- [Library 2]: [Purpose and version]
- [Library 3]: [Purpose and version]

### Environment Variables
```
DATABASE_URL=
API_KEY=
SECRET_KEY=
```
</technical_specs>

## Current Progress
<progress>
### Completed
- [x] [Completed task 1 with brief description]
- [x] [Completed task 2 with brief description]

### In Progress
- [ ] [Current task 1 - include blockers if any]
- [ ] [Current task 2 - include blockers if any]

### Next Steps (Priority Order)
1. [Next immediate task with clear deliverable]
2. [Second priority task]
3. [Third priority task]

### Known Issues/Blockers
- [Issue 1]: [Description and potential solution]
- [Issue 2]: [Description and potential solution]
</progress>

## Code Standards & Guidelines
<coding_standards>
### Code Style
- **Language Standards:** [Follow PEP 8 for Python/Airbnb for JS/etc.]
- **Naming Convention:** [camelCase/snake_case/etc.]
- **File Organization:** [How to structure new files]
- **Comments:** [When and how to comment code]

### Git Workflow
- **Branch Naming:** [feature/fix/refactor prefix]
- **Commit Messages:** [Conventional commits format]
- **PR Requirements:** [Code review, tests, etc.]

### Testing Requirements
- **Unit Tests:** [Coverage requirements]
- **Integration Tests:** [What needs testing]
- **Test Data:** [How to handle test data]
</coding_standards>

## Setup Instructions
<setup>
### Prerequisites
- [Software requirement 1 with version]
- [Software requirement 2 with version]
- [Account/API access needed]

### Installation Steps
1. Clone the repository
   ```bash
   git clone [repository-url]
   cd [project-name]
   ```

2. Install dependencies
   ```bash
   [package manager install command]
   ```

3. Environment setup
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Database setup (if applicable)
   ```bash
   [database migration/seed commands]
   ```

5. Run the project
   ```bash
   [start command]
   ```

### Troubleshooting Common Issues
- **Issue 1:** [Problem description and solution]
- **Issue 2:** [Problem description and solution]
</setup>

## AI Assistant Instructions
<ai_instructions>
### For Claude Chat
When working on this project, please:
- **Context First:** Always refer to this document for project context
- **Code Quality:** Write clean, well-commented code following the standards above
- **Problem-Solving:** Break complex tasks into smaller subtasks
- **Documentation:** Update this file when making significant changes
- **Testing:** Include appropriate tests for new functionality
- **Explanation:** Explain your reasoning and approach

### For Claude CLI
**Role:** You are a senior [relevant technology] developer working on this project.

**Instructions:**
- Read this CLAUDE.md file for full project context
- Follow the coding standards and architecture patterns defined above
- When creating new features, consider the project structure and existing patterns
- Always ask clarifying questions if requirements are unclear
- Suggest improvements to code quality, performance, or user experience
- Keep security and best practices in mind

**Output Preferences:**
- Provide complete, working solutions rather than partial code
- Include clear comments explaining complex logic
- Suggest additional files or changes needed
- Consider edge cases and error handling

### For Cursor/Windsurf/Other IDEs
This file serves as the single source of truth for:
- Project architecture and structure
- Coding standards and conventions
- Current progress and priorities
- Setup and deployment procedures

**Integration Notes:**
- Reference this file when suggesting code completions
- Maintain consistency with established patterns
- Consider the "Next Steps" section for prioritization
- Follow the technical specifications for new implementations
</ai_instructions>

## Resources & References
<resources>
### Documentation Links
- [Framework docs]: [URL]
- [API documentation]: [URL]
- [Design system]: [URL]

### Team Resources
- **Repository:** [GitHub/GitLab URL]
- **Deployment:** [Live URL]
- **Staging:** [Staging URL]
- **Design Files:** [Figma/etc. URL]
- **Project Management:** [Trello/Notion/etc. URL]

### Learning Resources
- [Tutorial 1]: [URL and brief description]
- [Tutorial 2]: [URL and brief description]
</resources>

## Prompting Examples
<prompt_examples>
### When Starting New Features
```
I need to implement [feature name] based on the requirements in this CLAUDE.md file. 

The feature should:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

Please provide a complete implementation following our project structure and coding standards. Include tests and update any necessary documentation.
```

### When Debugging Issues
```
I'm experiencing [specific issue description] in [file/component name].

Expected behavior: [What should happen]
Actual behavior: [What is happening]
Steps to reproduce: [How to recreate the issue]

Please analyze the code and provide a solution that follows our project's patterns and standards.
```

### When Optimizing Code
```
Please review and optimize [specific file/function] for:
- Performance improvements
- Code readability
- Following our established patterns
- Security considerations

Maintain all existing functionality while improving the implementation.
```
</prompt_examples>

---

## Template Usage Notes
<usage_notes>
### Customization Checklist
- [ ] Replace all [PLACEHOLDER] text with project-specific information
- [ ] Update file structure to match your actual project
- [ ] Customize coding standards for your team/language
- [ ] Add project-specific environment variables
- [ ] Include relevant links and resources
- [ ] Adapt AI instructions for your specific use case

### Maintenance
- Update progress section regularly
- Add new issues/blockers as they arise
- Revise success criteria as project evolves
- Keep dependencies and setup instructions current
- Document major architectural decisions

### Best Practices
- Be specific rather than generic in all sections
- Include examples where helpful
- Keep instructions clear and actionable
- Update this file when project direction changes
- Share with team members for consistency
</usage_notes>