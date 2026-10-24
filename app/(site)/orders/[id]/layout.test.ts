import { describe, expect, it } from "vitest";
import OrderLayout from "./layout";

const render = (id: string) => OrderLayout({ children: "order page", params: Promise.resolve({ id }) });

describe("orders/[id] layout", () => {
  it("renders the page for a numeric id", async () => {
    await expect(render("42")).resolves.toBe("order page");
  });

  it.each(["../users/me", "..", "42?per_page=1000", "42#x", "abc", "-1", "4.2", ""])(
    "answers 404 for %j",
    async (id) => {
      await expect(render(id)).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    }
  );
});
