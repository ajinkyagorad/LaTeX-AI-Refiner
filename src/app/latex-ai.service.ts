import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";

@Injectable({
  providedIn: 'root'
})
export class LatexAiService {
  private ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  async refineLatex(params: {
    originalLatex: string;
    reviewerComments: string;
    authorAttempt: string;
    factualInfo: string;
  }): Promise<string> {
    const model = this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `
        You are an expert LaTeX editor and academic reviewer. 
        Your task is to generate a "neat version" of a LaTeX document by incorporating reviewer comments, author's revisions, and new factual data into the original submission.

        ORIGINAL SUBMISSION LATEX:
        ${params.originalLatex}

        REVIEWER COMMENTS:
        ${params.reviewerComments}

        AUTHOR'S REVISION ATTEMPT:
        ${params.authorAttempt}

        ADDITIONAL FACTUAL INFORMATION:
        ${params.factualInfo}

        INSTRUCTIONS:
        1. Produce a complete, valid LaTeX document.
        2. Address ALL reviewer comments precisely.
        3. Incorporate the author's new additions and factual information seamlessly.
        4. Maintain the style and structure of the original document as much as possible, but prioritize correctness and clarity.
        5. Use minimal edits where possible, but ensure all feedback is addressed.
        6. Return ONLY the LaTeX code. No explanations or markdown formatting.
      `,
    });

    const response = await model;
    return response.text || '';
  }
}
