import pytest
from frontend.extension_parser import get_highlight_category

def test_highlight_category_verified():
    """Row 9: Verified / true claims categorized as verified with green styling."""
    res = get_highlight_category("verified", 95)
    assert res["category"] == "verified"
    assert res["css_class"] == "verifact-verdict-verified"
    assert "VERIFIED FACT" in res["badge_text"]
    assert res["badge_color"] == "green"

    # Also supports "true" alias
    res_true = get_highlight_category("true", 90)
    assert res_true["category"] == "verified"

def test_highlight_category_disputed():
    """Row 10: Disputed claims categorized as disputed with amber/orange styling."""
    res = get_highlight_category("disputed", 60)
    assert res["category"] == "disputed"
    assert res["css_class"] == "verifact-verdict-disputed"
    assert "DISPUTED CLAIM" in res["badge_text"]
    assert res["badge_color"] == "orange"

def test_highlight_category_misinformed():
    """Row 11: Misinformed or false claims categorized as misinformed with red styling."""
    res = get_highlight_category("misinformed", 90)
    assert res["category"] == "misinformed"
    assert res["css_class"] == "verifact-verdict-misinformed"
    assert "MISINFORMED / FALSE" in res["badge_text"]
    assert res["badge_color"] == "red"

    # Also supports "false" alias
    res_false = get_highlight_category("false", 90)
    assert res_false["category"] == "misinformed"

def test_highlight_category_need_context():
    """Row 12: Claims needing context categorized with purple/blue styling."""
    res = get_highlight_category("need-additional-context", 50)
    assert res["category"] == "need-additional-context"
    assert res["css_class"] == "verifact-verdict-context"
    assert "NEEDS ADDITIONAL CONTEXT" in res["badge_text"]
    assert res["badge_color"] == "purple"

def test_highlight_category_fallback():
    """Row 13: Unrecognized verdict falls back safely."""
    res = get_highlight_category("unknown_verdict", 50)
    assert res["category"] == "need-additional-context"
