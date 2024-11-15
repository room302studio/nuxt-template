import { describe, it, expect } from 'vitest';
import { parseIssuesFromStream, streamIssues } from './useLLMToIssues';

describe('parseIssuesFromStream', () => {
  it('should parse a stream of XML into Issue objects', async () => {
    const xml = `
      <IssueTitle>Issue 1</IssueTitle>
      <IssueText>This is the first issue.</IssueText>
      <IssueTitle>Issue 2</IssueTitle>
      <IssueText>This is the second issue.</IssueText>
    `;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(xml);
        controller.close();
      },
    });

    const issues = [];
    for await (const issue of parseIssuesFromStream(stream)) {
      issues.push(issue);
    }

    expect(issues).toEqual([
      { title: 'Issue 1', body: 'This is the first issue.' },
      { title: 'Issue 2', body: 'This is the second issue.' },
    ]);
  });

  it('should handle errors in the XML stream', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('<IssueTitle>Malformed XML');
        controller.close();
      },
    });

    await expect(async () => {
      for await (const _ of parseIssuesFromStream(stream)) {
        // do nothing
      }
    }).rejects.toThrow();
  });
});

describe('streamIssues', () => {
  it('should stream issues from the OpenRouter API', async () => {
    const mockResponse = new Response(`
      <IssueTitle>Issue 1</IssueTitle>
      <IssueText>This is the first issue.</IssueText>
      <IssueTitle>Issue 2</IssueTitle>
      <IssueText>This is the second issue.</IssueText>
    `, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const issues = [];
    const errors = [];
    await streamIssues(
      'fake_api_key',
      'Fake prompt',
      (issue) => issues.push(issue),
      (err) => errors.push(err),
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake_api_key',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          prompt: 'Fake prompt',
          stream: true,
        }),
      }),
    );
    expect(issues).toEqual([
      { title: 'Issue 1', body: 'This is the first issue.' },
      { title: 'Issue 2', body: 'This is the second issue.' },
    ]);
    expect(errors).toEqual([]);
  });

  it('should handle HTTP errors from the OpenRouter API', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response('', { status: 500 }));

    const issues = [];
    const errors = [];
    await streamIssues(
      'fake_api_key',
      'Fake prompt',
      (issue) => issues.push(issue),
      (err) => errors.push(err),
    );

    expect(issues).toEqual([]);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('HTTP error! status: 500');
  });
});