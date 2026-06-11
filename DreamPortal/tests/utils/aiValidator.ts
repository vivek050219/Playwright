/**
 * AI Validator for Dream Classification
 * 
 * This file contains functionality for AI-based validation of dream names.
 * It uses OpenAI API to classify dream names as "Good" or "Bad" and compares
 * the AI classification with the table values.
 * 
 * Requirements:
 * - OPENAI_API_KEY environment variable must be set
 * - This is a BONUS feature for additional validation
 */

/**
 * Dream classification from AI
 */
export interface AIClassification {
  dreamName: string;
  aiClassification: string;
  confidence: number;
  reasoning: string;
}

/**
 * Validation result comparing table value with AI classification
 */
export interface ClassificationValidation {
  dreamName: string;
  tableValue: string;
  aiValue: string;
  isMatching: boolean;
  confidence: number;
}

export class AIValidator {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';
  private model: string = 'gpt-3.5-turbo';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('WARNING: OpenAI API key not found. AI validation will be skipped.');
      console.warn('Set OPENAI_API_KEY environment variable to enable AI validation.');
    }
  }

  /**
   * Check if AI validator is properly configured
   * @returns boolean - True if API key is available
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Classify a single dream using OpenAI API
   * @param dreamName - The name of the dream to classify
   * @returns AIClassification - The classification result with reasoning
   */
  async classifyDream(dreamName: string): Promise<AIClassification> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.');
    }

    try {
      const prompt = `You are an AI assistant that classifies dreams as "Good" or "Bad" based on their emotional context.

Dream Name: "${dreamName}"

Classify this dream as either "Good" or "Bad" based on whether it represents a positive or negative dream experience. 
Also provide your confidence level (0-1) and brief reasoning.

Respond in JSON format only:
{
  "classification": "Good" or "Bad",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation"
}`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data: any = await response.json();
      const content = data.choices[0].message.content;
      const result = JSON.parse(content);

      return {
        dreamName,
        aiClassification: result.classification,
        confidence: result.confidence,
        reasoning: result.reasoning,
      };
    } catch (error) {
      console.error(`Error classifying dream "${dreamName}":`, error);
      throw error;
    }
  }

  /**
   * Classify multiple dreams in batch
   * @param dreamNames - Array of dream names to classify
   * @returns AIClassification[] - Array of classification results
   */
  async classifyDreams(dreamNames: string[]): Promise<AIClassification[]> {
    const results: AIClassification[] = [];

    for (const dreamName of dreamNames) {
      try {
        const classification = await this.classifyDream(dreamName);
        results.push(classification);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn(`Failed to classify dream "${dreamName}":`, error);
        // Continue with next dream even if one fails
      }
    }

    return results;
  }

  /**
   * Validate dream classifications against table values
   * @param tableValues - Array of dream classification values from the table
   * @param dreamNames - Array of dream names corresponding to the table values
   * @returns ClassificationValidation[] - Validation results
   */
  async validateDreamClassifications(
    dreamNames: string[],
    tableValues: string[]
  ): Promise<ClassificationValidation[]> {
    if (!this.isConfigured()) {
      console.warn('AI validation is disabled. Returning empty results.');
      return [];
    }

    if (dreamNames.length !== tableValues.length) {
      throw new Error('Dream names and table values arrays must have the same length');
    }

    const aiClassifications = await this.classifyDreams(dreamNames);
    const validations: ClassificationValidation[] = [];

    for (let i = 0; i < dreamNames.length; i++) {
      const aiClass = aiClassifications.find(c => c.dreamName === dreamNames[i]);
      
      if (aiClass) {
        validations.push({
          dreamName: dreamNames[i],
          tableValue: tableValues[i],
          aiValue: aiClass.aiClassification,
          isMatching: aiClass.aiClassification === tableValues[i],
          confidence: aiClass.confidence,
        });
      }
    }

    return validations;
  }

  /**
   * Get a summary of validation accuracy
   * @param validations - Array of validation results
   * @returns object - Summary statistics
   */
  getValidationSummary(validations: ClassificationValidation[]): {
    totalValidations: number;
    matchingCount: number;
    mismatchCount: number;
    accuracyPercentage: number;
    averageConfidence: number;
    mismatches: ClassificationValidation[];
  } {
    const matching = validations.filter(v => v.isMatching).length;
    const mismatching = validations.filter(v => !v.isMatching);
    const avgConfidence =
      validations.length > 0
        ? validations.reduce((sum, v) => sum + v.confidence, 0) / validations.length
        : 0;

    return {
      totalValidations: validations.length,
      matchingCount: matching,
      mismatchCount: mismatching.length,
      accuracyPercentage: validations.length > 0 ? (matching / validations.length) * 100 : 0,
      averageConfidence: avgConfidence,
      mismatches: mismatching,
    };
  }
}
