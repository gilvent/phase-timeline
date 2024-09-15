import { test, expect } from "@playwright/test";
import { testIds } from "../../constants";
import { getElementDOMRect } from "../../utils";

test.describe("Timeline: Duration Input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("should gain focus on click", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);

    await durationInput.click();

    await expect(durationInput).toBeFocused();
  });

  test("should not update value on typing", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { width: initialRulerWidth } =
      await getElementDOMRect(rulerBar);

    await durationInput.click();
    await page.keyboard.type("100");

    const { width: lastRulerWidth } =
      await getElementDOMRect(rulerBar);

    await expect(durationInput).toHaveValue("100");
    // same ruler drag area width means duration value is not updated
    await expect(initialRulerWidth).toEqual(lastRulerWidth);
  });

  test("should update value on pressing Enter", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { width: initialRulerWidth } =
      await getElementDOMRect(rulerBar);

    await durationInput.click();
    await page.keyboard.type("100");
    await page.keyboard.press("Enter");

    const { width: lastRulerWidth } =
      await getElementDOMRect(rulerBar);

    await expect(durationInput).toHaveValue("100");
    await expect(durationInput).not.toBeFocused();
    await expect(durationInput).toHaveValue("100");
    // same ruler drag area width means duration value is not updated
    await expect(initialRulerWidth).not.toEqual(lastRulerWidth);
  });

  test("should update value on clicking anywhere outside input", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { width: initialRulerWidth } =
      await getElementDOMRect(rulerBar);

    await durationInput.click();
    await page.keyboard.type("200");
    await page.mouse.click(0, 0);

    const { width: lastRulerWidth } =
      await getElementDOMRect(rulerBar);

    await expect(durationInput).toHaveValue("200");
    await expect(durationInput).not.toBeFocused();
    // different ruler drag area width means duration value is updated
    await expect(initialRulerWidth).not.toEqual(lastRulerWidth);
  });

  test("should update value on pressing Tab", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { width: initialRulerWidth } =
      await getElementDOMRect(rulerBar);

    await durationInput.click();
    await page.keyboard.type("100");
    await page.keyboard.press("Tab");

    const { width: lastRulerWidth } =
      await getElementDOMRect(rulerBar);

    await expect(durationInput).toHaveValue("100");
    await expect(durationInput).not.toBeFocused();
    // different ruler drag area width means duration value is updated
    await expect(initialRulerWidth).not.toEqual(lastRulerWidth);
  });

  test("should update value on pressing native step button", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const expectations = [
      { key: "ArrowUp", inputValue: "110" },
      { key: "ArrowUp", inputValue: "120" },
      { key: "ArrowUp", inputValue: "130" },
      { key: "ArrowDown", inputValue: "120" },
      { key: "ArrowDown", inputValue: "110" },
      { key: "ArrowDown", inputValue: "100" }
    ];

    await durationInput.click();
    await page.keyboard.type("100");

    for (const e of expectations) {
      const { width: initialRulerWidth } =
        await getElementDOMRect(rulerBar);

      await page.keyboard.press(e.key);

      const { width: lastRulerWidth } =
        await getElementDOMRect(rulerBar);

      await expect(durationInput).toHaveValue(e.inputValue);
      // changing ruler drag width means duration is updated
      await expect(initialRulerWidth).not.toEqual(lastRulerWidth);
    }
  });

  test("should set to previous value on pressing Escape", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );

    await durationInput.click();
    await page.keyboard.type("100");
    // set the value to 100
    await page.keyboard.press("Enter");

    const { width: initialRulerWidth } =
      await getElementDOMRect(rulerBar);

    await durationInput.click();
    await page.keyboard.type("130");
    await page.keyboard.press("Escape");

    const { width: lastRulerWidth } =
      await getElementDOMRect(rulerBar);

    await expect(durationInput).toHaveValue("100");
    await expect(durationInput).not.toBeFocused();
    // changing ruler drag width means duration is updated
    await expect(initialRulerWidth).toEqual(lastRulerWidth);
  });

  test("should remove any leading zeros", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);

    await durationInput.click();
    await page.keyboard.type("099");
    await page.keyboard.press("Enter");

    await expect(durationInput).toHaveValue("100");
  });

  test("should revert to previous valid value on invalid input", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);

    // set valid value to 100
    await durationInput.click();
    await page.keyboard.type("100");
    await page.keyboard.press("Enter");

    await durationInput.click();
    await page.keyboard.type(".");
    await page.keyboard.press("Enter");

    await expect(durationInput).toHaveValue("100");
  });

  test("should be between 100ms and 6000ms", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);

    await durationInput.click();
    await page.keyboard.type("99");
    await page.keyboard.press("Enter");

    await expect(durationInput).toHaveValue("100");

    await durationInput.click();
    await page.keyboard.type("9999");
    await page.keyboard.press("Enter");
  });

  test("should adjust value to be multiples of 10", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);

    await durationInput.click();
    await page.keyboard.type("5001");
    await page.keyboard.press("Enter");

    await expect(durationInput).toHaveValue("5000");
  });

  test("should update time input value if duration < time", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const durationInput = await timeline.getByTestId(testIds.durationInput);

    await durationInput.click();
    await page.keyboard.type("5000");

    await timeInput.click();
    await page.keyboard.type("3000");

    await durationInput.click();
    await page.keyboard.type("2000");
    await page.keyboard.press("Enter");

    await expect(timeInput).toHaveValue("2000");
  });
});
