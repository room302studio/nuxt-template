declare module 'eventsource-parser' {
  export interface Parser {
    feed(chunk: string): void;
    reset(): void;
  }

  export interface ParserEvent {
    type: string;
    name: string;
    data?: string;
    target?: any;
    parentTag?: string;
    attributes?: Record<string, string>;
  }

  export function createParser(onParse?: (event: ParserEvent) => void): Parser;
} 