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

export async function getElementDOMRect(locator: Locator): Promise<DOMRect> {
  return await locator.evaluate(node => node.getBoundingClientRect());
}
