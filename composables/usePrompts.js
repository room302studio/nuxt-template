const usePrompts = () => {
  const formatInstructions = `IMPORTANT - You must format each issue using these exact XML tags:

<IssueTitle>Issue title here</IssueTitle>
<IssueText>Issue description here</IssueText>

Do not include any other formatting - no numbers, bullet points, or markdown. Just the XML tags.
Here's another example:

<IssueTitle>Implement user authentication</IssueTitle>
<IssueText>Create JWT-based authentication system with secure password hashing.</IssueText>`

  const systemMessage = `You are an expert at breaking down development requirements into clear GitHub issues. Your task is to analyze the requirements and generate a series of focused, actionable issues.

Generate your response as a series of issues using this format:

<IssueTitle>Create user authentication endpoint</IssueTitle>
<IssueText>Implement POST /api/auth endpoint that accepts username/password and returns JWT token.

Technical details:
- Use bcrypt for password hashing
- JWT should expire in 24 hours
- Return token in response body

This is part of the core authentication system.</IssueText>

<IssueTitle>Design login form component</IssueTitle>
<IssueText>Create a Vue component for the login form that integrates with the auth endpoint.

Requirements:
- Username/password fields
- Form validation
- Error handling
- Loading state while request processes
- Redirect to dashboard on success

Component should follow our existing design system.</IssueText>

Guidelines:
1. Break requirements into small, focused issues
2. Write clear, specific titles
3. Include relevant technical details in descriptions
4. Focus on one clear task (or user story) per issue
5. Include context about where this fits in the larger system
6. Note any critical dependencies
7. Try to keep issues to under 3 steps, if longer, break it down even further
8. Send any other sub-tasks in markdown, send any code snippets in triple backticks

${formatInstructions}`

  // Reminder message to use when the model might have forgotten the format
  const formatReminder = `Remember to use only the XML tags format:
<IssueTitle>Title</IssueTitle>
<IssueText>Description</IssueText>`

  const docToIssuesPrompt = (document) => [{
    role: 'user',
    content: systemMessage
  }, {
    role: 'user',
    content: `Please analyze this document and generate GitHub issues:\n\n${document}\n\n${formatInstructions}`
  }]

  const generateMorePrompt = (document, existingIssues, customInstructions = '') => {
    const messages = [
      {
        role: 'user',
        content: systemMessage
      },
      {
        role: 'user',
        content: `Please analyze this document and generate GitHub issues:\n\n${document}`
      }
    ]

    if (existingIssues.length) {
      const existingIssuesText = existingIssues
        .map(issue => `<IssueTitle>${issue.title}</IssueTitle>\n<IssueText>${issue.body}</IssueText>`)
        .join('\n\n')
      
      messages.push({
        role: 'assistant',
        content: existingIssuesText
      })
    }

    if (customInstructions) {
      messages.push({
        role: 'user',
        content: `Given the document and existing issues above, please generate additional issues with this focus: ${customInstructions}\n\n${formatReminder}`
      })
    }

    return messages
  }

  const combineIssuesPrompt = (issue1, issue2) => [{
    role: 'user',
    content: systemMessage
  }, {
    role: 'user',
    content: `Please combine these two related issues into a single, cohesive issue. Merge any overlapping points and maintain all important details from both issues.

Issue 1:
<IssueTitle>${issue1.title}</IssueTitle>
<IssueText>${issue1.body}</IssueText>

Issue 2:
<IssueTitle>${issue2.title}</IssueTitle>
<IssueText>${issue2.body}</IssueText>

Create a new combined issue that encompasses both. ${formatReminder}`
  }]

  const splitIssuePrompt = (issue) => [{
    role: 'user',
    content: systemMessage
  }, {
    role: 'user',
    content: `Please split this issue into exactly two separate, focused issues. Each should be complete and make sense on its own, while together they should cover all points from the original issue.

Original Issue:
<IssueTitle>${issue.title}</IssueTitle>
<IssueText>${issue.body}</IssueText}

Please provide exactly two new issues, no more and no less. ${formatReminder}`
  }]

  return {
    docToIssuesPrompt,
    generateMorePrompt,
    combineIssuesPrompt,
    splitIssuePrompt,
    formatInstructions,
    formatReminder
  }
}

export default usePrompts