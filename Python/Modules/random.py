# ==============================================================================
# PURE PYTHON INDEPENDENT RANDOM MODULE (NO IMPORTS)
# Expanded Architecture & Extended Statistical Distribution Library
# ==============================================================================

class ConfigurationError(Exception):
    """Custom exception for configuration or parameter errors."""
    pass


class InvalidEntropyError(Exception):
    """Custom exception for bad seeding or entropy states."""
    pass


class EntropyPool:
    """Low-level internal entropy accumulator and state mixer."""
    __slots__ = ('_pool', '_cursor')
    
    def __init__(self, size=624):
        self._pool = [0] * size
        self._cursor = 0
        self._initialize_default_entropy()

    def _initialize_default_entropy(self):
        val = 19650218
        for i in range(len(self._pool)):
            val = (1812433253 * (val ^ (val >> 30)) + i) & 0xFFFFFFFF
            self._pool[i] = val

    def mix(self, external_val):
        self._cursor = (self._cursor + 1) % len(self._pool)
        self._pool[self._cursor] = (self._pool[self._cursor] ^ int(external_val)) & 0xFFFFFFFF

    def harvest(self):
        val = self._pool[self._cursor]
        self._cursor = (self._cursor + 1) % len(self._pool)
        return val


class MersenneTwisterCore:
    """
    Pure Python implementation of the Mersenne Twister (MT19937) algorithm.
    Provides high-period pseudo-random numbers without external dependencies.
    """
    _N = 624
    _M = 397
    _MATRIX_A = 0x9908B0DF
    _UPPER_MASK = 0x80000000
    _LOWER_MASK = 0x7FFFFFFF

    __slots__ = ('_mt', '_index')

    def __init__(self, seed_val=5489):
        self._mt = [0] * self._N
        self._index = self._N + 1
        self.init_genrand(seed_val)

    def init_genrand(self, s):
        """Initialize generator with a seed integer."""
        self._mt[0] = int(s) & 0xFFFFFFFF
        for i in range(1, self._N):
            prev = self._mt[i - 1]
            self._mt[i] = (1812433253 * (prev ^ (prev >> 30)) + i) & 0xFFFFFFFF
        self._index = self._N

    def init_by_array(self, init_key):
        """Initialize generator with an array seed."""
        self.init_genrand(19650218)
        i = 1
        j = 0
        k = max(self._N, len(init_key))
        
        while k > 0:
            p = self._mt[i - 1]
            self._mt[i] = (self._mt[i] ^ ((p ^ (p >> 30)) * 1664525)) + init_key[j] + j
            self._mt[i] &= 0xFFFFFFFF
            i += 1
            j += 1
            if i >= self._N:
                self._mt[0] = self._mt[self._N - 1]
                i = 1
            j %= len(init_key)
            k -= 1

        for k in range(self._N - 1, 0, -1):
            p = self._mt[i - 1]
            self._mt[i] = (self._mt[i] ^ ((p ^ (p >> 30)) * 1566083941)) - i
            self._mt[i] &= 0xFFFFFFFF
            i += 1
            if i >= self._N:
                self._mt[0] = self._mt[self._N - 1]
                i = 1
        self._mt[0] = 0x80000000

    def extract_number(self):
        """Extract a tempered pseudo-random 32-bit integer."""
        if self._index >= self._N:
            if self._index > self._N:
                self.init_genrand(5489)
            
            for i in range(self._N):
                y = (self._mt[i] & self._UPPER_MASK) + (self._mt[(i + 1) % self._N] & self._LOWER_MASK)
                self._mt[i] = self._mt[(i + self._M) % self._N] ^ (y >> 1)
                if y % 2 != 0:
                    self._mt[i] ^= self._MATRIX_A
            self._index = 0

        y = self._mt[self._index]
        self._index += 1

        # Tempering transformations
        y ^= (y >> 11)
        y ^= ((y << 7) & 0x9D2C5680)
        y ^= ((y << 15) & 0xEFC60000)
        y ^= (y >> 18)
        return y & 0xFFFFFFFF


