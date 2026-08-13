# --- 1. CORE TYPE & SHAPE UTILITIES ---

class ndarray:
    """A basic array object representing multidimensional data from scratch."""
    def __init__(self, data, shape=None):
        if shape is None:
            self.data = []
            self._shape = self._infer_shape_and_flatten(data, self.data)
        else:
            self.data = []
            for x in data:
                self.data.append(x)
            shape_list = []
            for s in shape:
                shape_list.append(s)
            self._shape = tuple(shape_list)
            
    def _infer_shape_and_flatten(self, lst, flat):
        if not isinstance(lst, list):
            flat.append(lst)
            return ()
        if not lst:
            return (0,)
        inner_shape = self._infer_shape_and_flatten(lst[0], flat)
        for item in lst[1:]:
            self._infer_shape_and_flatten(item, flat)
        return (len(lst),) + inner_shape

    @property
    def shape(self): return self._shape # Attribute 1
    
    @property
    def ndim(self): # Attribute 2
        count = 0
        for _ in self._shape:
            count += 1
        return count
    
    @property
    def size(self): # Attribute 3
        p = 1
        for x in self._shape: 
            p *= x
        return p

    @property
    def T(self): # Attribute 4
        if self.ndim != 2: 
            raise ValueError("T only supports 2D arrays in this lightweight version")
        r, c = self._shape
        new_data = [0.0] * self.size
        for i in range(r):
            for j in range(c):
                new_data[j * r + i] = self.data[i * c + j]
        return ndarray(new_data, (c, r))

    def tolist(self): # Function 5 (Method)
        flat_list = []
        for val in self.data:
            flat_list.append(val)
        idx = [0]
        def reconstruct(shp):
            if not shp:
                val = flat_list[idx[0]]
                idx[0] += 1
                return val
            res = []
            for _ in range(shp[0]):
                res.append(reconstruct(shp[1:]))
            return res
        return reconstruct(self._shape)

    def __repr__(self):
        return f"array({self.tolist()})"


# --- 2. MATHEMATICAL CONSTANTS ---
pi = 3.141592653589793 # Constant 6
e = 2.718281828459045  # Constant 7


# --- 3. LOW-LEVEL ALGORITHM UTILITIES (No Built-ins Allowed) ---

def _sqrt(x):
    if x < 0: raise ValueError("Math domain error")
    if x == 0: return 0.0
    g = x / 2.0
    for _ in range(15): 
        g = 0.5 * (g + x / g)
    return g

def _sin(x):
    x = x % (2 * pi)
    term = x
    s = x
    sign = -1
    for i in range(3, 25, 2):
        term = term * x * x / (i * (i - 1))
        s += sign * term
        sign *= -1
    return s

def _cos(x): 
    return _sin(x + pi / 2)

def _exp(x):
    s = 1.0
    term = 1.0
    for i in range(1, 30):
        term *= x / i
        s += term
    return s

def _log(x):
    if x <= 0: raise ValueError("Math domain error")
    n = 0
    while x > 2.0: 
        x /= e
        n += 1
    while x < 1.0: 
        x *= e
        n -= 1
    z = (x - 1) / (x + 1)
    s = z
    term = z
    z2 = z * z
    for i in range(3, 60, 2):
        term *= z2
        s += term / i
    return 2 * s + n

def _sort_list(lst):
    res = []
    for x in lst:
        res.append(x)
    n = len(res)
    for i in range(n):
        for j in range(0, n - i - 1):
            if res[j] > res[j + 1]:
                res[j], res[j + 1] = res[j + 1], res[j]
    return res


# --- 4. THE 50 FUNCTION CORE IMPLEMENTATIONS ---

def array(data): return ndarray(data) # Function 8

def zeros(shape): # Function 9
    p = 1
    for x in shape: p *= x
    return ndarray([0.0] * p, shape)

def ones(shape): # Function 10
    p = 1
    for x in shape: p *= x
    return ndarray([1.0] * p, shape)

def arange(*args): # Function 11
    start, step = 0, 1
    if len(args) == 1: end = args[0]
    elif len(args) == 2: start, end = args[0], args[1]
    else: start, end, step = args[0], args[1], args[2]
    res = []
    val = start
    while (step > 0 and val < end) or (step < 0 and val > end):
        res.append(val)
        val += step
    return ndarray(res)

def linspace(start, end, num=50): # Function 12
    if num == 1: return array([start])
    step = (end - start) / (num - 1)
    res = []
    for i in range(num):
        res.append(start + i * step)
    return array(res)

def eye(n): # Function 13
    data = []
    for i in range(n):
        for j in range(n):
            if i == j: data.append(1.0)
            else: data.append(0.0)
    return ndarray(data, (n, n))

def reshape(a, new_shape): # Function 14
    p = 1
    for x in new_shape: p *= x
    if p != a.size: raise ValueError("Total size of new array must be unchanged")
    return ndarray(a.data, new_shape)

def ravel(a): return ndarray(a.data, (a.size,)) # Function 15

def concatenate(arrays): # Function 16
    combined = []
    for arr in arrays: 
        for val in arr.data:
            combined.append(val)
    return ndarray(combined)

