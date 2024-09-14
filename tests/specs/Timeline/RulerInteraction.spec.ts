import { test, expect } from "@playwright/test";
import { pageUrl, testIds } from "../../constants";
import {
  getElementDOMRect,
  getElementScroll,
  scrollHorizontal
} from "../../utils";

test.describe("Timeline: Ruler Interaction", () => {
  async function expectPlayheadPositionEqualToMousePosition(
    playheadX: number,
    mouseX: number
  ) {
    const playheadXToMouseXDistance = Math.abs(playheadX - mouseX);
    // In browser, it is possible that mouse position is not exactly the same as the playhead,
    // therefore use the maxDiffPixels.
    const maxDiffPixels = 1;

    await expect(playheadXToMouseXDistance <= maxDiffPixels).toEqual(true);
  }

  test.beforeEach(async ({ page }) => {
    await page.goto(pageUrl);
  });

  test("ruler length should visually represent duration (1px = 1ms duration)", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerDraggableArea = await timeline.getByTestId(
      testIds.rulerDraggableArea
    );
    const { width } = await getElementDOMRect(rulerDraggableArea);
    const duration = await durationInput.inputValue();

    await expect(width).toEqual(parseInt(duration));
  });

  test("should update ruler length when duration is changed", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const durationInput = await timeline.getByTestId(testIds.durationInput);
    const rulerDraggableArea = await timeline.getByTestId(
      testIds.rulerDraggableArea
    );

    await durationInput.click();
    await page.keyboard.type("1000");
    await page.mouse.click(0, 0);

    const { width } = await getElementDOMRect(rulerDraggableArea);
    const duration = await durationInput.inputValue();

    await expect(width).toEqual(parseInt(duration));
  });

  test("should update playhead position on clicking", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const rulerDraggableArea = await timeline.getByTestId(
      testIds.rulerDraggableArea
    );
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerDraggableArea);
    const clickX = rulerAreaX + 100;

    await page.mouse.click(clickX, rulerAreaY + 10);

    const { x: playheadX } = await getElementDOMRect(playhead);
    await expectPlayheadPositionEqualToMousePosition(playheadX, clickX);
  });

  test("should update time on clicking", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const rulerDraggableArea = await timeline.getByTestId(
      testIds.rulerDraggableArea
    );
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerDraggableArea);
    const prevTime = await timeInput.inputValue();

    // clicking 100px away from the start of draggable area
    await page.mouse.click(rulerAreaX + 100, rulerAreaY + 10);

    const time = await timeInput.inputValue();
    await expect(parseInt(time) - parseInt(prevTime)).toEqual(100);
  });

  test("should update time on dragging", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const rulerDraggableArea = await timeline.getByTestId(
      testIds.rulerDraggableArea
    );
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerDraggableArea);
    const prevTime = await timeInput.inputValue();
    const clickX = rulerAreaX + 100;
    const dragDistance = 200;

    await page.mouse.move(clickX, rulerAreaY + 10);
    await page.mouse.down();
    await page.mouse.move(clickX + dragDistance, rulerAreaY + 10);

    const time = await timeInput.inputValue();
    const timeDiff = parseInt(time) - parseInt(prevTime);

    await expect(timeDiff).toEqual(300);
  });

  test("should update playhead position on dragging", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const rulerDraggableArea = await timeline.getByTestId(
      testIds.rulerDraggableArea
    );
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerDraggableArea);
    const initialClickX = rulerAreaX + 100;
    const dragDistance = 200;

    await page.mouse.move(initialClickX, rulerAreaY + 10);
    await page.mouse.down();
    await page.mouse.move(initialClickX + dragDistance, rulerAreaY + 10);

    const { x: playheadX } = await getElementDOMRect(playhead);

    await expectPlayheadPositionEqualToMousePosition(
      playheadX,
      initialClickX + dragDistance
    );
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
