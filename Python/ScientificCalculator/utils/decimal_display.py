"""decimal_display.py

When this module is imported it patches decimal.Decimal.__repr__ so that
Decimal instances display like plain numbers in the REPL and container
representations (e.g. lists, dicts), i.e. Decimal('120') will display as
120.

Usage: Import this module early in your program (for example in your
application entrypoint or package __init__), e.g.:

    from Python.ScientificCalculator.utils import decimal_display

Importing the module is sufficient — no functions need to be called.

This file intentionally uses only Decimal(str(...)) elsewhere in the
project; here we only modify the repr for human-friendly display.
"""

from decimal import Decimal

# Keep a reference to the original repr in case someone wants to restore it.
_original_decimal_repr = Decimal.__repr__


def _decimal_repr(self):
    """Return the plain string form of the Decimal for display purposes."""
    return str(self)


# Patch Decimal.__repr__ globally for the running process.
Decimal.__repr__ = _decimal_repr
