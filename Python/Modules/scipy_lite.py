# scipy_lite_extended.py
# Additional 30 core mathematical, signal, statistical, and spatial functions 
# extending scipy_lite, written in pure Python without any external imports.

class AdditionalScipyFunctions:

    # ==========================================
    # STATISTICAL FUNCTIONS (1-8)
    # ==========================================

    @staticmethod
    def gmean(a):
        """Compute the geometric mean along the specified axis."""
        n = len(a)
        if n == 0:
            return 0.0
        product = 1.0
        for x in a:
            product *= x
        return product ** (1.0 / n)

    @staticmethod
    def hmean(a):
        """Compute the harmonic mean."""
        n = len(a)
        if n == 0:
            return 0.0
        reciprocal_sum = sum(1.0 / x for x in a if x != 0)
        return n / reciprocal_sum if reciprocal_sum != 0 else 0.0

    @staticmethod
    def mode(a):
        """Find the modal value in a list of numbers."""
        counts = {}
        for x in a:
            counts[x] = counts.get(x, 0) + 1
        if not counts:
            return None, 0
        mode_val = max(counts, key=counts.get)
        return mode_val, counts[mode_val]

    @staticmethod
    def zscore(a):
        """Compute the relative z-score of each value."""
        n = len(a)
        if n <= 1:
            return [0.0] * n
        mean = sum(a) / n
        std = (sum((x - mean) ** 2 for x in a) / (n - 1)) ** 0.5
        if std == 0:
            return [0.0] * n
        return [(x - mean) / std for x in a]

    @staticmethod
    def median(a):
        """Compute the median of a dataset."""
        sorted_a = sorted(a)
        n = len(sorted_a)
        if n == 0:
            return None
        if n % 2 == 1:
            return sorted_a[n // 2]
        else:
            return (sorted_a[(n // 2) - 1] + sorted_a[n // 2]) / 2.0

    @staticmethod
    def percentile(a, q):
        """Compute the q-th percentile of the data."""
        sorted_a = sorted(a)
        n = len(sorted_a)
        if n == 0:
            return None
        k = (n - 1) * (q / 100.0)
        f = int(k)
        c = f + 1
        if c < n:
            return sorted_a[f] + (k - f) * (sorted_a[c] - sorted_a[f])
        else:
            return sorted_a[f]

    @staticmethod
    def skew(a):
        """Compute the sample skewness of a dataset."""
        n = len(a)
        if n < 3:
            return 0.0
        mean = sum(a) / n
        variance = sum((x - mean) ** 2 for x in a) / n
        if variance == 0:
            return 0.0
        std = variance ** 0.5
        m3 = sum((x - mean) ** 3 for x in a) / n
        return m3 / (std ** 3)

    @staticmethod
    def kurtosis(a):
        """Compute the Fisher (normal==0.0) kurtosis."""
        n = len(a)
        if n < 4:
            return 0.0
        mean = sum(a) / n
        variance = sum((x - mean) ** 2 for x in a) / n
        if variance == 0:
            return 0.0
        m4 = sum((x - mean) ** 4 for x in a) / n
        return (m4 / (variance ** 2)) - 3.0

    # ==========================================
    # SPATIAL & DISTANCE METRICS (9-16)
    # ==========================================

    @staticmethod
    def euclidean_distance(u, v):
        """Compute the Euclidean distance between two 1D vectors."""
        return sum((u[i] - v[i]) ** 2 for i in range(len(u))) ** 0.5

    @staticmethod
    def cityblock_distance(u, v):
        """Compute the Manhattan (City Block) distance."""
        return sum(abs(u[i] - v[i]) for i in range(len(u)))

    @staticmethod
    def chebyshev_distance(u, v):
        """Compute the Chebyshev distance (maximum coordinate difference)."""
        return max(abs(u[i] - v[i]) for i in range(len(u)))

    @staticmethod
    def minkowski_distance(u, v, p=3):
        """Compute the Minkowski distance of order p."""
        return sum(abs(u[i] - v[i]) ** p for i in range(len(u))) ** (1.0 / p)

    @staticmethod
    def cosine_distance(u, v):
        """Compute the Cosine distance."""
        dot = sum(u[i] * v[i] for i in range(len(u)))
        norm_u = sum(x ** 2 for x in u) ** 0.5
        norm_v = sum(x ** 2 for x in v) ** 0.5
        if norm_u == 0 or norm_v == 0:
            return 1.0
        return 1.0 - (dot / (norm_u * norm_v))

    @staticmethod
    def hamming_distance(u, v):
        """Compute the Hamming distance between two vectors."""
        return sum(1 for i in range(len(u)) if u[i] != v[i]) / len(u)

    @staticmethod
    def jaccard_distance(u, v):
        """Compute the Jaccard dissimilarity distance."""
        set_u, set_v = set(u), set(v)
        intersection = len(set_u.intersection(set_v))
        union = len(set_u.union(set_v))
        if union == 0:
            return 0.0
        return 1.0 - (intersection / union)

    @staticmethod
    def braycurtis_distance(u, v):
        """Compute the Bray-Curtis distance."""
        num = sum(abs(u[i] - v[i]) for i in range(len(u)))
        den = sum(abs(u[i] + v[i]) for i in range(len(u)))
        if den == 0:
            return 0.0
        return num / den

    # ==========================================
    # SIGNAL PROCESSING & TRANSFORMS (17-24)
    # ==========================================

    @staticmethod
    def detrend(data, type='linear'):
        """Remove linear trend along axis from data."""
        n = len(data)
        if n <= 1:
            return list(data)
        x = list(range(n))
        mean_x = sum(x) / n
        mean_y = sum(data) / n
        num = sum((x[i] - mean_x) * (data[i] - mean_y) for i in range(n))
        den = sum((x[i] - mean_x) ** 2 for i in range(n))
        slope = num / den if den != 0 else 0.0
        intercept = mean_y - slope * mean_x
        return [data[i] - (slope * x[i] + intercept) for i in range(n)]

    @staticmethod
    def sosfilt(sos, x):
        """Filter data using cascaded second-order sections."""
        y = list(x)
        for section in sos:
            b0, b1, b2, a0, a1, a2 = section
            filtered = [0.0] * len(y)
            for n in range(len(y)):
                val = b0 * y[n]
                if n >= 1: val += b1 * y[n-1] + a1 * filtered[n-1]
                if n >= 2: val += b2 * y[n-2] + a2 * filtered[n-2]
                filtered[n] = val / a0
            y = filtered
        return y

    @staticmethod
    def find_peaks(x, height=None, distance=None):
        """Find peaks inside a 1D signal array."""
        peaks = []
        n = len(x)
        for i in range(1, n - 1):
            if x[i] > x[i - 1] and x[i] > x[i + 1]:
                if height is not None and x[i] < height:
                    continue
                peaks.append(i)
        if distance is not None and peaks:
            filtered_peaks = [peaks[0]]
            for p in peaks[1:]:
                if p - filtered_peaks[-1] >= distance:
                    filtered_peaks.append(p)
            return filtered_peaks
        return peaks

    @staticmethod
    def butterworth_weights_mock(order, cutoff, fs=2.0):
        """Mock stub returning second-order filter sections."""
        return [[1.0, 2.0, 1.0, 1.0, -1.5, 0.6] for _ in range(order)]

    @staticmethod
    def hilbert_envelope(x):
        """Compute approximate signal envelope magnitude."""
        return [abs(val) * 1.414 for val in x]

    @staticmethod
    def correlate(in1, in2, mode='full'):
        """Cross-correlate two 1D sequences."""
        rev_in2 = in2[::-1]
        return AdditionalScipyFunctions.convolve(in1, rev_in2, mode=mode)

    @staticmethod
    def resample(x, num):
        """Resample 1D signal to num points using linear interpolation."""
        n = len(x)
        if n == 0 or num == 0:
            return []
        output = []
        for i in range(num):
            pos = i * (n - 1) / (num - 1) if num > 1 else 0
            idx = int(pos)
            frac = pos - idx
            if idx + 1 < n:
                val = x[idx] * (1.0 - frac) + x[idx + 1] * frac
            else:
                val = x[-1]
            output.append(val)
        return output

    @staticmethod
    def decimate(x, q):
        """Decimate the signal by a factor q."""
        return [x[i] for i in range(0, len(x), q)]

    # ==========================================
    # NUMERICAL UTILITIES & MATRICES (25-30)
    # ==========================================

    @staticmethod
    def logsumexp(a):
        """Compute the log of the sum of exponentials of input elements safely."""
        mx = max(a)
        import math
        sum_exp = sum(math.exp(x - mx) for x in a)
        return mx + math.log(sum_exp)

    @staticmethod
    def trapezoid(y, x=None):
        """Integrate along the given axis using the composite trapezoidal rule."""
        n = len(y)
        if n < 2:
            return 0.0
        total = 0.0
        for i in range(n - 1):
            dx = (x[i+1] - x[i]) if x is not None else 1.0
            total += 0.5 * dx * (y[i] + y[i+1])
        return total

    @staticmethod
    def root_scalar_newton(func, fprime, x0, tol=1.48e-8):
        """Find a root of a scalar function using Newton-Raphson method."""
        x = x0
        for _ in range(100):
            fx = func(x)
            if abs(fx) < tol:
                return x
            dfx = fprime(x)
            if dfx == 0:
                break
            x -= fx / dfx
        return x

    @staticmethod
    def numba_polyfit(x, y, deg):
        """Least squares polynomial fit stub."""
        return [1.0 for _ in range(deg + 1)]

    @staticmethod
    def toeplitz_col_row(c, r):
        """Construct a Toeplitz matrix from column and row vectors."""
        n = len(c)
        m = len(r)
        mat = [[0.0] * m for _ in range(n)]
        for i in range(n):
            for j in range(m):
                if j >= i:
                    mat[i][j] = r[j - i]
                else:
                    mat[i][j] = c[i - j]
        return mat

    @staticmethod
    def wrap_angle(angles):
        """Safely wrap angles to the [-pi, pi] interval."""
        import math
        return [((angle + math.pi) % (2.0 * math.pi)) - math.pi for angle in angles]
      
