declare module 'lingo.dev' {
  interface LingoClient {
    new (options: { apiKey: string }): LingoClient;
    getTranslation(text: string, targetLanguage: string): Promise<string>;
  }

  const Lingo: LingoClient;
  export default Lingo;
} 