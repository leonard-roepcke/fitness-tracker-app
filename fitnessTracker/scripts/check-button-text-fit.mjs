function shouldShrinkForWrap(lineCount) {
  return lineCount > 1;
}

function nextUniformFontSize(current, min, step = 1) {
  return Math.max(min, current - step);
}

function pickLargestUniformFontSize(steps, fitsAtSize) {
  for (const size of steps) {
    if (fitsAtSize(size)) return size;
  }
  return steps[steps.length - 1];
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(shouldShrinkForWrap(1) === false, 'single line should not shrink');
assert(shouldShrinkForWrap(2) === true, 'wrapped text should shrink');
assert(nextUniformFontSize(14, 10) === 13, 'font size should shrink by one step');
assert(nextUniformFontSize(10, 10) === 10, 'font size should not go below minimum');

const picked = pickLargestUniformFontSize([16, 15, 14], (size) => size >= 14);
assert(picked === 16, 'largest fitting uniform size should be picked');

const pickedMin = pickLargestUniformFontSize([16, 15, 14], () => false);
assert(pickedMin === 14, 'smallest step should be used when nothing fits');

console.log('button text fit checks passed');
