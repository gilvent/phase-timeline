import { test, expect } from "@playwright/test";
import { testIds } from "../../constants";
import {
  getElementDOMRect,
  getElementScroll,
  scrollHorizontal
} from "../../utils";

test.describe("Timeline: KeyframeList Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("segment length should visually represent duration (1px = 1ms duration)", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList)
    const segment = await keyframeList.getByTestId(
      testIds.segment
    );
    const { width } = await getElementDOMRect(segment.first());
    const duration = await durationInput.inputValue();

    await expect(width).toEqual(parseInt(duration));
  });

  test("should update segment length when duration is changed", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList)
    const segment = await keyframeList.getByTestId(
      testIds.segment
    );

    await durationInput.click();
    await page.keyboard.type("1000");
    await page.mouse.click(0, 0);

    const { width } = await getElementDOMRect(segment.first());
    const duration = await durationInput.inputValue();

    await expect(width).toEqual(parseInt(duration));
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

    const { scrollTop: rulerContainerScrollTop } = await getElementScroll(rulerContainer);
    const { scrollTop: keyframeListScrollTop } =
      await getElementScroll(keyframeList);

    expect(keyframeListScrollTop).toEqual(rulerContainerScrollTop);
  });
});
