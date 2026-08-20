object CustomMath {
    private const val PI = 3.141592653589793
    private const val E = 2.718281828459045

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

    // 23-30: Trigonometry Standard (using Taylor/Maclaurin series approximations)
    fun sqrt(x: Double): Double {
        if (x < 0.0) return Double.NaN
        if (x == 0.0 || x == 1.0) return x
        var guess = x / 2.0
        repeat(20) {
            guess = (guess + x / guess) / 2.0
        }
        return guess
    }
    
    fun sin(x: Double): Double {
        var angle = x % (2.0 * PI)
        if (angle > PI) angle -= 2.0 * PI
        if (angle < -PI) angle += 2.0 * PI
        var term = angle
        var sum = angle
        var n = 1
        while (abs(term) > 1e-15) {
            term *= -angle * angle / ((2 * n) * (2 * n + 1))
            sum += term
            n++
        }
        return sum
    }

    fun cos(x: Double): Double {
        var angle = x % (2.0 * PI)
        if (angle > PI) angle -= 2.0 * PI
        if (angle < -PI) angle += 2.0 * PI
        var term = 1.0
        var sum = 1.0
        var n = 1
        while (abs(term) > 1e-15) {
            term *= -angle * angle / ((2 * n - 1) * (2 * n))
            sum += term
            n++
        }
        return sum
    }

    fun tan(x: Double): Double = sin(x) / cos(x)
    
    fun asin(x: Double): Double {
        if (x < -1.0 || x > 1.0) return Double.NaN
        var sum = x
        var term = x
        var n = 1
        while (abs(term) > 1e-15) {
            term *= x * x * (2 * n - 1) * (2 * n - 1) / ((2 * n) * (2 * n + 1))
            sum += term
            n++
        }
        return sum
    }

    fun acos(x: Double): Double = (PI / 2.0) - asin(x)
    
    fun atan(x: Double): Double {
        if (x > 1.0) return (PI / 2.0) - atan(1.0 / x)
        if (x < -1.0) return -(PI / 2.0) - atan(1.0 / x)
        var sum = x
        var term = x
        var n = 1
        while (abs(term) > 1e-15) {
            term *= -x * x * (2 * n - 1) / (2 * n + 1)
            sum += term
            n++
        }
        return sum
    }

    fun atan2(y: Double, x: Double): Double {
        if (x > 0.0) return atan(y / x)
        if (x < 0.0 && y >= 0.0) return atan(y / x) + PI
        if (x < 0.0 && y < 0.0) return atan(y / x) - PI
        if (x == 0.0 && y > 0.0) return PI / 2.0
        if (x == 0.0 && y < 0.0) return -PI / 2.0
        return 0.0
    }

    // 31-38: Exponential & Logarithmic
    fun exp(x: Double): Double {
        var sum = 1.0
        var term = 1.0
        var n = 1
        while (abs(term) > 1e-15) {
            term *= x / n
            sum += term
            n++
            if (n > 200) break
        }
        return sum
    }

    fun expm1(x: Double): Double = exp(x) - 1.0

    fun ln(x: Double): Double {
        if (x <= 0.0) return Double.NaN
        var z = (x - 1.0) / (x + 1.0)
        var sum = z
        var term = z
        var zSq = z * z
        var k = 3
        while (abs(term) > 1e-15) {
            term *= zSq * (k - 2) / k
            sum += term
            k += 2
        }
        return 2.0 * sum
    }

    fun ln1p(x: Double): Double = ln(1.0 + x)
    fun log10(x: Double): Double = ln(x) / ln(10.0)
    fun log2(x: Double): Double = ln(x) / ln(2.0)
    fun log(x: Double, base: Double): Double = ln(x) / ln(base)
    
    fun pow(base: Double, exponent: Double): Double {
        if (exponent == 0.0) return 1.0
        if (base == 0.0) return 0.0
        return exp(exponent * ln(base))
    }

    // 39-46: Hypotenuse, Rounding, Powers
    fun hypot(x: Double, y: Double): Double = sqrt(x * x + y * y)
    
    fun ceil(x: Double): Double {
        val intPart = x.toLong()
        return if (x > intPart.toDouble()) (intPart + 1).toDouble() else intPart.toDouble()
    }

    fun floor(x: Double): Double {
        val intPart = x.toLong()
        return if (x < intPart.toDouble() && x != intPart.toDouble()) (intPart - 1).toDouble() else intPart.toDouble()
    }

    fun round(x: Double): Double = floor(x + 0.5)
    fun truncate(x: Double): Double = if (x < 0) ceil(x) else floor(x)
    fun roundToInt(x: Double): Int = round(x).toInt()
    fun roundToLong(x: Double): Long = round(x).toLong()
    
    fun cbrt(x: Double): Double {
        if (x == 0.0) return 0.0
        var guess = x / 3.0
        repeat(30) {
            guess = (2.0 * guess + x / (guess * guess)) / 3.0
        }
        return guess
    }

    // 47-58: Hyperbolic Functions
    fun sinh(x: Double): Double = (exp(x) - exp(-x)) / 2.0
    fun cosh(x: Double): Double = (exp(x) + exp(-x)) / 2.0
    fun tanh(x: Double): Double = sinh(x) / cosh(x)
    fun asinh(x: Double): Double = ln(x + sqrt(x * x + 1.0))
    fun acosh(x: Double): Double = ln(x + sqrt(x * x - 1.0))
    fun atanh(x: Double): Double = 0.5 * ln((1.0 + x) / (1.0 - x))
    fun csch(x: Double): Double = 1.0 / sinh(x)
    fun sech(x: Double): Double = 1.0 / cosh(x)
    fun coth(x: Double): Double = cosh(x) / sinh(x)
    fun acsch(x: Double): Double = asinh(1.0 / x)
    fun asech(x: Double): Double = acosh(1.0 / x)
    fun acoth(x: Double): Double = atanh(1.0 / x)

    // 59-64: Sign & Bits
    fun sign(x: Double): Double = if (x > 0.0) 1.0 else if (x < 0.0) -1.0 else 0.0
    fun sign(x: Float): Float = if (x > 0f) 1f else if (x < 0f) -1f else 0f
    fun nextUp(x: Double): Double = x + 1e-15
    fun nextUp(x: Float): Float = x + 1e-7f
    fun nextDown(x: Double): Double = x - 1e-15
    fun nextDown(x: Float): Float = x - 1e-7f

    // 65-72: Precision & Misc float operations
    fun nextAfter(x: Double, direction: Double): Double = if (direction > x) nextUp(x) else if (direction < x) nextDown(x) else x
    fun nextAfter(x: Float, direction: Float): Float = if (direction > x) nextUp(x) else if (direction < x) nextDown(x) else x
    fun ulp(x: Double): Double = abs(x) * 1e-15
    fun ulp(x: Float): Float = abs(x) * 1e-7f
    fun IEEEremainder(dividend: Double, divisor: Double): Double = dividend - divisor * round(dividend / divisor)
    fun toRadians(deg: Double): Double = deg * (PI / 180.0)
    fun toDegrees(rad: Double): Double = rad * (180.0 / PI)
    fun copySign(magnitude: Double, sign: Double): Double = if ((sign < 0.0) != (magnitude < 0.0)) -magnitude else magnitude

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
    fun invSqrt(x: Double): Double = 1.0 / sqrt(x)
    fun invSqrt(x: Float): Float = (1.0f / sqrt(x.toDouble())).toFloat()
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
    fun geometricMean(a: Double, b: Double): Double = sqrt(a * b)
    fun harmonicMean(a: Double, b: Double): Double = if (a + b == 0.0) 0.0 else (2.0 * a * b) / (a + b)
    fun pythagoras(a: Double, b: Double): Double = sqrt(a * a + b * b)
    fun hypotenuse3D(x: Double, y: Double, z: Double): Double = sqrt(x * x + y * y + z * z)

    // 129-136: Distance & Vector Math
    fun distanceSquared(x1: Double, y1: Double, x2: Double, y2: Double): Double = square(x2 - x1) + square(y2 - y1)
    fun distance(x1: Double, y1: Double, x2: Double, y2: Double): Double = sqrt(distanceSquared(x1, y1, x2, y2))
    fun distance3DSquared(x1: Double, y1: Double, z1: Double, x2: Double, y2: Double, z2: Double): Double = square(x2 - x1) + square(y2 - y1) + square(z2 - z1)
    fun distance3D(x1: Double, y1: Double, z1: Double, x2: Double, y2: Double, z2: Double): Double = sqrt(distance3DSquared(x1, y1, z1, x2, y2, z2))
    fun manhattanDistance(x1: Double, y1: Double, x2: Double, y2: Double): Double = abs(x2 - x1) + abs(y2 - y1)
    fun chebyshevDistance(x1: Double, y1: Double, x2: Double, y2: Double): Double = max(abs(x2 - x1), abs(y2 - y1))
    fun dotProduct(x1: Double, y1: Double, x2: Double, y2: Double): Double = x1 * x2 + y1 * y2
    fun crossProduct2D(x1: Double, y1: Double, x2: Double, y2: Double): Double = x1 * y2 - y1 * x2

    // 137-144: Angles & Neural / Activation Functions
    fun normalizeAngle(angleRad: Double): Double {
        val mod = IEEEremainder(angleRad, 2.0 * PI)
        return if (mod < 0) mod + 2.0 * PI else mod
    }
    fun angleDifference(angle1Rad: Double, angle2Rad: Double): Double {
        val diff = normalizeAngle(angle2Rad - angle1Rad)
        return if (diff > PI) diff - 2.0 * PI else diff
    }
    fun logistic(x: Double): Double = 1.0 / (1.0 + exp(-x))
    fun relu(x: Double): Double = if (x > 0.0) x else 0.0
    fun relu(x: Float): Float = if (x > 0f) x else 0f
    fun leakyRelu(x: Double, alpha: Double = 0.01): Double = if (x > 0.0) x else x * alpha
    fun softplus(x: Double): Double = ln(1.0 + exp(x))
    fun swish(x: Double): Double = x * logistic(x)

    // 145-152: Additional Angle Conversions & Polygon Math
    fun turnsToRadians(turns: Double): Double = turns * 2.0 * PI
    fun radiansToTurns(rad: Double): Double = rad / (2.0 * PI)
    fun turnsToDegrees(turns: Double): Double = turns * 360.0
    fun degreesToTurns(deg: Double): Double = deg / 360.0
    fun regularPolygonInteriorAngle(sides: Int): Double = if (sides < 3) 0.0 else (sides - 2) * 180.0 / sides
    fun regularPolygonArea(sideLength: Double, sides: Int): Double = if (sides < 3) 0.0 else (sides * sideLength * sideLength) / (4.0 * tan(PI / sides))
    fun circleCircumference(radius: Double): Double = 2.0 * PI * radius
    fun circleArea(radius: Double): Double = PI * radius * radius

    // 153-160: Vector Normalization & Dot Utilities
    fun magnitude2D(x: Double, y: Double): Double = sqrt(x * x + y * y)
    fun magnitude3D(x: Double, y: Double, z: Double): Double = sqrt(x * x + y * y + z * z)
    fun dotProduct3D(x1: Double, y1: Double, z1: Double, x2: Double, y2: Double, z2: Double): Double = x1 * x2 + y1 * y2 + z1 * z2
    fun projectScalar(x: Double, y: Double, targetX: Double, targetY: Double): Double {
        val mag = magnitude2D(targetX, targetY)
        return if (mag == 0.0) 0.0 else dotProduct(x, y, targetX, targetY) / mag
    }
    fun reflectVector2D(vx: Double, vy: Double, nx: Double, ny: Double): DoubleArray {
        val dot = dotProduct(vx, vy, nx, ny)
        return doubleArrayOf(vx - 2.0 * dot * nx, vy - 2.0 * dot * ny)
    }
    fun wrapValue(value: Double, min: Double, max: Double): Double {
        val range = max - min
        if (range <= 0.0) return min
        val adjusted = (value - min) % range
        return if (adjusted < 0) adjusted + max else adjusted + min
    }
    fun wrapValue(value: Int, min: Int, max: Int): Int {
        val range = max - min + 1
        if (range <= 0) return min
        val adjusted = (value - min) % range
        return if (adjusted < 0) adjusted + max + 1 else adjusted + min
    }
    fun stepFunction(edge: Double, x: Double): Double = if (x >= edge) 1.0 else 0.0

    // 161-168: Matrix 2x2 Determinant, Trace, Inverse Determinant
    fun det2x2(a: Double, b: Double, c: Double, d: Double): Double = a * d - b * c
    fun trace2x2(a: Double, d: Double): Double = a + d
    fun discriminantQuadratic(a: Double, b: Double, c: Double): Double = b * b - 4.0 * a * c
    fun hasRealRootsQuadratic(a: Double, b: Double, c: Double): Boolean = discriminantQuadratic(a, b, c) >= 0.0
    fun solveQuadraticRoot1(a: Double, b: Double, c: Double): Double = (-b + sqrt(discriminantQuadratic(a, b, c))) / (2.0 * a)
    fun solveQuadraticRoot2(a: Double, b: Double, c: Double): Double = (-b - sqrt(discriminantQuadratic(a, b, c))) / (2.0 * a)
    fun arithmeticMean3(a: Double, b: Double, c: Double): Double = (a + b + c) / 3.0
    fun quadraticMean(a: Double, b: Double): Double = sqrt((a * a + b * b) / 2.0)

    // 169-176: Advanced Rounding & Truncation Checks
    fun isIntegerValued(x: Double): Double = if (x == floor(x)) 1.0 else 0.0
    fun isZero(x: Double, tolerance: Double = 1e-9): Boolean = abs(x) <= tolerance
    fun isNearlyEqual(a: Double, b: Double, tolerance: Double = 1e-9): Boolean = abs(a - b) <= tolerance
    fun signumInt(n: Int): Int = if (n > 0) 1 else if (n < 0) -1 else 0
    fun signumLong(n: Long): Long = if (n > 0L) 1L else if (n < 0L) -1L else 0L
    fun safeIncrement(n: Int, maxLimit: Int): Int = if (n >= maxLimit) maxLimit else n + 1
    fun safeDecrement(n: Int, minLimit: Int): Int = if (n <= minLimit) minLimit else n - 1
    fun repeatValue(t: Double, length: Double): Double = t - length * floor(t / length)

    // 177-184: Additional Special Functions & Numerical Helpers
    fun sinc(x: Double): Double = if (x == 0.0) 1.0 else sin(x) / x
    fun logSumExp(a: Double, b: Double): Double {
        val maxVal = max(a, b)
        return maxVal + ln(exp(a - maxVal) + exp(b - maxVal))
    }
    fun smoothDamp(current: Double, target: Double, currentVelocity: Double, smoothTime: Double, maxSpeed: Double, deltaTime: Double): Double {
        var st = max(0.0001, smoothTime)
        val omega = 2.0 / st
        val x = omega * deltaTime
        val expVal = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x)
        val change = current - target
        val temp = (currentVelocity + omega * change) * deltaTime
        var targetVal = target + (change + temp) * expVal
        if ((target - current > 0.0) == (targetVal > target)) {
            targetVal = target
        }
        return targetVal
    }
    fun pingPong(t: Double, length: Double): Double {
        val valMod = repeatValue(t, length * 2.0)
        return length - abs(valMod - length)
    }
    fun bezierQuadratic(p0: Double, p1: Double, p2: Double, t: Double): Double {
        val oneMinusT = 1.0 - t
        return oneMinusT * oneMinusT * p0 + 2.0 * oneMinusT * t * p1 + t * t * p2
    }
    fun bezierCubic(p0: Double, p1: Double, p2: Double, p3: Double, t: Double): Double {
        val oneMinusT = 1.0 - t
    }
    fun fastInvSqrt(x: Float): Float {
        var i = java.lang.Float.floatToIntBits(x)
        i = 0x5f3759df - (i ushr 1)
        var y = java.lang.Float.intBitsToFloat(i)
        y = y * (1.5f - 0.5f * x * y * y)
        return y
    }
    fun fractionalPart(x: Double): Double = x - truncate(x)

    // 185-192: Exponential Decay & Miscellaneous Math Utilities
    fun exponentialDecay(current: Double, target: Double, decayRate: Double, deltaTime: Double): Double =
        target + (current - target) * exp(-decayRate * deltaTime)
    fun powerOfThree(n: Int): Boolean {
        if (n <= 0) return false
        var temp = n
        while (temp % 3 == 0) temp /= 3
        return temp == 1
    }
    fun powerOfFour(n: Int): Boolean = n > 0 && (n and (n - 1)) == 0 && (n and 0x55555555) != 0
    fun countSetBits(n: Int): Int {
        var count = 0
        var v = n
        while (v != 0) {
            count += v and 1
            v = v ushr 1
        }
        return count
    }
    fun countSetBits(n: Long): Int {
        var count = 0
        var v = n
        while (v != 0L) {
            count += (v and 1L).toInt()
            v = v ushr 1
        }
        return count
    }
    fun bitLength(n: Int): Int = if (n == 0) 0 else 32 - Integer.numberOfLeadingZeros(abs(n))
    fun bitLength(n: Long): Long = if (n == 0L) 0L else 64L - java.lang.Long.numberOfLeadingZeros(abs(n))
    fun roundToNearestMultiple(value: Double, multiple: Double): Double = if (multiple == 0.0) value else round(value / multiple) * multiple

    // 193-200: Final Geometry & Rounding Helpers
    fun sphereVolume(radius: Double): Double = (4.0 / 3.0) * PI * radius * radius * radius
    fun sphereSurfaceArea(radius: Double): Double = 4.0 * PI * radius * radius
    fun cylinderVolume(radius: Double, height: Double): Double = PI * radius * radius * height
    fun coneVolume(radius: Double, height: Double): Double = (1.0 / 3.0) * PI * radius * radius * height
    fun pyramidVolume(baseArea: Double, height: Double): Double = (1.0 / 3.0) * baseArea * height
    fun boxVolume(width: Double, height: Double, depth: Double): Double = width * height * depth
    fun boxSurfaceArea(width: Double, height: Double, depth: Double): Double = 2.0 * (width * height + height * depth + depth * width)
    fun hypotenuse4D(x: Double, y: Double, z: Double, w: Double): Double = sqrt(x * x + y * y + z * z + w * w)

    // 201-208: Prime & Divisibility Checks
    fun isPrime(n: Long): Boolean {
        if (n <= 1L) return false
        if (n <= 3L) return true
        if (n % 2L == 0L || n % 3L == 0L) return false
        var i = 5L
        while (i * i <= n) {
            if (n % i == 0L || n % (i + 2L) == 0L) return false
            i += 6L
        }
        return true
    }
    fun isPrime(n: Int): Boolean = isPrime(n.toLong())
    fun nextPrime(n: Long): Long {
        var candidate = n + 1L
        while (!isPrime(candidate)) {
            candidate++
        }
        return candidate
    }
    fun sumOfDivisors(n: Long): Long {
        if (n <= 0L) return 0L
        var sum = 0L
        var i = 1L
        while (i * i <= n) {
            if (n % i == 0L) {
                sum += i
                val other = n / i
                if (other != i && other != n) {
                    sum += other
                }
            }
            i++
        }
        return sum + if (n > 1L) 1L else 0L
    }
    fun isPerfectNumber(n: Long): Boolean = n > 1L && sumOfDivisors(n) == n
    fun isAbundantNumber(n: Long): Boolean = n > 0L && sumOfDivisors(n) > n
    fun isDeficientNumber(n: Long): Boolean = n > 0L && sumOfDivisors(n) < n
    fun digitalRoot(n: Long): Int {
        var temp = abs(n)
        if (temp == 0L) return 0
        val mod = (temp % 9L).toInt()
        return if (mod == 0) 9 else mod
    }

    // 209-216: Matrix 3x3 Determinant & Transformations
    fun det3x2Placeholder(): Double = 0.0
    fun det3x3(a1: Double, a2: Double, a3: Double, b1: Double, b2: Double, b3: Double, c1: Double, c2: Double, c3: Double): Double =
        a1 * (b2 * c3 - b3 * c2) - a2 * (b1 * c3 - b3 * c1) + a3 * (b1 * c2 - b2 * c1)
    fun trace3x3(a1: Double, b2: Double, c3: Double): Double = a1 + b2 + c3
    fun vectorMagnitudeSquared2D(x: Double, y: Double): Double = x * x + y * y
    fun vectorMagnitudeSquared3D(x: Double, y: Double, z: Double): Double = x * x + y * y + z * z
    fun normalize2Dx(x: Double, y: Double): Double {
        val mag = magnitude2D(x, y)
        return if (mag == 0.0) 0.0 else x / mag
    }
    fun normalize2Dy(x: Double, y: Double): Double {
        val mag = magnitude2D(x, y)
        return if (mag == 0.0) 0.0 else y / mag
    }
    fun directionAngle2D(x: Double, y: Double): Double = atan2(y, x)

    // 217-224: Advanced Trigonometry & Versa Functions
    fun versine(x: Double): Double = 1.0 - cos(x)
    fun coversine(x: Double): Double = 1.0 - sin(x)
    fun haversine(x: Double): Double = (1.0 - cos(x)) / 2.0
    fun exsecant(x: Double): Double = sec(x) - 1.0
    fun sec(x: Double): Double = 1.0 / cos(x)
    fun csc(x: Double): Double = 1.0 / sin(x)
    fun asec(x: Double): Double = acos(1.0 / x)
    fun acsc(x: Double): Double = asin(1.0 / x)

    // 225-232: Combinatorial & Sequence Extractions
    fun stirlingS1(n: Int, k: Int): Long {
        if (n == 0 && k == 0) return 1L
        if (n == 0 || k == 0 || k > n) return 0L
        return (n - 1).toLong() * stirlingS1(n - 1, k) + stirlingS1(n - 1, k - 1)
    }
    fun stirlingS2(n: Int, k: Int): Long {
        if (n == 0 && k == 0) return 1L
        if (n == 0 || k == 0 || k > n) return 0L
        return k.toLong() * stirlingS2(n - 1, k) + stirlingS2(n - 1, k - 1)
    }
    fun catalanNumber(n: Int): Long = combination(2 * n, n) / (n + 1).toLong()
    fun triangularNumber(n: Long): Long = if (n <= 0L) 0L else (n * (n + 1L)) / 2L
    fun pentagonalNumber(n: Long): Long = if (n <= 0L) 0L else (n * (3L * n - 1L)) / 2L
    fun hexagonalNumber(n: Long): Long = if (n <= 0L) 0L else n * (2L * n - 1L)
    fun isSquare(n: Long): Boolean {
        if (n < 0L) return false
        val t = roundToLong(sqrt(n.toDouble()))
        return t * t == n
    }
    fun isCube(n: Long): Boolean {
        val t = roundToLong(cbrt(n.toDouble()))
        return cube(t) == n
    }

    // 233-240: Hyperbolic Inverse & Additional Soft Operations
    fun softsign(x: Double): Double = x / (1.0 + abs(x))
    fun softsign(x: Float): Float = x / (1.0f + abs(x))
    fun hardSigmoid(x: Double): Double = clamp(x * 0.2 + 0.5, 0.0, 1.0)
    fun hardSwish(x: Double): Double = x * clamp(x + 3.0, 0.0, 6.0) / 6.0
    fun elu(x: Double, alpha: Double = 1.0): Double = if (x > 0.0) x else alpha * (exp(x) - 1.0)
    fun selu(x: Double): Double {
        val alpha = 1.6732632423543772848170429916717
        val scale = 1.0507009873554804934193349852946
        return scale * if (x > 0.0) x else alpha * (exp(x) - 1.0)
    }
    fun logit(x: Double): Double = ln(x / (1.0 - x))
    fun expDecayRate(halfLife: Double): Double = if (halfLife <= 0.0) 0.0 else ln(2.0) / halfLife

    // 241-250: Final Utilities & Rounding Scales
    fun roundToDecimalPlaces(value: Double, places: Int): Double {
        val scale = pow(10.0, places.toDouble())
        return round(value * scale) / scale
    }
    fun floorToDecimalPlaces(value: Double, places: Int): Double {
        val scale = pow(10.0, places.toDouble())
        return floor(value * scale) / scale
    }
    fun ceilToDecimalPlaces(value: Double, places: Int): Double {
        val scale = pow(10.0, places.toDouble())
        return ceil(value * scale) / scale
    }
    fun isPowerOfTen(n: Long): Boolean {
        if (n <= 0L) return false
        var temp = n
        while (temp % 10L == 0L) temp /= 10L
        return temp == 1L
    }
    fun reverseDigits(n: Long): Long {
        var temp = abs(n)
        var rev = 0L
        while (temp > 0L) {
            rev = rev * 10L + temp % 10L
            temp /= 10L
        }
        return if (n < 0L) -rev else rev
    }
    fun sumOfDigits(n: Long): Int {
        var temp = abs(n)
        var sum = 0
        while (temp > 0L) {
            sum += (temp % 10L).toInt()
            temp /= 10L
        }
        return sum
    }
    fun signumFloat(n: Float): Float = if (n > 0f) 1f else if (n < 0f) -1f else 0f
    fun floatToRawIntBitsCustom(value: Float): Int = java.lang.Float.floatToRawIntBits(value)
    fun doubleToRawLongBitsCustom(value: Double): Long = java.lang.Double.doubleToRawLongBits(value)
    fun identityFunction(x: Double): Double = x
}
 
   
