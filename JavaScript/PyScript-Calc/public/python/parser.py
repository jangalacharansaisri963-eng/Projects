"""
Safe expression parser.

Responsible only for turning a source string into an AST and walking that
AST under a restricted set of node types.  No evaluation of user-defined
functions or namespace lookup lives here — that belongs in engine.py.

Supports postfix factorial: 5!, (5+1)!, 5!! (→ factorial(factorial(5))).
"""

from __future__ import annotations

import ast
import operator
from typing import Any, Callable, Dict


class ParseError(Exception):
    """Raised when an expression cannot be parsed or contains unsupported syntax."""


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


def _preprocess_factorial(source: str) -> str:
    """
    Rewrite postfix factorial notation into function calls.

      5!          → factorial(5)
      (5+1)!      → factorial((5+1))
      5!!         → factorial(factorial(5))
      n! + 3      → factorial(n) + 3
    """
    s = source.strip()
    if "!" not in s:
        return s

    safety = 0
    while "!" in s:
        safety += 1
        if safety > 80:
            raise ParseError("Factorial rewrite too deep")

        bang = s.rfind("!")
        i = bang - 1
        while i >= 0 and s[i].isspace():
            i -= 1
        if i < 0:
            raise ParseError("Factorial with no operand")

        # Count consecutive trailing '!' that form a multi-factorial chain
        # We only consume one '!' per iteration; nested rewrite handles !! 

        if s[i] == ")":
            depth = 1
            i -= 1
            while i >= 0 and depth > 0:
                if s[i] == ")":
                    depth += 1
                elif s[i] == "(":
                    depth -= 1
                i -= 1
            if depth != 0:
                raise ParseError("Unbalanced parentheses before !")
            start = i + 1
        else:
            # name or number — stop at operators / ! / whitespace
            while i >= 0 and (s[i].isalnum() or s[i] in "._"):
                i -= 1
            start = i + 1

        operand = s[start:bang].strip()
        if not operand:
            # Consecutive !! case: the character before this '!' is another '!'
            # Look further left for the real operand, then wrap once.
            # Example: "5!!" when bang points at second '!', start finds empty.
            # Walk left past the previous '!' and re-find operand.
            j = bang - 1
            while j >= 0 and s[j] == "!":
                j -= 1
            while j >= 0 and s[j].isspace():
                j -= 1
            if j < 0:
                raise ParseError("Factorial with empty operand")
            if s[j] == ")":
                depth = 1
                j -= 1
                while j >= 0 and depth > 0:
                    if s[j] == ")":
                        depth += 1
                    elif s[j] == "(":
                        depth -= 1
                    j -= 1
                start = j + 1
            else:
                while j >= 0 and (s[j].isalnum() or s[j] in "._"):
                    j -= 1
                start = j + 1
            # operand is everything from start to the first '!' of the chain
            first_bang = s.find("!", start)
            operand = s[start:first_bang].strip()
            if not operand:
                raise ParseError("Factorial with empty operand")
            # Count how many '!' in the chain
            k = first_bang
            count = 0
            while k < len(s) and s[k] == "!":
                count += 1
                k += 1
            # Wrap 'count' times
            replacement = operand
            for _ in range(count):
                replacement = f"factorial({replacement})"
            s = s[:start] + replacement + s[k:]
            continue

        replacement = f"factorial({operand})"
        s = s[:start] + replacement + s[bang + 1 :]

    return s


def parse_expression(source: str) -> ast.Expression:
    source = source.strip()
    if not source:
        raise ParseError("Empty expression")

    try:
        source = _preprocess_factorial(source)
    except ParseError:
        raise
    except Exception as exc:
        raise ParseError(f"Factorial rewrite error: {exc}") from exc

    try:
        tree = ast.parse(source, mode="eval")
    except SyntaxError as exc:
        raise ParseError(f"Syntax error: {exc.msg}") from exc
    if not isinstance(tree, ast.Expression):
        raise ParseError("Only single expressions are allowed")
    return tree


def eval_node(
    node: ast.AST,
    resolve_name: Callable[[str], Any],
    call_func: Callable[[str, list], Any],
) -> Any:
    if isinstance(node, ast.Expression):
        return eval_node(node.body, resolve_name, call_func)

    if isinstance(node, ast.Constant):
        return node.value

    if isinstance(node, ast.Num):
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

    if isinstance(node, ast.List):
        return [eval_node(elt, resolve_name, call_func) for elt in node.elts]

    raise ParseError(f"Unsupported expression type: {type(node).__name__}")