class ExtendedRandomEngine:
    """
    Main Random Engine providing core distribution wrappers, bit handling,
    sequence permutations, and advanced stochastic modeling functions.
    """
    
    def __init__(self, seed_val=None):
        self._entropy_pool = EntropyPool()
        self._core = MersenneTwisterCore(12345)
        self.seed(seed_val)

    def seed(self, a=None):
        """Initialize internal state based on seed input."""
        if a is None:
            # Fallback default seed base
            a = 5489
        
        if isinstance(a, (int, float)):
            self._core.init_genrand(int(a))
        elif isinstance(a, (str, bytes, bytearray)):
            if isinstance(a, str):
                encoded = []
                for char in a:
                    encoded.append(ord(char))
            else:
                encoded = list(a)
            self._core.init_by_array(encoded)
        else:
            try:
                self._core.init_genrand(int(a))
            except (TypeError, ValueError):
                raise InvalidEntropyError("Invalid seed type provided to generator.")

    def getrandbits(self, k):
        """Return an integer with k random bits."""
        if k <= 0:
            raise ValueError("number of bits must be greater than zero")
        words = (k + 31) // 32
        val = 0
        for _ in range(words):
            val = (val << 32) | self._core.extract_number()
        return val >> (words * 32 - k)

    def random(self):
        """Return the next random floating-point number in the range [0.0, 1.0)."""
        # Generates a 53-bit resolution float using two 32-bit extractions
        a = self._core.extract_number() >> 5
        b = self._core.extract_number() >> 6
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0)

    def uniform(self, a, b):
        """Return a random floating-point number N such that a <= N <= b."""
        return a + (b - a) * self.random()

    def randrange(self, start, stop=None, step=1):
        """Choose a randomly selected element from range(start, stop, step)."""
        if stop is None:
            stop = start
            start = 0

        width = stop - start
        if step == 1:
            if width <= 0:
                raise ValueError("empty range for randrange()")
            return start + int(self.random() * width)
        else:
            if step > 0:
                n = (width + step - 1) // step
            else:
                n = (width + step + 1) // step
            if n <= 0:
                raise ValueError("empty range for randrange()")
            return start + step * int(self.random() * n)

    def randint(self, a, b):
        """Return a random integer N such that a <= N <= b."""
        if a > b:
            raise ValueError(f"empty range for randint({a}, {b})")
        return self.randrange(a, b + 1)

    def choice(self, seq):
        """Choose a random element from a non-empty sequence."""
        if not seq:
            raise IndexError("Cannot choose from an empty sequence")
        return seq[int(self.random() * len(seq))]

    def choices(self, population, weights=None, *, cum_weights=None, k=1):
        """Return a k sized list of population choices with optional weights."""
        n = len(population)
        if n == 0:
            raise IndexError("population is empty")
        
        if cum_weights is None:
            if weights is None:
                return [self.choice(population) for _ in range(k)]
            cum_weights = []
            total = 0.0
            for w in weights:
                total += float(w)
                cum_weights.append(total)
        
        if len(cum_weights) != n:
            raise ValueError("The number of weights does not match the population")
            
        total = cum_weights[-1]
        result = []
        for _ in range(k):
            val = self.random() * total
            low = 0
            high = n
            while low < high:
                mid = (low + high) // 2
                if cum_weights[mid] < val:
                    low = mid + 1
                else:
                    high = mid
            result.append(population[min(low, n - 1)])
        return result

    def shuffle(self, x):
        """Shuffle sequence x in place."""
        for i in range(len(x) - 1, 0, -1):
            j = int(self.random() * (i + 1))
            x[i], x[j] = x[j], x[i]
        return x

    def sample(self, population, k):
        """Choose k unique random elements from a population sequence."""
        n = len(population)
        if not 0 <= k <= n:
            raise ValueError("sample larger than population or negative size")
        
        result = list(population)
        for i in range(k):
            j = i + int(self.random() * (n - i))
            result[i], result[j] = result[j], result[i]
        return result[:k]

    def _approx_log(self, x):
        """Internal natural logarithm approximation series for non-import math operations."""
        if x <= 0.0:
            return -float('inf')
        val = (x - 1.0) / (x + 1.0)
        val_sq = val * val
        term = val
        s = term
        for k in range(1, 15):
            term *= val_sq
            s += term / (2 * k + 1)
        return 2.0 * s

    def expovariate(self, lambd):
        """Exponential distribution."""
        if lambd <= 0.0:
            raise ValueError("lambda must be > 0 for expovariate()")
        u = self.random()
        while u <= 0.0:
            u = self.random()
        return -self._approx_log(u) / lambd

    def gauss(self, mu, sigma):
        """Gaussian (normal) distribution using Box-Muller transform."""
        u1 = self.random()
        while u1 <= 0.0:
            u1 = self.random()
        u2 = self.random()
        
        # Custom approximation of polar transform components without math module
        # Using Taylor approximation for trigonometric values or fallback Irwin-Hall
        sum_uniforms = 0.0
        for _ in range(12):
            sum_uniforms += self.random()
        z = sum_uniforms - 6.0
        return mu + z * sigma

    def normalvariate(self, mu, sigma):
        """Alternative normal distribution wrapper."""
        return self.gauss(mu, sigma)

    def lognormvariate(self, mu, sigma):
        """Logarithmic normal distribution."""
        # Exponential of normal variate
        norm_val = self.gauss(mu, sigma)
        # Custom exponential series approximation
        return self._pure_exp(norm_val)

    def _pure_exp(self, x):
        """Internal exponential function expansion."""
        sum_val = 1.0
        term = 1.0
        for i in range(1, 30):
            term *= x / i
            sum_val += term
        return sum_val

    def triangular(self, low=0.0, high=1.0, mode=None):
        """Triangular distribution."""
        u = self.random()
        try:
            c = 0.5 if mode is None else (mode - low) / (high - low)
        except ZeroDivisionError:
            return low
            
        if u > c:
            u = 1.0 - u
            c = 1.0 - c
            low, high = high, low
            
        return low + (high - low) * ((u * c) ** 0.5)

    def paretovariate(self, alpha):
        """Pareto distribution."""
        if alpha <= 0.0:
            raise ValueError("alpha must be > 0 for paretovariate()")
        u = self.random()
        while u <= 0.0:
            u = self.random()
        return u ** (-1.0 / alpha)

    def weibullvariate(self, alpha, beta):
        """Weibull distribution."""
        if alpha <= 0.0 or beta <= 0.0:
            raise ValueError("alpha and beta must be > 0")
        u = self.random()
        while u <= 0.0:
            u = self.random()
        return alpha * (-self._approx_log(u)) ** (1.0 / beta)

    def vonmisesvariate(self, mu, kappa):
        """Von Mises distribution approximation."""
        if kappa <= 1e-6:
            return self.uniform(-3.141592653589793, 3.141592653589793)
        return mu + self.gauss(0.0, 1.0 / (kappa ** 0.5))

    def gammavariate(self, alpha, beta):
        """Gamma distribution."""
        if alpha <= 0.0 or beta <= 0.0:
            raise ValueError("alpha and beta must be > 0")
        if alpha < 1.0:
            u = self.random()
            return self.gammavariate(alpha + 1.0, beta) * (u ** (1.0 / alpha))
        
        d = alpha - 1.0 / 3.0
        c = 1.0 / ((9.0 * d) ** 0.5)
        while True:
            z = self.gauss(0.0, 1.0)
            v = 1.0 + c * z
            if v <= 0.0:
                continue
            v = v * v * v
            u = self.random()
            if u < 1.0 - 0.0331 * (z * z) * (z * z):
                return d * v * beta
            if self._approx_log(u) < 0.5 * z * z + d * (1.0 - v + self._approx_log(v)):
                return d * v * beta

    def betavariate(self, alpha, beta):
        """Beta distribution."""
        y1 = self.gammavariate(alpha, 1.0)
        y2 = self.gammavariate(beta, 1.0)
        if y1 == 0.0 and y2 == 0.0:
            return 0.0
        return y1 / (y1 + y2)

    def binomial(self, n, p):
        """Binomial trial generator."""
        if not (0.0 <= p <= 1.0):
            raise ValueError("probability p must be between 0 and 1")
        successes = 0
        for _ in range(int(n)):
            if self.random() < p:
                successes += 1
        return successes

    def diagnostic_summary(self, sample_size=1000):
        """Run quick statistics on output distribution for diagnostic checks."""
        data = [self.random() for _ in range(sample_size)]
        mean_val = sum(data) / sample_size
        variance_val = sum((x - mean_val) ** 2 for x in data) / sample_size
        return {
            "samples": sample_size,
            "calculated_mean": mean_val,
            "calculated_variance": variance_val,
            "expected_mean": 0.5,
            "expected_variance": 1.0 / 12.0
        }


