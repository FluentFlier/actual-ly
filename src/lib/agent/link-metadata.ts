const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export function extractUrls(text: string) {
  return Array.from(new Set(text.match(URL_REGEX) || []));
}

export async function fetchMetadata(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) {
      return null;
    }

    const html = await res.text();
    const title = matchMeta(html, /<title[^>]*>([^<]*)<\/title>/i);
    const description =
      matchMeta(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      matchMeta(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    const image =
      matchMeta(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      null;

    return {
      url,
      title: title || url,
      description: description || "",
      image,
      domain: new URL(url).hostname,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPageContent(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) return null;
    const html = await res.text();
    const title = matchMeta(html, /<title[^>]*>([^<]*)<\/title>/i);
    const description =
      matchMeta(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) ||
      matchMeta(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i);

    const text = stripHtml(html)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    return { title, description, text };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function matchMeta(html: string, regex: RegExp) {
  const match = html.match(regex);
  return match?.[1]?.trim();
}
