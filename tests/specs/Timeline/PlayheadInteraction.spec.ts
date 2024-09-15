import { test, expect } from "@playwright/test";
import { pageUrl, testIds } from "../../constants";
import {
  getElementDOMRect,
  scrollHorizontal
} from "../../utils";

test.describe("Timeline: Playhead Interaction", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("should maintain relative position when ruler is scrolled", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerContainer = await timeline.getByTestId(testIds.ruler);
    const playhead = await timeline.getByTestId(testIds.playhead);

    // set larger width
    await durationInput.click();
    await page.keyboard.type("5000");
    await page.keyboard.press("Enter");

    // set playhead position to 500
    await timeInput.click();
    await page.keyboard.type("500");
    await page.keyboard.press("Enter");
    
    await page.waitForTimeout(200)
    const { x: initialPlayheadX } = await getElementDOMRect(playhead);

    await scrollHorizontal(rulerContainer, 300);
    await page.waitForTimeout(100)
  
    const { x: lastPlayheadX } = await getElementDOMRect(playhead);
    expect(lastPlayheadX).toEqual(initialPlayheadX - 300);
  });

  test("should maintain relative position when keyframe list is scrolled", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList);
    const playhead = await timeline.getByTestId(testIds.playhead);

    // set larger width
    await durationInput.click();
    await page.keyboard.type("5000");
    await page.keyboard.press("Enter");

    // set playhead position to 500
    await timeInput.click();
    await page.keyboard.type("500");
    await page.keyboard.press("Enter");
    
    await page.waitForTimeout(200)
    const { x: initialPlayheadX } = await getElementDOMRect(playhead);

    await scrollHorizontal(keyframeList, 300);
    await page.waitForTimeout(300)
  
    const { x: lastPlayheadX } = await getElementDOMRect(playhead);
    expect(lastPlayheadX).toEqual(initialPlayheadX - 300);
  });

  test("should be hidden when relative position exceeds right boundary", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const playhead = await timeline.getByTestId(testIds.playhead);

    // set larger width
    await durationInput.click();
    await page.keyboard.type("5000");
    await page.keyboard.press("Enter");

    // set playhead position to 4500
    await timeInput.click();
    await page.keyboard.type("4500");
    await page.keyboard.press("Enter");

    await page.waitForTimeout(200)


    expect(playhead).toBeHidden();
  });

  test("should be hidden when relative position exceeds left boundary", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const keyframeList = await timeline.getByTestId(testIds.keyframeList);
    const playhead = await timeline.getByTestId(testIds.playhead);

    // set larger width
    await durationInput.click();
    await page.keyboard.type("5000");
    await page.keyboard.press("Enter");

    // set playhead position to 500
    await timeInput.click();
    await page.keyboard.type("500");
    await page.keyboard.press("Enter");
    
    await page.waitForTimeout(300)

    // scroll to the right more than current time value
    await scrollHorizontal(keyframeList, 550);
    await page.waitForTimeout(150)

    expect(playhead).toBeHidden()
  });
});
