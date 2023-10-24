"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getPostImage = exports.getAllPosts = exports.getPosts = exports.comparePosts = void 0;
const cheerio = __importStar(require("cheerio"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const BASE_URL = `https://sinhogamer.com`;
const parser = new rss_parser_1.default();
function comparePosts(last, current) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPosts = current.filter((post) => {
            return !last.some((lastPost) => lastPost.link === post.link);
        });
        const deletedPosts = last.filter((post) => {
            return !current.some((currentPost) => currentPost.link === post.link);
        });
        const updatedPosts = current.filter((post) => {
            return last.some((lastPost) => lastPost.link === post.link && lastPost.publishDate !== post.publishDate);
        });
        return {
            newPosts,
            deletedPosts,
            updatedPosts
        };
    });
}
exports.comparePosts = comparePosts;
function getPosts(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = BASE_URL + `/feeds/posts/default?start-index=${(options === null || options === void 0 ? void 0 : options.start_index) || 1}&max-results=${(options === null || options === void 0 ? void 0 : options.max_results) || 25}`;
        const response = yield fetch(url);
        const feedPage = yield response.text();
        const feed = yield parser.parseString(feedPage);
        return feed.items.map((post) => {
            let content = cheerio.load(post.content).text();
            content = content.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '').replace(/\n{2,}/g, '\n');
            const aboutMatch = content === null || content === void 0 ? void 0 : content.match(/.*?(?=CAR[AC]+TERÍSTICAS DO MOD)/gmsi);
            const featuresMatch = content === null || content === void 0 ? void 0 : content.match(/CAR[AC]+TERÍSTICAS DO MOD.*?(?=COMO INSTALAR)/gmsi);
            const stepsMatch = content === null || content === void 0 ? void 0 : content.match(/COMO INSTALAR.*(?=Todos os MODS)/gmsi);
            return {
                title: post.title,
                link: post.link,
                publishDate: post.pubDate ? new Date(post.pubDate) : undefined,
                content: {
                    about: aboutMatch ? aboutMatch[0].trim() : null,
                    features: featuresMatch ? featuresMatch[0].replace('-', '\n -').trim() : null,
                    steps: stepsMatch ? stepsMatch[0].trim() : null
                }
            };
        });
    });
}
exports.getPosts = getPosts;
function getAllPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        let results = [];
        let index = 1;
        let searchSize = 150;
        let feed;
        do {
            feed = yield getPosts({ start_index: index, max_results: searchSize });
            results.push(...feed);
            index += feed.length;
        } while (feed.length !== 0);
        return results;
    });
}
exports.getAllPosts = getAllPosts;
function getPostImage(postName) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = BASE_URL + `/search?q=${postName.replace(/\s/g, '+')}`;
        const response = yield fetch(url);
        const htmlString = yield response.text();
        const $ = cheerio.load(htmlString);
        const images = $('.imgThm').map((_, el) => el.attribs['src']).toArray();
        return images.length > 0 ? images[0] : null;
    });
}
exports.getPostImage = getPostImage;
exports.default = { getFeed: getPosts, getAllPosts, getPostImage, comparePosts };
