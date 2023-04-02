const formatErrorMessages = (issues) => issues.map((issue) => `${issue.path.join('.')} is ${issue.message}`);
export default formatErrorMessages;
