import * as cheerio from "cheerio";
import Parser from "rss-parser";

const BASE_URL = `https://sinhogamer.com`;
const parser = new Parser();

export interface Options {
    max_results?: number,
    start_index?: number
}

export async function search(query: string, options?: Options) {
    const url = encodeURI(BASE_URL + `/search?q=${query}&max_results=${options?.max_results || 20}&start=${options?.start_index || 0}`);
    const response = await fetch(url);
    const resultPage = await response.text();

    const $ = cheerio.load(resultPage);

    const thumbnails = $('img.imgThm').map((_, el) => el.attribs['src']).toArray();
    const titles = $('h2.pTtl a').map((_, el) => el.attribs['data-text']).toArray();
    const snippets = $('div.pSnpt').map((_, el) => $(el).text()).toArray();
    const publishDates = $('time.aTtmp').map((_, el) => new Date(el.attribs['datetime'])).toArray();

    return thumbnails.map((_, i) => ({
        title: titles[i],
        thumbnail: thumbnails[i],
        snippet: snippets[i],
        publishDate: publishDates[i]
    }))
}

export async function getFeed(options?: Options) {
    const url = BASE_URL + `/feeds/posts/default?start-index=${options?.start_index || 1}&max-results=${options?.max_results || 25}`;

    const response = await fetch(url);
    const feedPage = await response.text();

    const feed = await parser.parseString(feedPage);

    return feed.items.map((post) => {
        const content = post.contentSnippet?.replace('(adsbygoogle = window.adsbygoogle || []).push({});', '').replace(/\n+/g, '\n')
        
        const aboutMatch = content?.match(/^.*?(?=(CARACTERÍSTICAS DO MOD)|(CARATERÍSTICAS DO MOD))/gmsi)
        const featuresMatch = content?.match(/^((CARACTERÍSTICAS DO MOD)|(CARATERÍSTICAS DO MOD)).*?(?=COMO INSTALAR)/gmsi)
        const stepsMatch = content?.match(/^COMO INSTALAR.*(?=Todos os MODS)/gmsi)

        return {
            title: post.title,
            link: post.link,
            publishDate: post.pubDate ? new Date(post.pubDate) : undefined,
            content: {
                about: aboutMatch ? aboutMatch[0] : null,
                features: featuresMatch ? featuresMatch[0] : null,
                steps: stepsMatch ? stepsMatch[0] : null
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

        results.push(...feed)
        index += feed.length
    } while (feed.length === 0)

    return results
}

export default { search, getFeed, getAllPosts }