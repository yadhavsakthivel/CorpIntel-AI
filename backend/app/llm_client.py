import json
import logging
import re
from typing import Dict, Any, Optional
import httpx
from .config import settings

logger = logging.getLogger("corpintel.llm")

def extract_json_from_llm_text(text: str) -> Dict[str, Any]:
    """
    Extracts and parses JSON object from an LLM response text,
    handling markdown blocks or surrounding prose gracefully.
    """
    text = text.strip()
    # Match ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text)
    if match:
        text = match.group(1).strip()
    else:
        # Look for first { and last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start:end+1]
            
    return json.loads(text)

class LLMClient:
    """
    Isolated Multi-Provider LLM Client.
    Supports:
    1. Google Gemini (REST API via HTTPX)
    2. OpenAI-compatible endpoints (Groq, OpenAI, Ollama)
    """

    @property
    def gemini_key(self) -> str:
        return settings.active_gemini_key

    @property
    def gemini_model(self) -> str:
        return settings.GEMINI_MODEL.strip() or "gemini-1.5-flash"

    @property
    def openai_key(self) -> str:
        return settings.active_openai_key

    @property
    def openai_base_url(self) -> str:
        return settings.OPENAI_BASE_URL.strip().rstrip("/")

    @property
    def openai_model(self) -> str:
        return settings.OPENAI_MODEL.strip() or "gpt-4o-mini"

    @property
    def has_active_provider(self) -> bool:
        return bool(self.gemini_key or self.openai_key)

    @property
    def active_provider_name(self) -> str:
        if self.gemini_key:
            return f"Google Gemini ({self.gemini_model})"
        elif self.openai_key:
            return f"OpenAI Compatible ({self.openai_model})"
        return "High-Fidelity Demo Simulation Engine"

    async def generate_json(self, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
        """
        Executes a prompt targeting structured JSON output using the configured LLM provider.
        Returns parsed dictionary or None on failure.
        """
        if self.gemini_key:
            try:
                return await self._call_gemini_json(system_prompt, user_prompt)
            except Exception as e:
                logger.error(f"Gemini API error: {e}", exc_info=True)
                raise RuntimeError(f"Gemini LLM Provider failed: {str(e)}")
                
        elif self.openai_key:
            try:
                return await self._call_openai_json(system_prompt, user_prompt)
            except Exception as e:
                logger.error(f"OpenAI API error: {e}", exc_info=True)
                raise RuntimeError(f"OpenAI LLM Provider failed: {str(e)}")

        return None

    async def _call_gemini_json(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """Calls Google Gemini REST API with schema enforcement and candidate models."""
        candidate_models = [self.gemini_model]
        for fallback in ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]:
            if fallback not in candidate_models:
                candidate_models.append(fallback)

        last_error = None
        for model in candidate_models:
            endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.gemini_key}"
            
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER TASK:\n{user_prompt}"}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "response_mime_type": "application/json"
                }
            }

            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    response = await client.post(endpoint, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            return extract_json_from_llm_text(text_content)
                    else:
                        last_error = f"HTTP {response.status_code}: {response.text[:200]}"
            except Exception as e:
                last_error = str(e)
                continue

        raise RuntimeError(f"All Gemini model candidates failed. Last error: {last_error}")

    async def _call_openai_json(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """Calls OpenAI-compatible /chat/completions endpoint."""
        endpoint = f"{self.openai_base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.openai_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(endpoint, headers=headers, json=payload)
            if response.status_code != 200:
                raise RuntimeError(f"OpenAI API returned HTTP {response.status_code}: {response.text}")
            
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return extract_json_from_llm_text(content)

llm_client = LLMClient()
