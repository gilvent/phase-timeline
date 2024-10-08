import { test, expect } from "@playwright/test";
import { testIds } from "../../constants";
import {
  getElementDOMRect,
  getElementScroll,
  scrollHorizontal
} from "../../utils";

test.describe("Timeline: Ruler Interaction", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("ruler length should visually represent duration (1px = 1ms duration)", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { width } = await getElementDOMRect(rulerBar);
    const duration = await durationInput.inputValue();

    await expect(width).toEqual(parseInt(duration));
  });

  test("should update ruler length when duration is changed", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );

    await durationInput.click();
    await page.keyboard.type("1000");
    await page.mouse.click(0, 0);

    const { width } = await getElementDOMRect(rulerBar);
    const duration = await durationInput.inputValue();

    await expect(width).toEqual(parseInt(duration));
  });

  test("should synchronize horizontal scroll with keyframe list", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList);
    const rulerContainer = await timeline.getByTestId(testIds.ruler);

    // set higher width
    await durationInput.click();
    await page.keyboard.type("5000");
    await page.keyboard.press("Enter");

    // horizontal scroll on keyframe list
    await scrollHorizontal(keyframeList, 300);
    await page.waitForTimeout(200)

    const { scrollLeft } = await getElementScroll(rulerContainer);
    expect(scrollLeft).not.toEqual(0);
  });
});
