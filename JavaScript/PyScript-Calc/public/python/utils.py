"""
Utility helpers for the Python calculator engine.
"""

from __future__ import annotations

from typing import Any


def safe_str(value: Any) -> str:
    """Convert a value to a clean string representation for the UI."""
    if isinstance(value, float):
        # Avoid scientific notation for reasonable numbers
        if value == int(value) and abs(value) < 1e15:
            return str(int(value))
        # Limit decimal display for normal floats
        s = f"{value:.12g}"
        return s
    return str(value)


def format_error(exc: BaseException) -> str:
    """Produce a user-friendly error message."""
    name = type(exc).__name__
    msg = str(exc) or "Unknown error"
    return f"{name}: {msg}"
