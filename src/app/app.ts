import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LatexAiService } from './latex-ai.service';
import { animate } from 'motion';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private aiService = inject(LatexAiService);

  editorForm = new FormGroup({
    originalLatex: new FormControl('\\documentclass{article}\n\\begin{title}\nSubmission\n\\end{title}\n\\begin{document}\nThis is the original text.\n\\end{document}'),
    reviewerComments: new FormControl('Please add more details about the methodology and fix the title block.'),
    authorAttempt: new FormControl('\\documentclass{article}\n\\title{Revised Submission}\n\\begin{document}\nI added some methodology notes here.\n\\end{document}'),
    factualInfo: new FormControl('The experiment was conducted over 3 weeks with 50 participants.'),
  });

  refinedLatex = signal<string>('');
  isGenerating = signal<boolean>(false);
  error = signal<string | null>(null);

  async generateRefined() {
    if (this.isGenerating()) return;

    this.isGenerating.set(true);
    this.error.set(null);

    try {
      const values = this.editorForm.value;
      const result = await this.aiService.refineLatex({
        originalLatex: values.originalLatex ?? '',
        reviewerComments: values.reviewerComments ?? '',
        authorAttempt: values.authorAttempt ?? '',
        factualInfo: values.factualInfo ?? '',
      });
      this.refinedLatex.set(result);
      
      // Animation for the result column
      const resultEl = document.getElementById('result-column');
      if (resultEl) {
        animate(resultEl, { opacity: [0.5, 1], scale: [0.98, 1] }, { duration: 0.5 });
      }
    } catch (err) {
      console.error(err);
      this.error.set('Failed to generate refined LaTeX. Please check your API key and inputs.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.refinedLatex());
  }
}
