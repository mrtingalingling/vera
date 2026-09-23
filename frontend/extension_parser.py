"""Extension claim parsing and verdict categorization for DOM highlighting.
Categories: verified, disputed, misinformed, need-additional-context.
"""

def get_highlight_category(verdict: str, confidence: float = 0.0) -> dict:
    """Categorizes a claim verdict into one of four standard highlighting categories.
    
    Categories:
    - verified: High accuracy confidence, factual statement.
    - disputed: Conflicting sources, contested claims.
    - misinformed: High falsehood, debunked, or misleading statements.
    - need-additional-context: Incomplete, missing nuance, or requiring grounding.
    """
    v = (verdict or "").strip().lower()
    conf = int(confidence) if confidence else 90

    if "verified" in v or "true" in v or "factual" in v:
        return {
            "category": "verified",
            "css_class": "verifact-verdict-verified",
            "badge_class": "verifact-badge-verified",
            "badge_text": f"🟢 VERIFIED FACT ({conf}%)",
            "badge_color": "green"
        }
    elif "dispute" in v or "contest" in v or "mixed" in v:
        return {
            "category": "disputed",
            "css_class": "verifact-verdict-disputed",
            "badge_class": "verifact-badge-disputed",
            "badge_text": f"🟠 DISPUTED CLAIM ({conf}%)",
            "badge_color": "orange"
        }
    elif "misinform" in v or "false" in v or "debunk" in v or "fake" in v:
        return {
            "category": "misinformed",
            "css_class": "verifact-verdict-misinformed",
            "badge_class": "verifact-badge-misinformed",
            "badge_text": f"🔴 MISINFORMED / FALSE ({conf}%)",
            "badge_color": "red"
        }
    else:  # "need-additional-context", "context", "unverified", or unknown
        return {
            "category": "need-additional-context",
            "css_class": "verifact-verdict-context",
            "badge_class": "verifact-badge-context",
            "badge_text": f"🟣 NEEDS ADDITIONAL CONTEXT ({conf}%)",
            "badge_color": "purple"
        }
