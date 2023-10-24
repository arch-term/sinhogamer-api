"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinhogamer_1 = __importDefault(require("./sinhogamer"));
const fs_1 = __importDefault(require("fs"));
describe("sinhogamer module", () => {
    it("Can return an array of length 5", () => __awaiter(void 0, void 0, void 0, function* () {
        const feed = yield sinhogamer_1.default.getFeed({ max_results: 5 });
        expect(feed).toHaveLength(5);
    }));
    it("Can contain valid data in feed", () => __awaiter(void 0, void 0, void 0, function* () {
        const feed = yield sinhogamer_1.default.getFeed({ max_results: 5 });
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
        ]));
    }));
    it("Get image url from post", function () {
        return __awaiter(this, void 0, void 0, function* () {
            expect(yield sinhogamer_1.default.getPostImage('Exiled Kingdoms RPG Apk Mod (Dinheiro Infinito/Desbloqueado) v1.13.1210'))
                .toBe('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMR0I-4zp9ZVHMbhyWhvBKLPKWKdyPTdfflvgOmvyAFcIZa7tTKGISG_aWMA7OpERBEDuelA0YCuLP-_BB9q9qJ_GbDjJsVDCxhVHd6oX4bNbkJPuw89qHA4MkwYfzCq5SQ9a31pEBHAa8ZeVTOaA9ASaTVJupBF4lI2dvffhofDS7_9ovq-abkjWe2sAP/w200/Exiled-Kingdoms-RPG-Apk-Mod.png');
        });
    });
    it("Get all mods and save in file", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let mods;
            if (!fs_1.default.existsSync('cache/mods.json')) {
                mods = yield sinhogamer_1.default.getAllPosts();
                fs_1.default.writeFileSync('cache/mods.json', JSON.stringify(mods, null, '\t'));
            }
            else {
                mods = JSON.parse(fs_1.default.readFileSync('cache/mods.json', 'utf8'));
            }
            expect(mods.length).toBeGreaterThan(2000);
        });
    }, 60000);
    it("Verify new updates on sinhogamer.com", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const feedPrecision = 25;
            let lastFeed;
            if (!fs_1.default.existsSync('cache/feed.json')) {
                lastFeed = yield sinhogamer_1.default.getFeed({ max_results: feedPrecision });
                fs_1.default.writeFileSync('cache/feed.json', JSON.stringify(lastFeed, null, '\t'));
            }
            else {
                lastFeed = JSON.parse(fs_1.default.readFileSync('cache/feed.json', 'utf8'));
            }
            const newFeed = yield sinhogamer_1.default.getFeed({ max_results: feedPrecision });
            const { newPosts } = yield sinhogamer_1.default.comparePosts(lastFeed, newFeed);
            expect(newPosts.length).toBeGreaterThan(0);
        });
    });
});
