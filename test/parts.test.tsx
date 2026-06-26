import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MarkParts, PART_IDS } from "@/components/brand/parts";

describe("MarkParts", () => {
  it("renders an svg containing one group per part id", () => {
    const { container } = render(<svg><MarkParts /></svg>);
    for (const id of PART_IDS) {
      expect(container.querySelector(`[data-part="${id}"]`)).not.toBeNull();
    }
  });
});
