import { test, expect } from "@playwright/test";
import { pageUrl, testIds } from "../../constants";
import {
  getElementDOMRect,
} from "../../utils";

test.describe("Timeline: Moving Playhead On Ruler Interaction", () => {
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

  test("should update playhead position when clicking on ruler", async ({ page }) => {
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

  test("should update time when clicking on ruler", async ({ page }) => {
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

  test("should update time when dragging playhead", async ({ page }) => {
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

  test("should update playhead position when dragging playhead", async ({ page }) => {
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
});
