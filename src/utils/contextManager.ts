const MAX_CONTEXT_MESSAGES = 50;
const ESTIMATED_TOKEN_COST_PER_MESSAGE = 0.002; // $0.002 per 1k tokens

let contextMessages: string[] = [];

export function addToContext(message: string) {
  contextMessages.push(message);
  if (contextMessages.length > MAX_CONTEXT_MESSAGES) {
    contextMessages.shift();
  }
}

export function getContext(): string[] {
  return contextMessages;
}

export function getEstimatedCost(numMessages: number): number {
  return numMessages * ESTIMATED_TOKEN_COST_PER_MESSAGE;
}