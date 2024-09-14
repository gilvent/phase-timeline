import { test, expect } from "@playwright/test";
import { pageUrl, testIds } from "../../constants";
import { getPositionByLocator } from "../../utils";

test.describe("Timeline: Time Input", () => {
  test("should gain focus on click", async ({ page }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);

    await timeInput.click();

    await expect(timeInput).toBeFocused();
  });

  test("should not update time value on typing", async ({ page }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: initialPlayheadX } = await getPositionByLocator(playhead);

    await timeInput.click();
    await page.keyboard.type("100");

    const { x: lastPlayheadX } = await getPositionByLocator(playhead);

    await expect(timeInput).toHaveValue("100");
    // same playhead position means time value is not updated
    await expect(initialPlayheadX).toEqual(lastPlayheadX);
  });

  test("should update time value on pressing Enter", async ({ page }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: initialPlayheadX } = await getPositionByLocator(playhead);

    await timeInput.click();
    await page.keyboard.type("100");
    await page.keyboard.press("Enter");

    const { x: lastPlayheadX } = await getPositionByLocator(playhead);

    await expect(timeInput).toHaveValue("100");
    await expect(timeInput).not.toBeFocused();
    // different playhead position means time value is updated
    await expect(initialPlayheadX).not.toEqual(lastPlayheadX);
  });

  test("should update value on clicking anywhere outside input", async ({
    page
  }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: initialPlayheadX } = await getPositionByLocator(playhead);

    await timeInput.click();
    await page.keyboard.type("100");
    await page.mouse.click(0, 0);

    const { x: lastPlayheadX } = await getPositionByLocator(playhead);

    await expect(timeInput).toHaveValue("100");
    await expect(timeInput).not.toBeFocused();
    // different playhead position means time value is updated
    await expect(initialPlayheadX).not.toEqual(lastPlayheadX);
  });

  test("should update value on pressing Tab", async ({ page }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: initialPlayheadX } = await getPositionByLocator(playhead);

    await timeInput.click();
    await page.keyboard.type("100");
    await page.keyboard.press("Tab");

    const { x: lastPlayheadX } = await getPositionByLocator(playhead);

    await expect(timeInput).toHaveValue("100");
    await expect(timeInput).not.toBeFocused();
    // different playhead position means time value is updated
    await expect(initialPlayheadX).not.toEqual(lastPlayheadX);
  });

  test("should update value on pressing native step button", async ({
    page
  }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const playhead = await timeline.getByTestId(testIds.playhead);
    const expectations = [
      { key: "ArrowUp", inputValue: "110" },
      { key: "ArrowUp", inputValue: "120" },
      { key: "ArrowUp", inputValue: "130" },
      { key: "ArrowDown", inputValue: "120" },
      { key: "ArrowDown", inputValue: "110" },
      { key: "ArrowDown", inputValue: "100" }
    ];

    await timeInput.click();
    await page.keyboard.type("100");

    for (const e of expectations) {
      const { x: initialPlayheadX } = await getPositionByLocator(playhead);

      await page.keyboard.press(e.key);

      const { x: lastPlayheadX } = await getPositionByLocator(playhead);

      await expect(timeInput).toHaveValue(e.inputValue);
      // changing playhead position means time value is updated
      await expect(initialPlayheadX).not.toEqual(lastPlayheadX);
    }
  });

  test("should set to previous value on pressing Escape", async ({ page }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const playhead = await timeline.getByTestId(testIds.playhead);

    await timeInput.click();
    await page.keyboard.type("100");
    // set the value to 100
    await page.keyboard.press("Enter");

    const { x: initialPlayheadX } = await getPositionByLocator(playhead);

    await timeInput.click();
    await page.keyboard.type("130");
    await page.keyboard.press("Escape");

    const { x: lastPlayheadX } = await getPositionByLocator(playhead);

    await expect(timeInput).toHaveValue("100");
    await expect(timeInput).not.toBeFocused();
    // playhead is still on the same position as after clicking Enter
    await expect(initialPlayheadX).toEqual(lastPlayheadX);
  });

  test("should round decimal to nearest integer (round to nearest 10)", async ({
    page
  }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);

    await timeInput.click();
    await page.keyboard.type("105.5");
    await page.keyboard.press("Enter");

    await expect(timeInput).toHaveValue("110");
  });

  test("should adjust negative value to minimum allowed value (min is 0)", async ({
    page
  }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);

    await timeInput.click();
    await page.keyboard.type("-10");
    await page.keyboard.press("Enter");

    await expect(timeInput).toHaveValue("0");
  });

  test("should remove any leading zeros", async ({
    page
  }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);

    await timeInput.click();
    await page.keyboard.type("099");
    await page.keyboard.press("Enter");

    await expect(timeInput).toHaveValue("100");
  });

  test("should revert to previous valid value on invalid input", async ({
    page
  }) => {
    await page.goto(pageUrl);
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);

    // set valid value to 100
    await timeInput.click();
    await page.keyboard.type("100");
    await page.keyboard.press("Enter");

    await timeInput.click()
    await page.keyboard.type(".");
    await page.keyboard.press("Enter");
    
    await expect(timeInput).toHaveValue("100");
  });
});
