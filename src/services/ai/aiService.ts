import OpenAI from "openai";

class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
      dangerouslyAllowBrowser: true  // 允许在浏览器中运行
    });
  }

  async enhanceDescription(description: string): Promise<string> {
    if (!import.meta.env.VITE_DEEPSEEK_API_KEY) {
      console.warn('No API key provided for AI service');
      return description;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are an expert in writing engaging charity project descriptions. Enhance the following description to be more professional and appealing while maintaining its core message." 
          },
          { 
            role: "user", 
            content: description 
          }
        ],
        model: "deepseek-chat",
      });

      return completion.choices[0].message.content || description;
    } catch (error) {
      console.error('AI enhancement failed:', error);
      return description;
    }
  }

  async translateContent(content: string, targetLang: string): Promise<string> {
    if (!import.meta.env.VITE_DEEPSEEK_API_KEY) {
      console.warn('No API key provided for AI service');
      return content;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are a professional translator. Translate the following text to ${targetLang} while maintaining its tone and meaning.` 
          },
          { 
            role: "user", 
            content: content 
          }
        ],
        model: "deepseek-chat",
      });

      return completion.choices[0].message.content || content;
    } catch (error) {
      console.error('Translation failed:', error);
      return content;
    }
  }
}

export const aiService = new AIService();
