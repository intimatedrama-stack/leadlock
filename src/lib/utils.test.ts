import { describe, it, expect } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("merges class names and dedupes", () => {
    expect(cn("px-2", "py-1", "px-2").split(" ").sort()).toEqual([
      "px-2",
      "py-1",
    ])
  })

  it("handles conditional values", () => {
    const isActive = true
    expect(cn("base", { active: isActive, disabled: !isActive })).toBe(
      "base active",
    )
  })
})
