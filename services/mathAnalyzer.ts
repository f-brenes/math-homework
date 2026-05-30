import OpenAI from 'openai';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const SYSTEM_PROMPT = `You are an expert math tutor specializing in algebra, arithmetic, calculus, geometry, trigonometry, and statistics. Your role is to:

1. Identify every math problem visible in the provided image.
2. Solve each problem completely and correctly.
3. Provide a thorough, step-by-step breakdown of how you reached each answer, explaining the reasoning and rules applied at every step.
4. Use clear, student-friendly language so the explanation teaches — not just tells.
5. Highlight the final answer for each problem distinctly.

Respond in the following structured format (repeat for each problem found):

---
PROBLEM [N]: <restate the problem exactly as written>

APPROACH: <briefly name the method or concept used, e.g. "Linear equation — isolate the variable">

STEP-BY-STEP SOLUTION:
Step 1: <action taken and why>
Step 2: <action taken and why>
... (as many steps as needed)

ANSWER: <final answer, clearly stated>

KEY CONCEPTS: <bullet list of math rules or properties applied>
---

If no math problems are found in the image, say so clearly and suggest what the image contains instead.`;

export interface MathSolution {
  problemNumber: number;
  problem: string;
  approach: string;
  steps: string[];
  answer: string;
  keyConcepts: string[];
}

export interface AnalysisResult {
  solutions: MathSolution[];
  rawText: string;
  error?: string;
}

function parseResponse(text: string): MathSolution[] {
  const blocks = text.split(/---+/).filter(b => b.trim());
  const solutions: MathSolution[] = [];

  for (const block of blocks) {
    const problemMatch = block.match(/PROBLEM\s*\[?(\d+)\]?:\s*(.+?)(?=\n|APPROACH)/s);
    const approachMatch = block.match(/APPROACH:\s*(.+?)(?=\n|STEP)/s);
    const stepsMatch = block.match(/STEP-BY-STEP SOLUTION:\s*([\s\S]+?)(?=\nANSWER:)/);
    const answerMatch = block.match(/ANSWER:\s*(.+?)(?=\n|KEY CONCEPTS|$)/s);
    const keyMatch = block.match(/KEY CONCEPTS:\s*([\s\S]+?)(?=---|$)/);

    if (!problemMatch || !answerMatch) continue;

    const rawSteps = stepsMatch?.[1] ?? '';
    const steps = rawSteps
      .split(/\n/)
      .map(l => l.replace(/^Step\s*\d+:\s*/i, '').trim())
      .filter(Boolean);

    const rawConcepts = keyMatch?.[1] ?? '';
    const keyConcepts = rawConcepts
      .split(/\n/)
      .map(l => l.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);

    solutions.push({
      problemNumber: parseInt(problemMatch[1], 10),
      problem: problemMatch[2].trim(),
      approach: approachMatch?.[1].trim() ?? '',
      steps,
      answer: answerMatch[1].trim(),
      keyConcepts,
    });
  }

  return solutions;
}

async function uriToBase64(uri: string): Promise<{ base64: string; mimeType: string }> {
  if (uri.startsWith('data:')) {
    const [header, base64] = uri.split(',');
    const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
    return { base64, mimeType };
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function analyzeMathImage(imageUri: string): Promise<AnalysisResult> {
  if (!apiKey) {
    return { solutions: [], rawText: '', error: 'OpenAI API key not configured.' };
  }

  try {
    const { base64, mimeType } = await uriToBase64(imageUri);

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: 'Please solve all math problems visible in this image with full step-by-step explanations.',
            },
          ],
        },
      ],
    });

    const rawText = response.choices[0]?.message?.content ?? '';
    const solutions = parseResponse(rawText);

    return { solutions, rawText };
  } catch (err: any) {
    return {
      solutions: [],
      rawText: '',
      error: err?.message ?? 'Failed to analyze image.',
    };
  }
}
