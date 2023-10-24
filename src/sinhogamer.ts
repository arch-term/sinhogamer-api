import * as cheerio from "cheerio";
import Parser from "rss-parser";
import fs from "fs";

const BASE_URL = `https://sinhogamer.com`;
const parser = new Parser();

export interface Options {
    max_results?: number,
    start_index?: number
}

export async function getFeed(options?: Options) {
    const url = BASE_URL + `/feeds/posts/default?start-index=${options?.start_index || 1}&max-results=${options?.max_results || 25}`;

    const response = await fetch(url);
    const feedPage = await response.text();

    const feed = await parser.parseString(feedPage);

    return feed.items.map((post) => {
        let content = cheerio.load(post.content!).text();
        content = content.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '').replace(/\n{2,}/g, '\n');

        const aboutMatch = content?.match(/.*?(?=CAR[AC]+TERÍSTICAS DO MOD)/gmsi);
        const featuresMatch = content?.match(/CAR[AC]+TERÍSTICAS DO MOD.*?(?=COMO INSTALAR)/gmsi);
        const stepsMatch = content?.match(/COMO INSTALAR.*(?=Todos os MODS)/gmsi);

        return {
            title: post.title,
            link: post.link,
            publishDate: post.pubDate ? new Date(post.pubDate) : undefined,
            content: {
                about: aboutMatch ? aboutMatch[0].trim() : null,
                features: featuresMatch ? featuresMatch[0].replace('-', '\n -').trim() : null,
                steps: stepsMatch ? stepsMatch[0].trim() : null
            }
        }
    });
}


export async function getAllPosts() {
    let results = [];
    let index = 1;
    let searchSize = 150;

    let feed;

    do {
        feed = await getFeed({ start_index: index, max_results: searchSize });

        results.push(...feed);
        index += feed.length
    } while (feed.length !== 0)

    return results;
}

export async function getPostImage(postUrl: string) {
    const response = await fetch(postUrl);
}

export default { getFeed, getAllPosts }