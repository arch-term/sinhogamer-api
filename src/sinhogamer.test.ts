import sinhogamer from "./sinhogamer";
import fs from "fs";

describe("sinhogamer module", () => {
    it("Can return an array of length 5", async () => {
        const feed = await sinhogamer.getFeed({ max_results: 5 })
        expect(feed).toHaveLength(5)
    })
    it("Can contain valid data in feed", async () => {
        const feed = await sinhogamer.getFeed({ max_results: 5 })
        expect(feed).toStrictEqual(expect.arrayContaining([
            expect.objectContaining({
                title: expect.any(String),
                link: expect.any(String),
                publishDate: expect.any(Date),
                content: expect.objectContaining({
                    about: expect.any(String),
                    features: expect.any(String),
                    steps: expect.any(String)
                })
            })
        ]))
    })
    it("Get all mods and save in file", async function () {
        let mods
        if (!fs.existsSync('cache/mods.json')) {
            mods = await sinhogamer.getAllPosts()
            fs.writeFileSync('cache/mods.json', JSON.stringify(mods, null, '\t'))
        } else {
            mods = JSON.parse(fs.readFileSync('cache/mods.json', 'utf8'))
        }

        expect(mods.length).toBeGreaterThan(2000)
    }, 60000)
})