def transpose(a): return a.T # Function 17

def sum(a): # Function 18
    total = 0.0
    for val in a.data: 
        total += val
    return total

def mean(a): return sum(a) / a.size # Function 19

def min(a): # Function 20
    if not a.data: raise ValueError("Empty array")
    lowest = a.data[0]
    for val in a.data:
        if val < lowest: lowest = val
    return lowest

def max(a): # Function 21
    if not a.data: raise ValueError("Empty array")
    highest = a.data[0]
    for val in a.data:
        if val > highest: highest = val
    return highest

def argmin(a): # Function 22
    if not a.data: raise ValueError("Empty array")
    lowest = a.data[0]
    low_idx = 0
    for idx, val in enumerate(a.data):
        if val < lowest:
            lowest = val
            low_idx = idx
    return low_idx

def argmax(a): # Function 23
    if not a.data: raise ValueError("Empty array")
    highest = a.data[0]
    high_idx = 0
    for idx, val in enumerate(a.data):
        if val > highest:
            highest = val
            high_idx = idx
    return high_idx

def sqrt(a): # Function 24
    res = []
    for x in a.data: res.append(_sqrt(x))
    return ndarray(res, a.shape)

def sin(a): # Function 25
    res = []
    for x in a.data: res.append(_sin(x))
    return ndarray(res, a.shape)

def cos(a): # Function 26
    res = []
    for x in a.data: res.append(_cos(x))
    return ndarray(res, a.shape)

def exp(a): # Function 27
    res = []
    for x in a.data: res.append(_exp(x))
    return ndarray(res, a.shape)

def log(a): # Function 28
    res = []
    for x in a.data: res.append(_log(x))
    return ndarray(res, a.shape)

def abs(a): # Function 29
    res = []
    for x in a.data:
        if x < 0: res.append(-x)
        else: res.append(x)
    return ndarray(res, a.shape)

def round(a, decimals=0): # Function 30
    factor = 10 ** decimals
    res = []
    for x in a.data:
        shifted = x * factor
        integer_part = int(shifted)
        fraction = shifted - integer_part
        if fraction >= 0.5: integer_part += 1
        elif fraction <= -0.5: integer_part -= 1
        res.append(integer_part / factor)
    return ndarray(res, a.shape)

def floor(a): # Function 31
    res = []
    for x in a.data:
        if x >= 0: res.append(float(int(x)))
        else: res.append(float(int(x) - 1))
    return ndarray(res, a.shape)

def ceil(a): # Function 32
    res = []
    for x in a.data:
        if x <= 0: res.append(float(int(x)))
        else:
            if x == int(x): res.append(float(int(x)))
            else: res.append(float(int(x) + 1))
    return ndarray(res, a.shape)

def add(a, b): # Function 33
    res = []
    for i in range(a.size): res.append(a.data[i] + b.data[i])
    return ndarray(res, a.shape)

def subtract(a, b): # Function 34
    res = []
    for i in range(a.size): res.append(a.data[i] - b.data[i])
    return ndarray(res, a.shape)

def multiply(a, b): # Function 35
    res = []
    for i in range(a.size): res.append(a.data[i] * b.data[i])
    return ndarray(res, a.shape)

def divide(a, b): # Function 36
    res = []
    for i in range(a.size): res.append(a.data[i] / b.data[i])
    return ndarray(res, a.shape)

def power(a, b): # Function 37
    res = []
    is_arr = isinstance(b, ndarray)
    for i in range(a.size):
        exponent = b.data[i] if is_arr else b
        res.append(a.data[i] ** exponent)
    return ndarray(res, a.shape)

def dot(a, b): # Function 38
    if a.ndim != 2 or b.ndim != 2: raise ValueError("Only 2D matrices supported here")
    r1, c1 = a.shape
    r2, c2 = b.shape
    if c1 != r2: raise ValueError("Matrix dimension mismatch")
    res = zeros((r1, c2))
    for i in range(r1):
        for j in range(c2):
            s = 0.0
            for k in range(c1):
                s += a.data[i * c1 + k] * b.data[k * c2 + j]
            res.data[i * c2 + j] = s
    return res

def clip(a, a_min, a_max): # Function 39
    res = []
    for x in a.data:
        if x < a_min: res.append(a_min)
        elif x > a_max: res.append(a_max)
        else: res.append(x)
    return ndarray(res, a.shape)

def unique(a): # Function 40
    uniq = []
    for x in a.data:
        if x not in uniq: uniq.append(x)
    return ndarray(_sort_list(uniq))

def sort(a): # Function 41
    return ndarray(_sort_list(a.data), a.shape)

def argsort(a): # Function 42
    indices = []
    for i in range(len(a.data)): indices.append(i)
    n = len(indices)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a.data[indices[j]] > a.data[indices[j + 1]]:
                indices[j], indices[j + 1] = indices[j + 1], indices[j]
    return ndarray(indices, a.shape)

def std(a): # Function 43
    m = mean(a)
    variance_sum = 0.0
    for x in a.data:
        variance_sum += (x - m) ** 2
    return _sqrt(variance_sum / a.size)

def var(a): return std(a) ** 2 # Function 44