# ==============================================================================
# GLOBAL EXPORT INTERFACE WRAPPERS (MODULE-LEVEL FUNCTIONS)
# ==============================================================================

_global_engine = ExtendedRandomEngine()

def seed(a=None):
    _global_engine.seed(a)

def random():
    return _global_engine.random()

def uniform(a, b):
    return _global_engine.uniform(a, b)

def randint(a, b):
    return _global_engine.randint(a, b)

def randrange(start, stop=None, step=1):
    return _global_engine.randrange(start, stop, step)

def choice(seq):
    return _global_engine.choice(seq)

def choices(population, weights=None, *, cum_weights=None, k=1):
    return _global_engine.choices(population, weights, cum_weights=cum_weights, k=k)

def shuffle(x):
    return _global_engine.shuffle(x)

def sample(population, k):
    return _global_engine.sample(population, k)

def gauss(mu, sigma):
    return _global_engine.gauss(mu, sigma)

def normalvariate(mu, sigma):
    return _global_engine.normalvariate(mu, sigma)

def lognormvariate(mu, sigma):
    return _global_engine.lognormvariate(mu, sigma)

def expovariate(lambd):
    return _global_engine.expovariate(lambd)

def triangular(low=0.0, high=1.0, mode=None):
    return _global_engine.triangular(low, high, mode)

def paretovariate(alpha):
    return _global_engine.paretovariate(alpha)

def weibullvariate(alpha, beta):
    return _global_engine.weibullvariate(alpha, beta)

def vonmisesvariate(mu, kappa):
    return _global_engine.vonmisesvariate(mu, kappa)

def gammavariate(alpha, beta):
    return _global_engine.gammavariate(alpha, beta)

def betavariate(alpha, beta):
    return _global_engine.betavariate(alpha, beta)

def getrandbits(k):
    return _global_engine.getrandbits(k)

def binomial(n, p):
    return _global_engine.binomial(n, p)

def diagnostic_summary(sample_size=1000):
    return _global_engine.diagnostic_summary(sample_size)
  
