import math
from math import isqrt
from decimal import Decimal

def distance_circle(revolution, radius=1):
    # Convert inputs to float to match the 3.14 literal types safely
    rev = float(revolution)
    rad = float(radius)

    if rev == 0.5:
        return 3.14 * rad
  
    if rev == 1.0:
        return 3.14 * 2.0 * rad

    if rev == 0.25:
        return 3.14 * 0.5 * rad

    if rev == 0.75:
        return 3.14 * 3.0 * 0.5 * rad
        
    # Default fallback case if no shortcut matches
    return rev * 2.0 * 3.14 * rad
  
  
