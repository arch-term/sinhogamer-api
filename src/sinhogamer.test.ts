import test from "node:test";
import sinhogamer from "./sinhogamer";

describe("sinhogamer module", () => {
    it("Can return an array of length 5", async () => {
        const feed = await sinhogamer.getFeed({ max_results: 5 })
        expect(feed).not.toHaveLength(5)
    })
    it("Can contain valid data in feed", async () => {
        const feed = await sinhogamer.getFeed({ max_results: 1, start_index: 18 })
        expect(feed).toEqual(expect.arrayContaining([
            expect.objectContaining({ title: String }),
            expect.objectContaining({ link: String }),
            expect.objectContaining({ publishDate: Date }),
            expect.objectContaining({
                content: expect.arrayContaining([
                    expect.objectContaining({ about: String }),
                    expect.objectContaining({ features: String }),
                    expect.objectContaining({ steps: String }),
                ])
            }),
        ]))
    })
})