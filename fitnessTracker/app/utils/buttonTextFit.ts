export const BUTTON_TEXT_SHRINK_STEP = 1;

export function shouldShrinkForWrap(lineCount: number): boolean {
  return lineCount > 1;
}

export function nextUniformFontSize(
  current: number,
  min: number,
  step: number = BUTTON_TEXT_SHRINK_STEP,
): number {
  return Math.max(min, current - step);
}

export function pickLargestUniformFontSize(
  steps: readonly number[],
  fitsAtSize: (size: number) => boolean,
): number {
  for (const size of steps) {
    if (fitsAtSize(size)) return size;
  }
  return steps[steps.length - 1];
}
