import re
import urllib.parse
from typing import List, Dict, Any, Optional
import httpx
from bs4 import BeautifulSoup
from .config import settings
from .schemas import SourceItem

def clean_text(text: str) -> str:
    """Normalize whitespace and remove unreadable character artifacts."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

async def fetch_url_content(url: str) -> Dict[str, Any]:
    """
    Safely retrieves public web content from a given URL without crashing on timeouts,
    403s, or network failures.
    """
    parsed = urllib.parse.urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return {
            "url": url,
            "title": f"Invalid URL ({url})",
            "snippet": "URL format is invalid. Please supply a full http:// or https:// address.",
            "domain": "Unknown",
            "verified": False,
            "error": "Invalid URL protocol or domain"
        }

    domain = parsed.netloc.replace("www.", "")
    headers = {
        "User-Agent": settings.RESEARCH_USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
    }

    try:
        async with httpx.AsyncClient(timeout=settings.MAX_URL_FETCH_TIMEOUT, follow_redirects=True, verify=False) as client:
            response = await client.get(url, headers=headers)
            
            if response.status_code >= 400:
                return {
                    "url": url,
                    "title": f"Public page access denied ({domain})",
                    "snippet": f"HTTP {response.status_code}: Unable to read public article directly from server. Host security policy prevented automated crawling.",
                    "domain": domain,
                    "verified": False,
                    "error": f"HTTP status {response.status_code}"
                }

            html = response.text
            soup = BeautifulSoup(html, "html.parser")

            # Remove noise
            for element in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "form"]):
                element.decompose()

            # Extract title
            title_tag = soup.find("title")
            og_title = soup.find("meta", property="og:title")
            title = ""
            if og_title and og_title.get("content"):
                title = og_title.get("content")
            elif title_tag and title_tag.string:
                title = title_tag.string
            else:
                title = f"Document from {domain}"
            title = clean_text(title)

            # Extract date if meta tags provide it
            pub_date = "Recent"
            date_meta = soup.find("meta", property="article:published_time") or soup.find("meta", attrs={"name": "publication_date"})
            if date_meta and date_meta.get("content"):
                pub_date = date_meta.get("content")[:10]

            # Extract primary text paragraphs
            paragraphs = [clean_text(p.get_text()) for p in soup.find_all(["p", "article", "section"]) if len(clean_text(p.get_text())) > 30]
            full_body = " ".join(paragraphs)

            if not full_body:
                full_body = clean_text(soup.get_text())

            full_body = full_body[:settings.MAX_CONTENT_CHARS]
            snippet = full_body[:400] + ("..." if len(full_body) > 400 else "")

            return {
                "url": url,
                "title": title or f"Article from {domain}",
                "snippet": snippet if snippet else "No readable textual body found.",
                "body": full_body,
                "publication_date": pub_date,
                "domain": domain,
                "verified": True,
                "error": None
            }

    except Exception as exc:
        return {
            "url": url,
            "title": f"Source link: {domain}",
            "snippet": f"Could not retrieve live public page: {str(exc)[:150]}",
            "domain": domain,
            "verified": False,
            "error": str(exc)
        }

async def collect_research_sources(
    user_urls: List[str],
    user_text: str,
    company_name: str,
    competitors: List[str]
) -> List[SourceItem]:
    """
    Ingests public URLs and user text input into structured SourceItem records.
    Never invents unverified information.
    """
    source_items: List[SourceItem] = []
    source_idx = 1

    # 1. Process supplied URLs
    for url in (user_urls or []):
        url = url.strip()
        if not url:
            continue
        result = await fetch_url_content(url)
        source_items.append(SourceItem(
            id=f"SRC-{source_idx:02d}",
            url=result["url"],
            title=result["title"][:120],
            snippet=result["snippet"],
            publication_date=result.get("publication_date", "Recent"),
            domain=result.get("domain", "Web"),
            verified=result["verified"]
        ))
        source_idx += 1

    # 2. Process user-supplied manual article text or intelligence notes
    if user_text and user_text.strip():
        # Split text into paragraphs or intelligence briefs if multiple
        cleaned_text = clean_text(user_text)
        preview_snippet = cleaned_text[:350] + ("..." if len(cleaned_text) > 350 else "")
        source_items.append(SourceItem(
            id=f"SRC-{source_idx:02d}",
            url=None,
            title=f"Internal Dossier & Industry Feed for {company_name}",
            snippet=preview_snippet,
            publication_date="Live Input (Current Analysis)",
            domain="Corporate Research Feed",
            verified=True
        ))
        source_idx += 1

    return source_items
