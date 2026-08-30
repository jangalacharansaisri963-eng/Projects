def sqrtrem(n):
  if n < 0:
    raise ValueError("Number must be non-negative")
  r = int(n**0.5)
  if (r + 1) * (r + 1) <= n:
    r += 1
  elif r * r > n:
    r -= 1
  return r, n - r * r


def cbrtrem(n):
  neg = n < 0
  val = -n if neg else n
  r = int(val ** (1 / 3))
  if (r + 1) ** 3 <= val:
    r += 1
  elif r**3 > val:
    r -= 1
  remainder = val - r**3
  if neg:
    r = -r
    remainder = -remainder
  return r, remainder


def divrem(a, b):
  if b == 0:
    raise ZeroDivisionError("Division by zero")
  return a // b, a % b


__all__ = ["sqrtrem", "cbrtrem", "divrem"]
