import { describe, expect, it } from 'vitest';
import { githubUrlSchema, prScoreSchema } from '@/lib/schemas';

describe('githubUrlSchema', () => {
  describe('valid URLs', () => {
    it('parses standard https URL', () => {
      const result = githubUrlSchema.parse('https://github.com/facebook/react');
      expect(result).toEqual({ owner: 'facebook', repo: 'react' });
    });

    it('parses http URL', () => {
      const result = githubUrlSchema.parse('http://github.com/owner/repo');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('strips trailing slash', () => {
      const result = githubUrlSchema.parse('https://github.com/owner/repo/');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('strips .git suffix', () => {
      const result = githubUrlSchema.parse('https://github.com/owner/repo.git');
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('strips both .git suffix and trailing slash', () => {
      const result = githubUrlSchema.parse(
        'https://github.com/owner/repo.git/',
      );
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('extracts owner/repo from URL with extra path segments', () => {
      const result = githubUrlSchema.parse(
        'https://github.com/owner/repo/tree/main',
      );
      expect(result).toEqual({ owner: 'owner', repo: 'repo' });
    });

    it('handles dots and hyphens in names', () => {
      const result = githubUrlSchema.parse('https://github.com/my-org/my.repo');
      expect(result).toEqual({ owner: 'my-org', repo: 'my.repo' });
    });
  });

  describe('invalid URLs', () => {
    it('rejects URL with missing repo segment', () => {
      expect(() =>
        githubUrlSchema.parse('https://github.com/onlyone'),
      ).toThrow();
    });

    it('rejects non-GitHub host', () => {
      expect(() =>
        githubUrlSchema.parse('https://gitlab.com/owner/repo'),
      ).toThrow();
    });

    it('rejects garbage input', () => {
      expect(() => githubUrlSchema.parse('not-a-url')).toThrow();
    });

    it('rejects empty string', () => {
      expect(() => githubUrlSchema.parse('')).toThrow();
    });

    it('rejects URL with no owner or repo', () => {
      expect(() => githubUrlSchema.parse('https://github.com/')).toThrow();
    });

    it('rejects invalid characters in owner', () => {
      expect(() =>
        githubUrlSchema.parse('https://github.com/owner@bad/repo'),
      ).toThrow();
    });
  });
});

describe('prScoreSchema', () => {
  const validPrScore = {
    id: 1,
    title: 'Fix bug',
    author: 'user',
    additions: 10,
    deletions: 5,
    changedFiles: 2,
    impact: 70,
    aiLeverage: 50,
    quality: 80,
    totalScore: 65,
    summary: 'A bug fix',
    diffUrl: 'https://github.com/owner/repo/pull/1/files',
  };

  describe('diffUrl validation', () => {
    it('accepts valid GitHub diff URL', () => {
      const result = prScoreSchema.parse(validPrScore);
      expect(result.diffUrl).toBe(
        'https://github.com/owner/repo/pull/1/files',
      );
    });

    it('rejects non-GitHub URL', () => {
      expect(() =>
        prScoreSchema.parse({
          ...validPrScore,
          diffUrl: 'https://gitlab.com/owner/repo/pull/1',
        }),
      ).toThrow('Diff URL must be a GitHub URL');
    });

    it('rejects javascript: protocol', () => {
      expect(() =>
        prScoreSchema.parse({
          ...validPrScore,
          diffUrl: 'javascript:alert(1)',
        }),
      ).toThrow();
    });

    it('rejects non-URL strings', () => {
      expect(() =>
        prScoreSchema.parse({ ...validPrScore, diffUrl: 'not-a-url' }),
      ).toThrow();
    });
  });
});
