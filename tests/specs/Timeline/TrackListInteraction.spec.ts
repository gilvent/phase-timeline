import { test, expect } from "@playwright/test";
import { testIds } from "../../constants";
import {
  getElementDOMRect,
  getElementScroll,
  scrollVertical
} from "../../utils";

test.describe("Timeline: TrackList Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("should synchronize vertical scroll with KeyframeList", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList);
    const trackList = await timeline.getByTestId(testIds.trackList);

    // vertical scroll on keyframe list
    await scrollVertical(keyframeList, 100);
    await page.waitForTimeout(200);

    const { scrollTop: trackListScrollTop } = await getElementScroll(trackList);
    const { scrollTop: keyframeListScrollTop } =
      await getElementScroll(keyframeList);
    expect(trackListScrollTop).toEqual(keyframeListScrollTop);
  });

  test("should synchronize vertical scroll with KeyframeList (mouse wheel)", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList);
    const trackList = await timeline.getByTestId(testIds.trackList);
    const { x: keyframeListX, y: keyframeListY } =
      await getElementDOMRect(keyframeList);

    await page.mouse.move(keyframeListX + 100, keyframeListY + 100);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(200);

    const { scrollTop: trackListScrollTop } = await getElementScroll(trackList);
    const { scrollTop: keyframeListScrollTop } =
      await getElementScroll(keyframeList);
    expect(trackListScrollTop).toEqual(keyframeListScrollTop);
  });
});
