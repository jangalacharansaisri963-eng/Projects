object CustomMath {
    // 1-6: Abs
    fun abs(n: Int): Int = if (n < 0) -n else n
    fun abs(n: Long): Long = if (n < 0) -n else n
    fun abs(n: Float): Float = if (n < 0f) -n else n
    fun abs(n: Double): Double = if (n < 0.0) -n else n
    fun abs(n: Short): Int = if (n < 0) -n else n.toInt()
    fun abs(n: Byte): Int = if (n < 0) -n else n.toInt()

    // 7-14: Max
    fun max(a: Int, b: Int): Int = if (a >= b) a else b
    fun max(a: Long, b: Long): Long = if (a >= b) a else b
    fun max(a: Float, b: Float): Float = if (a >= b) a else b
    fun max(a: Double, b: Double): Double = if (a >= b) a else b
    fun max(a: Short, b: Short): Int = if (a >= b) a.toInt() else b.toInt()
    fun max(a: Byte, b: Byte): Int = if (a >= b) a.toInt() else b.toInt()
    fun max3(a: Double, b: Double, c: Double): Double = max(max(a, b), c)
    fun max4(a: Double, b: Double, c: Double, d: Double): Double = max(max3(a, b, c), d)

    // 15-22: Min
    fun min(a: Int, b: Int): Int = if (a <= b) a else b
    fun min(a: Long, b: Long): Long = if (a <= b) a else b
    fun min(a: Float, b: Float): Float = if (a <= b) a else b
    fun min(a: Double, b: Double): Double = if (a <= b) a else b
    fun min(a: Short, b: Short): Int = if (a <= b) a.toInt() else b.toInt()
    fun min(a: Byte, b: Byte): Int = if (a <= b) a.toInt() else b.toInt()
    fun min3(a: Double, b: Double, c: Double): Double = min(min(a, b), c)
    fun min4(a: Double, b: Double, c: Double, d: Double): Double = min(min3(a, b, c), d)

    // 23-30: Trigonometry Standard
    fun sqrt(x: Double): Double = java.lang.Math.sqrt(x)
    fun sin(x: Double): Double = java.lang.Math.sin(x)
    fun cos(x: Double): Double = java.lang.Math.cos(x)
    fun tan(x: Double): Double = java.lang.Math.tan(x)
    fun asin(x: Double): Double = java.lang.Math.asin(x)
    fun acos(x: Double): Double = java.lang.Math.acos(x)
    fun atan(x: Double): Double = java.lang.Math.atan(x)
    fun atan2(y: Double, x: Double): Double = java.lang.Math.atan2(y, x)

    // 31-38: Exponential & Logarithmic
    fun exp(x: Double): Double = java.lang.Math.exp(x)
    fun expm1(x: Double): Double = java.lang.Math.expm1(x)
    fun ln(x: Double): Double = java.lang.Math.log(x)
    fun ln1p(x: Double): Double = java.lang.Math.log1p(x)
    fun log10(x: Double): Double = java.lang.Math.log10(x)
    fun log2(x: Double): Double = java.lang.Math.log(x) / java.lang.Math.log(2.0)
    fun log(x: Double, base: Double): Double = java.lang.Math.log(x) / java.lang.Math.log(base)
    fun pow(base: Double, exponent: Double): Double = java.lang.Math.pow(base, exponent)

    // 39-46: Hypotenuse, Rounding, Powers
    fun hypot(x: Double, y: Double): Double = java.lang.Math.hypot(x, y)
    fun ceil(x: Double): Double = java.lang.Math.ceil(x)
    fun floor(x: Double): Double = java.lang.Math.floor(x)
    fun round(x: Double): Double = java.lang.Math.rint(x)
    fun truncate(x: Double): Double = if (x < 0) java.lang.Math.ceil(x) else java.lang.Math.floor(x)
    fun roundToInt(x: Double): Int = java.lang.Math.rint(x).toInt()
    fun roundToLong(x: Double): Long = java.lang.Math.rint(x).toLong()
    fun cbrt(x: Double): Double = java.lang.Math.cbrt(x)

    // 47-58: Hyperbolic Functions
    fun sinh(x: Double): Double = java.lang.Math.sinh(x)
    fun cosh(x: Double): Double = java.lang.Math.cosh(x)
    fun tanh(x: Double): Double = java.lang.Math.tanh(x)
    fun asinh(x: Double): Double = java.lang.Math.log(x + java.lang.Math.sqrt(x * x + 1.0))
    fun acosh(x: Double): Double = java.lang.Math.log(x + java.lang.Math.sqrt(x * x - 1.0))
    fun atanh(x: Double): Double = 0.5 * java.lang.Math.log((1.0 + x) / (1.0 - x))
    fun csch(x: Double): Double = 1.0 / java.lang.Math.sinh(x)
    fun sech(x: Double): Double = 1.0 / java.lang.Math.cosh(x)
    fun coth(x: Double): Double = java.lang.Math.cosh(x) / java.lang.Math.sinh(x)
    fun acsch(x: Double): Double = asinh(1.0 / x)
    fun asech(x: Double): Double = acosh(1.0 / x)
    fun acoth(x: Double): Double = atanh(1.0 / x)

    // 59-64: Sign & Bits
    fun sign(x: Double): Double = if (x > 0.0) 1.0 else if (x < 0.0) -1.0 else 0.0
    fun sign(x: Float): Float = if (x > 0f) 1f else if (x < 0f) -1f else 0f
    fun nextUp(x: Double): Double = java.lang.Math.nextUp(x)
    fun nextUp(x: Float): Float = java.lang.Math.nextUp(x)
    fun nextDown(x: Double): Double = java.lang.Math.nextDown(x)
    fun nextDown(x: Float): Float = java.lang.Math.nextDown(x)

    // 65-72: Precision & Misc float operations
    fun nextAfter(x: Double, direction: Double): Double = java.lang.Math.nextAfter(x, direction)
    fun nextAfter(x: Float, direction: Float): Float = java.lang.Math.nextAfter(x, direction)
    fun ulp(x: Double): Double = java.lang.Math.ulp(x)
    fun ulp(x: Float): Float = java.lang.Math.ulp(x)
    fun IEEEremainder(dividend: Double, divisor: Double): Double = java.lang.Math.IEEEremainder(dividend, divisor)
    fun toRadians(deg: Double): Double = java.lang.Math.toRadians(deg)
    fun toDegrees(rad: Double): Double = java.lang.Math.toDegrees(rad)
    fun copySign(magnitude: Double, sign: Double): Double = java.lang.Math.copySign(magnitude, sign)

    // 73-80: Powers & Roots variants
    fun square(x: Double): Double = x * x
    fun square(x: Float): Float = x * x
    fun square(x: Int): Int = x * x
    fun square(x: Long): Long = x * x
    fun cube(x: Double): Double = x * x * x
    fun cube(x: Float): Float = x * x * x
    fun cube(x: Int): Int = x * x * x
    fun cube(x: Long): Long = x * x * x

    // 81-88: Parity Checks
    fun isEven(n: Int): Boolean = n % 2 == 0
    fun isEven(n: Long): Boolean = n % 2L == 0L
    fun isEven(n: Short): Boolean = n % 2 == 0
    fun isOdd(n: Int): Boolean = n % 2 != 0
    fun isOdd(n: Long): Boolean = n % 2L != 0L
    fun isOdd(n: Short): Boolean = n % 2 != 0
    fun isPositive(n: Int): Boolean = n > 0
    fun isNegative(n: Int): Boolean = n < 0

    // 89-96: Clamping variations
    fun clamp(value: Int, min: Int, max: Int): Int = if (value < min) min else if (value > max) max else value
    fun clamp(value: Long, min: Long, max: Long): Long = if (value < min) min else if (value > max) max else value
    fun clamp(value: Float, min: Float, max: Float): Float = if (value < min) min else if (value > max) max else value
    fun clamp(value: Double, min: Double, max: Double): Double = if (value < min) min else if (value > max) max else value
    fun clamp(value: Short, min: Short, max: Short): Short = if (value < min) min else if (value > max) max else value
    fun clamp(value: Byte, min: Byte, max: Byte): Byte = if (value < min) min else if (value > max) max else value
    fun saturate(value: Double): Double = clamp(value, 0.0, 1.0)
    fun saturate(value: Float): Float = clamp(value, 0f, 1f)

    // 97-104: Interpolation & Mapping
    fun lerp(start: Double, stop: Double, fraction: Double): Double = start + (stop - start) * fraction
    fun lerp(start: Float, stop: Float, fraction: Float): Float = start + (stop - start) * fraction
    fun inverseLerp(start: Double, stop: Double, value: Double): Double = (value - start) / (stop - start)
    fun inverseLerp(start: Float, stop: Float, value: Float): Float = (value - start) / (stop - start)
    fun mapRange(value: Double, inMin: Double, inMax: Double, outMin: Double, outMax: Double): Double =
        outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin)
    fun mapRange(value: Float, inMin: Float, inMax: Float, outMin: Float, outMax: Float): Float =
        outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin)
    fun smoothstep(edge0: Double, edge1: Double, x: Double): Double {
        val t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
        return t * t * (3.0 - 2.0 * t)
    }
    fun smootherstep(edge0: Double, edge1: Double, x: Double): Double {
        val t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
        return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)
    }

    // 105-112: Division & Modulo utilities
    fun invSqrt(x: Double): Double = 1.0 / java.lang.Math.sqrt(x)
    fun invSqrt(x: Float): Float = (1.0f / java.lang.Math.sqrt(x.toDouble())).toFloat()
    fun safeDiv(numerator: Double, denominator: Double, fallback: Double = 0.0): Double = if (denominator == 0.0) fallback else numerator / denominator
    fun safeDiv(numerator: Float, denominator: Float, fallback: Float = 0f): Float = if (denominator == 0f) fallback else numerator / denominator
    fun safeMod(a: Int, b: Int): Int = if (b == 0) 0 else ((a % b) + b) % b
    fun safeMod(a: Long, b: Long): Long = if (b == 0L) 0L else ((a % b) + b) % b
    fun gcd(a: Long, b: Long): Long = if (b == 0L) abs(a) else gcd(b, a % b)
    fun lcm(a: Long, b: Long): Long = if (a == 0L || b == 0L) 0L else abs(a * b) / gcd(a, b)

    // 113-120: Factorial, Powers of Two, Combinatorics
    fun factorial(n: Int): Long {
        if (n < 0) return 0L
        var res = 1L
        for (i in 2..n) res *= i
        return res
    }
    fun isPowerOfTwo(n: Int): Boolean = n > 0 && (n and (n - 1)) == 0
    fun isPowerOfTwo(n: Long): Boolean = n > 0 && (n and (n - 1L)) == 0L
    fun nextPowerOfTwo(n: Int): Int {
        var res = n - 1
        res = res or (res ushr 1)
        res = res or (res ushr 2)
        res = res or (res ushr 4)
        res = res or (res ushr 8)
        res = res or (res ushr 16)
        return res + 1
    }
    fun factorialDouble(n: Int): Double {
        var res = 1.0
        for (i in 2..n) res *= i.toDouble()
        return res
    }
    fun permutation(n: Int, k: Int): Long = if (k < 0 || k > n) 0L else factorial(n) / factorial(n - k)
    fun combination(n: Int, k: Int): Long = if (k < 0 || k > n) 0L else factorial(n) / (factorial(k) * factorial(n - k))
    fun fibonacci(n: Int): Long {
        if (n <= 0) return 0L
        if (n == 1) return 1L
        var a = 0L
        var b = 1L
        for (i in 2..n) {
            val temp = a + b
            a = b
            b = temp
        }
        return b
    }

    // 121-128: Statistics & Averages
    fun average(a: Double, b: Double): Double = (a + b) / 2.0
    fun average(a: Float, b: Float): Float = (a + b) / 2f
    fun average(a: Int, b: Int): Double = (a.toDouble() + b.toDouble()) / 2.0
    fun weightedAverage(a: Double, b: Double, weightA: Double): Double = a * weightA + b * (1.0 - weightA)
    fun geometricMean(a: Double, b: Double): Double = java.lang.Math.sqrt(a * b)
    fun harmonicMean(a: Double, b: Double): Double = if (a + b == 0.0) 0.0 else (2.0 * a * b) / (a + b)
    fun pythagoras(a: Double, b: Double): Double = java.lang.Math.sqrt(a * a + b * b)
    fun hypotenuse3D(x: Double, y: Double, z: Double): Double = java.lang.Math.sqrt(x * x + y * y + z * z)

    // 129-136: Distance & Vector Math
    fun distanceSquared(x1: Double, y1: Double, x2: Double, y2: Double): Double = square(x2 - x1) + square(y2 - y1)
    fun distance(x1: Double, y1: Double, x2: Double, y2: Double): Double = java.lang.Math.sqrt(distanceSquared(x1, y1, x2, y2))
    fun distance3DSquared(x1: Double, y1: Double, z1: Double, x2: Double, y2: Double, z2: Double): Double = square(x2 - x1) + square(y2 - y1) + square(z2 - z1)
    fun distance3D(x1: Double, y1: Double, z1: Double, x2: Double, y2: Double, z2: Double): Double = java.lang.Math.sqrt(distance3DSquared(x1, y1, z1, x2, y2, z2))
    fun manhattanDistance(x1: Double, y1: Double, x2: Double, y2: Double): Double = abs(x2 - x1) + abs(y2 - y1)
    fun chebyshevDistance(x1: Double, y1: Double, x2: Double, y2: Double): Double = max(abs(x2 - x1), abs(y2 - y1))
    fun dotProduct(x1: Double, y1: Double, x2: Double, y2: Double): Double = x1 * x2 + y1 * y2
    fun crossProduct2D(x1: Double, y1: Double, x2: Double, y2: Double): Double = x1 * y2 - y1 * x2

    // 137-144: Angles & Neural / Activation Functions
    fun normalizeAngle(angleRad: Double): Double {
        val mod = IEEEremainder(angleRad, 2.0 * java.lang.Math.PI)
        return if (mod < 0) mod + 2.0 * java.lang.Math.PI else mod
    }
    fun angleDifference(angle1Rad: Double, angle2Rad: Double): Double {
        val diff = normalizeAngle(angle2Rad - angle1Rad)
        return if (diff > java.lang.Math.PI) diff - 2.0 * java.lang.Math.PI else diff
    }
    fun logistic(x: Double): Double = 1.0 / (1.0 + java.lang.Math.exp(-x))
    fun relu(x: Double): Double = if (x > 0.0) x else 0.0
    fun relu(x: Float): Float = if (x > 0f) x else 0f
    fun leakyRelu(x: Double, alpha: Double = 0.01): Double = if (x > 0.0) x else x * alpha
    fun softplus(x: Double): Double = java.lang.Math.log(1.0 + java.lang.Math.exp(x))
    fun swish(x: Double): Double = x * logistic(x)
}
