import { test, expect } from "@playwright/test";
import { testIds } from "../../constants";
import { getElementDOMRect, scrollHorizontal } from "../../utils";

test.describe("Timeline: Moving Playhead On Ruler Interaction", () => {
  async function expectPlayheadPositionToEqualX(
    playheadX: number,
    x: number
  ) {
    const playheadXToMouseXDistance = Math.abs(playheadX - x);
    // In browser, it is possible that mouse position is not exactly the same as the playhead,
    // therefore use the maxDiffPixels.
    const maxDiffPixels = 5;

    await expect(playheadXToMouseXDistance <= maxDiffPixels).toEqual(true);
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("should update playhead position when clicking on ruler", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerBar);
    const clickX = rulerAreaX + 100;

    await page.mouse.click(clickX, rulerAreaY + 10);

    const { x: playheadX } = await getElementDOMRect(playhead);
    await expectPlayheadPositionToEqualX(playheadX, clickX);
  });

  test("should update time when clicking on ruler", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerBar);
    const prevTime = await timeInput.inputValue();

    // clicking 100px away from the start of draggable area
    await page.mouse.click(rulerAreaX + 100, rulerAreaY + 10);

    const time = await timeInput.inputValue();
    await expect(parseInt(time) - parseInt(prevTime)).toEqual(100);
  });

  test("should update time when dragging playhead", async ({ page }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const timeInput = await timeline.getByTestId(testIds.timeInput);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerBar);
    const prevTime = await timeInput.inputValue();
    const clickX = rulerAreaX + 100;
    const dragDistance = 200;

    await page.mouse.move(clickX, rulerAreaY + 10);
    await page.mouse.down();
    await page.mouse.move(clickX + dragDistance, rulerAreaY + 10);
    await page.mouse.up();

    const time = await timeInput.inputValue();
    const timeDiff = parseInt(time) - parseInt(prevTime);

    await expect(timeDiff).toEqual(300);
  });

  test("should update playhead position when dragging playhead", async ({
    page
  }) => {
    const timeline = await page.getByTestId(testIds.timeline);
    const rulerBar = await timeline.getByTestId(
      testIds.rulerBar
    );
    const playhead = await timeline.getByTestId(testIds.playhead);
    const { x: rulerAreaX, y: rulerAreaY } =
      await getElementDOMRect(rulerBar);
    const initialClickX = rulerAreaX + 100;
    const dragDistance = 200;

    await page.mouse.move(initialClickX, rulerAreaY + 10);
    await page.mouse.down();
    await page.mouse.move(initialClickX + dragDistance, rulerAreaY + 10);
    await page.mouse.up();

    const { x: playheadX } = await getElementDOMRect(playhead);

    await expectPlayheadPositionToEqualX(
      playheadX,
      initialClickX + dragDistance
    );
  });

  test.describe("when ruler is not scrolled and smaller than container", () => {
    test("playhead should stay at left bounds when dragged across left bounds", async ({
      page
    }) => {
      const timeline = await page.getByTestId(testIds.timeline);
      const rulerBar = await timeline.getByTestId(
        testIds.rulerBar
      );
      const playhead = await timeline.getByTestId(testIds.playhead);
      const { x: rulerAreaX, y: rulerAreaY } =
        await getElementDOMRect(rulerBar);

      await page.mouse.move(rulerAreaX + 100, rulerAreaY + 10);
      await page.mouse.down();

      // dragged across left bounds
      await page.mouse.move(rulerAreaX - 200, rulerAreaY + 10);
      await page.mouse.up();

      const { x: playheadX } = await getElementDOMRect(playhead);

      await expectPlayheadPositionToEqualX(playheadX, rulerAreaX);
    });

    test("playhead should stay at right bounds when dragged across right bounds", async ({
      page
    }) => {
      const timeline = await page.getByTestId(testIds.timeline);
      const durationInput = await page.getByTestId(testIds.durationInput);
      const rulerBar = await timeline.getByTestId(
        testIds.rulerBar
      );
      const playhead = await timeline.getByTestId(testIds.playhead);

      // set ruler width by setting duration
      await durationInput.click();
      await page.keyboard.type("500");
      await page.keyboard.press("Enter");

      const {
        x: rulerAreaX,
        y: rulerAreaY,
        right: rulerAreaRight
      } = await getElementDOMRect(rulerBar);

      await page.mouse.move(rulerAreaX + 100, rulerAreaY + 10);
      await page.mouse.down();

      // dragged across right bounds
      await page.mouse.move(rulerAreaX + 700, rulerAreaY + 10);
      await page.mouse.up();

      const { x: playheadX } = await getElementDOMRect(playhead);

      await expectPlayheadPositionToEqualX(
        playheadX,
        rulerAreaRight
      );
    });
  });

  test.describe("when ruler is not scrolled and bigger than container", () => {
    test("playhead should stay at container right bounds when dragged across right bounds", async ({
      page
    }) => {
      const timeline = await page.getByTestId(testIds.timeline);
      const durationInput = await page.getByTestId(testIds.durationInput);
      const rulerContainer = await timeline.getByTestId(testIds.ruler);
      const rulerBar = await timeline.getByTestId(
        testIds.rulerBar
      );
      const playhead = await timeline.getByTestId(testIds.playhead);

      // set ruler width by setting duration
      await durationInput.click();
      await page.keyboard.type("5000");
      await page.keyboard.press("Enter");

      const { x: rulerAreaX, y: rulerAreaY } =
        await getElementDOMRect(rulerBar);

      const { right: rulerContainerRight } =
        await getElementDOMRect(rulerContainer);

      await page.mouse.move(rulerAreaX + 100, rulerAreaY + 10);
      await page.mouse.down();

      // dragged across right bounds
      await page.mouse.move(rulerAreaX + 1000, rulerAreaY + 10);
      await page.mouse.up();

      const { x: playheadX } = await getElementDOMRect(playhead);

      await expectPlayheadPositionToEqualX(
        playheadX,
        rulerContainerRight
      );
    });
  });

  test.describe("when ruler is scrolled and bigger than container", () => {
    test("playhead should stay at container left bounds when dragged across left bounds", async ({
      page
    }) => {
      const timeline = await page.getByTestId(testIds.timeline);
      const durationInput = await page.getByTestId(testIds.durationInput);
      const rulerContainer = await timeline.getByTestId(testIds.ruler);
      const rulerBar = await timeline.getByTestId(
        testIds.rulerBar
      );
      const playhead = await timeline.getByTestId(testIds.playhead);

      // set ruler width by setting duration
      await durationInput.click();
      await page.keyboard.type("5000");
      await page.keyboard.press("Enter");

      const { y: rulerAreaY } =
        await getElementDOMRect(rulerBar);

      const { x: rulerContainerX } =
        await getElementDOMRect(rulerContainer);

      // scroll the container
      await scrollHorizontal(rulerContainer, 300);

      
      // dragged across left bounds
      await page.mouse.move(rulerContainerX + 100, rulerAreaY + 10);
      await page.mouse.down();
      await page.mouse.move(rulerContainerX - 50, rulerAreaY + 10);
      await page.mouse.up();

      const { x: playheadX } = await getElementDOMRect(playhead);

      await expectPlayheadPositionToEqualX(
        playheadX,
        rulerContainerX
      );
    });
  });
});
