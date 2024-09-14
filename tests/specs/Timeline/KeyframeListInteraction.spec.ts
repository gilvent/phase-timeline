import { test, expect } from "@playwright/test";
import { pageUrl, testIds } from "../../constants";
import {
  getElementDOMRect,
  getElementScroll,
  scrollHorizontal
} from "../../utils";

test.describe("Timeline: KeyframeList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(pageUrl);
  });

  test("should synchronize horizontal scroll with Ruler", async ({
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
    await scrollHorizontal(rulerContainer, 300);
    await page.waitForTimeout(200);

    const { scrollLeft } = await getElementScroll(keyframeList);
    expect(scrollLeft).not.toEqual(0);
  });
});
