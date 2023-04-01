import { ZodIssue } from 'zod';

const formatErrorMessages = (issues: Array<ZodIssue>) =>
  issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`);

export default formatErrorMessages;
