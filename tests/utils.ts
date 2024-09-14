import { Locator } from "@playwright/test";

export async function isInputSelected(input: Locator): Promise<boolean> {
  const selections = await input.evaluate((element: HTMLInputElement) => {
    return element;
  });

  return (
    selections.selectionStart === 0 &&
    selections.selectionEnd === input.inputValue.length
  );
}

export async function getPositionByLocator(
  locator: Locator
): Promise<{ x: number; y: number }> {
  return await locator.evaluate(node => {
    const rect = node.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y
    };
  });
}
