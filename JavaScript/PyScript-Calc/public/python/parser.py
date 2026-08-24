"""
Safe expression parser.

Responsible only for turning a source string into an AST and walking that
AST under a restricted set of node types.  No evaluation of user-defined
functions or namespace lookup lives here — that belongs in engine.py.
"""

from __future__ import annotations

import ast
import operator
from typing import Any, Callable, Dict


class ParseError(Exception):
    """Raised when an expression cannot be parsed or contains unsupported syntax."""


# Allowed binary / unary operators (no attribute access, no imports, etc.)
_BIN_OPS: Dict[type, Callable[[Any, Any], Any]] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}

_UNARY_OPS: Dict[type, Callable[[Any], Any]] = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


def parse_expression(source: str) -> ast.Expression:
    """
    Parse *source* as a single expression.
    Raises ParseError on syntax problems.
    """
    source = source.strip()
    if not source:
        raise ParseError("Empty expression")
    try:
        tree = ast.parse(source, mode="eval")
    except SyntaxError as exc:
        raise ParseError(f"Syntax error: {exc.msg}") from exc
    if not isinstance(tree, ast.Expression):
        raise ParseError("Only single expressions are allowed")
    return tree


def eval_node(node: ast.AST, resolve_name: Callable[[str], Any], call_func: Callable[[str, list], Any]) -> Any:
    """
    Recursively evaluate an AST node.

    Name lookup and function calls are delegated to the caller via callbacks
    so this module stays free of calculator-specific logic.
    """
    if isinstance(node, ast.Expression):
        return eval_node(node.body, resolve_name, call_func)

    if isinstance(node, ast.Constant):  # Python 3.8+
        return node.value

    if isinstance(node, ast.Num):  # older AST compatibility
        return node.n

    if isinstance(node, ast.Name):
        return resolve_name(node.id)

    if isinstance(node, ast.BinOp):
        left = eval_node(node.left, resolve_name, call_func)
        right = eval_node(node.right, resolve_name, call_func)
        op_type = type(node.op)
        if op_type not in _BIN_OPS:
            raise ParseError(f"Unsupported operator: {op_type.__name__}")
        try:
            return _BIN_OPS[op_type](left, right)
        except ZeroDivisionError:
            raise ParseError("Division by zero") from None
        except Exception as exc:
            raise ParseError(str(exc)) from exc

    if isinstance(node, ast.UnaryOp):
        operand = eval_node(node.operand, resolve_name, call_func)
        op_type = type(node.op)
        if op_type not in _UNARY_OPS:
            raise ParseError(f"Unsupported unary operator: {op_type.__name__}")
        return _UNARY_OPS[op_type](operand)

    if isinstance(node, ast.Call):
        if not isinstance(node.func, ast.Name):
            raise ParseError("Only simple function calls are allowed")
        if node.keywords:
            raise ParseError("Keyword arguments are not supported")
        args = [eval_node(a, resolve_name, call_func) for a in node.args]
        return call_func(node.func.id, args)

    if isinstance(node, ast.Tuple):
        return tuple(eval_node(elt, resolve_name, call_func) for elt in node.elts)

    raise ParseError(f"Unsupported expression type: {type(node).__name__}")
