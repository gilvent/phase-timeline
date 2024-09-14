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

export async function getElementScroll(
  locator: Locator
): Promise<{ scrollTop: number; scrollLeft: number }> {
  return await locator.evaluate(node => ({
    scrollTop: node.scrollTop,
    scrollLeft: node.scrollLeft
  }));
}

export async function scrollHorizontal(
  locator: Locator,
  distance: number
): Promise<void> {
  return await locator.evaluate(
    (node, distance: number) => {
      console.log(distance)
      node.scrollLeft += distance;
    },
    distance
  );
}

export async function scrollVertical(
  locator: Locator,
  distance: number
): Promise<void> {
  return await locator.evaluate(
    (node, distance: number) => {
      node.scrollTop += distance;
    },
    distance
  );
}
