import pytest
from frontend.main import _check_and_increment_rate_limit, _query_byom_provider

def test_free_tier_under_limit():
    """Row 1: Under limit user query is allowed with remaining count decremented."""
    user_id = "test-user-under-limit"
    allowed, remaining = _check_and_increment_rate_limit(user_id, has_byom_key=False)
    assert allowed is True
    assert remaining == 14

def test_free_tier_at_limit_blocked():
    """Row 2: User at limit (15 queries) is blocked."""
    user_id = "test-user-at-limit"
    for _ in range(15):
        _check_and_increment_rate_limit(user_id, has_byom_key=False)
    
    allowed, remaining = _check_and_increment_rate_limit(user_id, has_byom_key=False)
    assert allowed is False
    assert remaining == 0

def test_one_click_byom_uncaps_limit():
    """Row 3: 1-Click BYOM agent uncaps queries immediately."""
    user_id = "test-user-one-click"
    # Reach limit first
    for _ in range(15):
        _check_and_increment_rate_limit(user_id, has_byom_key=False)
    
    # 16th query with 1-click in-app agent / BYOM active
    allowed, remaining = _check_and_increment_rate_limit(user_id, has_byom_key=True)
    assert allowed is True
    assert remaining == 999

def test_custom_api_key_uncaps_limit():
    """Row 4: Custom API key uncaps queries."""
    user_id = "test-user-custom-key"
    allowed, remaining = _check_and_increment_rate_limit(user_id, has_byom_key=True)
    assert allowed is True
    assert remaining == 999

@pytest.mark.asyncio
async def test_google_oauth_provider_supported():
    """Row 5: 1-click Google OAuth / in-app session doesn't throw Unsupported provider error."""
    # Should handle google_oauth or one_click gracefully
    res = await _query_byom_provider("google_oauth", "mock_oauth_token", "gemini-1.5-pro", "Is water wet?")
    assert len(res) > 0
    assert "text" in res[0]
