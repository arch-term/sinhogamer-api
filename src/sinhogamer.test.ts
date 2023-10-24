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
    it("Get image url from post", async function() {
        expect(await sinhogamer.getPostImage('Exiled Kingdoms RPG Apk Mod (Dinheiro Infinito/Desbloqueado) v1.13.1210'))
        .toBe('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMR0I-4zp9ZVHMbhyWhvBKLPKWKdyPTdfflvgOmvyAFcIZa7tTKGISG_aWMA7OpERBEDuelA0YCuLP-_BB9q9qJ_GbDjJsVDCxhVHd6oX4bNbkJPuw89qHA4MkwYfzCq5SQ9a31pEBHAa8ZeVTOaA9ASaTVJupBF4lI2dvffhofDS7_9ovq-abkjWe2sAP/w200/Exiled-Kingdoms-RPG-Apk-Mod.png')
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
    it("Verify new updates on sinhogamer.com", async function () {
        const feedPrecision = 25
        let lastFeed
        if (!fs.existsSync('cache/feed.json')) {
            lastFeed = await sinhogamer.getFeed({ max_results: feedPrecision })
            fs.writeFileSync('cache/feed.json', JSON.stringify(lastFeed, null, '\t'))
        } else {
            lastFeed = JSON.parse(fs.readFileSync('cache/feed.json', 'utf8'))
        }

        const newFeed = await sinhogamer.getFeed({ max_results: feedPrecision })
        const { newPosts } = await sinhogamer.comparePosts(lastFeed, newFeed)

        expect(newPosts.length).toBeGreaterThan(0)
    })
})