from decimal import Decimal, getcontext

# Set global decimal precision context
getcontext().prec = 50

class DualNumber:
    def __init__(self, real, dual=0):
        self.real = Decimal(str(real))
        self.dual = Decimal(str(dual))
        
    def __add__(self, other):
        if not isinstance(other, DualNumber):
            other = DualNumber(other)
        return DualNumber(self.real + other.real, self.dual + other.dual)
        
    def __radd__(self, other):
        return self.__add__(other)
        
    def __sub__(self, other):
        if not isinstance(other, DualNumber):
            other = DualNumber(other)
        return DualNumber(self.real - other.real, self.dual - other.dual)
        
    def __rsub__(self, other):
        if not isinstance(other, DualNumber):
            other = DualNumber(other)
        return DualNumber(other.real - self.real, other.dual - self.dual)
        
    def __mul__(self, other):
        if not isinstance(other, DualNumber):
            other = DualNumber(other)
        real_part = self.real * other.real
        dual_part = (self.real * other.dual) + (self.dual * other.real)
        return DualNumber(real_part, dual_part)
        
    def __rmul__(self, other):
        return self.__mul__(other)
        
    def __pow__(self, power):
        if not isinstance(power, int):
            raise TypeError("Integer exponents only.")
        if power < 0:
            raise NotImplementedError("Negative powers require tracking division.")
            
        result = DualNumber(1, 0)
        base = self
        for _ in range(power):
            result = result * base
        return result

    def __repr__(self):
        return f"{self.real} + {self.dual}ε"


def derivative(f, x):
    """
    Computes the exact derivative of function f at point x 
    using forward-mode automatic differentiation via dual numbers.
    """
    return f(DualNumber(x, 1)).dual
  
