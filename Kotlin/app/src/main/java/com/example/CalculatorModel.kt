package com.example

import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale
import kotlin.math.*

enum class AngleMode {
  DEG, RAD
}

data class CalculationHistory(
  val id: Long = System.currentTimeMillis(),
  val expression: String,
  val result: String,
  val timestamp: Long = System.currentTimeMillis()
)

data class CalculatorState(
  val expression: String = "",
  val currentNumber: String = "0",
  val previewResult: String? = null,
  val lastResult: String? = null,
  val isCalculated: Boolean = false,
  val errorMessage: String? = null,
  val history: List<CalculationHistory> = emptyList(),
  val isHistoryOpen: Boolean = false,
  val isExtraFunctionsOpen: Boolean = false,
  val isSecondMode: Boolean = false,
  val angleMode: AngleMode = AngleMode.DEG,
  val memory: BigDecimal = BigDecimal.ZERO,
  val hasMemory: Boolean = false
)

sealed interface CalculatorAction {
  data class Number(val digit: Int) : CalculatorAction
  data object Decimal : CalculatorAction
  data class Operator(val op: CalculatorOp) : CalculatorAction
  data class ScientificFunc(val func: ScientificFunction) : CalculatorAction
  data class Constant(val constVal: MathConstant) : CalculatorAction
  data object OpenParenthesis : CalculatorAction
  data object CloseParenthesis : CalculatorAction
  data object Equals : CalculatorAction
  data object Clear : CalculatorAction
  data object AllClear : CalculatorAction
  data object Backspace : CalculatorAction
  data object ToggleSign : CalculatorAction
  data object Percentage : CalculatorAction
  data object ToggleSecondMode : CalculatorAction
  data object ToggleAngleMode : CalculatorAction
  data object ToggleExtraFunctions : CalculatorAction
  data object MemoryClear : CalculatorAction
  data object MemoryRecall : CalculatorAction
  data object MemoryAdd : CalculatorAction
  data object MemorySubtract : CalculatorAction
  data class SelectHistory(val history: CalculationHistory) : CalculatorAction
  data object ToggleHistory : CalculatorAction
  data object ClearHistory : CalculatorAction
}

enum class CalculatorOp(val symbol: String, val precedence: Int) {
  ADD("+", 1),
  SUBTRACT("−", 1),
  MULTIPLY("×", 2),
  DIVIDE("÷", 2),
  POWER("^", 3);

  companion object {
    fun fromSymbol(sym: String): CalculatorOp? = entries.find { it.symbol == sym }
  }
}

enum class ScientificFunction(val symbol: String, val displayName: String) {
  SIN("sin", "sin"),
  COS("cos", "cos"),
  TAN("tan", "tan"),
  ASIN("asin", "sin⁻¹"),
  ACOS("acos", "cos⁻¹"),
  ATAN("atan", "tan⁻¹"),
  LN("ln", "ln"),
  LOG("log", "log"),
  EXP_N("exp", "eˣ"),
  TEN_POW("10^", "10ˣ"),
  SQRT("√", "√x"),
  CBRT("∛", "∛x"),
  SQUARE("sqr", "x²"),
  CUBE("cube", "x³"),
  INVERSE("inv", "1/x"),
  FACTORIAL("fact", "x!");

  companion object {
    fun fromSymbol(sym: String): ScientificFunction? = entries.find { it.symbol == sym }
  }
}

enum class MathConstant(val symbol: String, val value: Double) {
  PI("π", Math.PI),
  E("e", Math.E)
}

object CalculatorFormatter {
  private val symbols = DecimalFormatSymbols(Locale.US).apply {
    groupingSeparator = ','
    decimalSeparator = '.'
  }

  fun formatNumber(numberStr: String): String {
    if (numberStr.isEmpty() || numberStr == "-" || numberStr == ".") return numberStr

    val isNegative = numberStr.startsWith("-")
    val absStr = if (isNegative) numberStr.substring(1) else numberStr
    val parts = absStr.split(".")

    val integerPart = parts[0]
    val decimalPart = if (parts.size > 1) parts[1] else null
    val hasTrailingDot = numberStr.endsWith(".")

    val formattedInteger = try {
      if (integerPart.isEmpty()) "0"
      else {
        val bd = BigDecimal(integerPart)
        val formatter = DecimalFormat("#,##0", symbols)
        formatter.format(bd)
      }
    } catch (_: Exception) {
      integerPart
    }

    return buildString {
      if (isNegative) append("-")
      append(formattedInteger)
      if (hasTrailingDot) {
        append(".")
      } else if (decimalPart != null) {
        append(".")
        append(decimalPart)
      }
    }
  }

  fun formatBigDecimal(bd: BigDecimal): String {
    val stripped = bd.stripTrailingZeros()
    val plain = stripped.toPlainString()

    if (plain.length > 15 || plain.contains("E") || plain.contains("e")) {
      return DecimalFormat("0.######E0", symbols).format(bd)
    }

    return formatNumber(plain)
  }
}

object CalculatorEvaluator {
  private const val SCALE = 12

  fun evaluate(expression: String, angleMode: AngleMode = AngleMode.DEG): Result<BigDecimal> = runCatching {
    if (expression.isBlank()) throw IllegalArgumentException("Empty expression")

    val tokens = tokenize(expression)
    if (tokens.isEmpty()) throw IllegalArgumentException("No tokens")

    val output = mutableListOf<String>()
    val stack = mutableListOf<String>()

    for (token in tokens) {
      when {
        isNumber(token) -> output.add(token)
        token == "π" -> output.add(Math.PI.toString())
        token == "e" -> output.add(Math.E.toString())
        isFunction(token) -> stack.add(token)
        token == "(" -> stack.add(token)
        token == ")" -> {
          while (stack.isNotEmpty() && stack.last() != "(") {
            output.add(stack.removeAt(stack.size - 1))
          }
          if (stack.isEmpty()) throw IllegalArgumentException("Mismatched parentheses")
          stack.removeAt(stack.size - 1)
          if (stack.isNotEmpty() && isFunction(stack.last())) {
            output.add(stack.removeAt(stack.size - 1))
          }
        }
        else -> {
          val op = CalculatorOp.fromSymbol(token)
          if (op != null) {
            while (stack.isNotEmpty() && (isFunction(stack.last()) || hasHigherOrEqualPrecedence(stack.last(), op))) {
              output.add(stack.removeAt(stack.size - 1))
            }
            stack.add(token)
          }
        }
      }
    }

    while (stack.isNotEmpty()) {
      val top = stack.removeAt(stack.size - 1)
      if (top == "(" || top == ")") throw IllegalArgumentException("Mismatched parentheses")
      output.add(top)
    }

    val evalStack = mutableListOf<Double>()
    for (token in output) {
      when {
        isNumber(token) -> evalStack.add(token.toDouble())
        isFunction(token) -> {
          if (evalStack.isEmpty()) throw IllegalArgumentException("Invalid function argument")
          val arg = evalStack.removeAt(evalStack.size - 1)
          val result = evaluateFunction(token, arg, angleMode)
          evalStack.add(result)
        }
        else -> {
          val op = CalculatorOp.fromSymbol(token)
          if (op != null) {
            if (evalStack.size < 2) throw IllegalArgumentException("Invalid syntax")
            val b = evalStack.removeAt(evalStack.size - 1)
            val a = evalStack.removeAt(evalStack.size - 1)
            val res = when (op) {
              CalculatorOp.ADD -> a + b
              CalculatorOp.SUBTRACT -> a - b
              CalculatorOp.MULTIPLY -> a * b
              CalculatorOp.DIVIDE -> {
                if (b == 0.0) throw ArithmeticException("Cannot divide by 0")
                a / b
              }
              CalculatorOp.POWER -> a.pow(b)
            }
            evalStack.add(res)
          }
        }
      }
    }

    if (evalStack.size != 1) throw IllegalArgumentException("Evaluation error")
    val finalVal = evalStack.first()
    if (finalVal.isNaN()) throw ArithmeticException("Math error")
    if (finalVal.isInfinite()) throw ArithmeticException("Number overflow")

    BigDecimal.valueOf(finalVal).round(MathContext(SCALE, RoundingMode.HALF_UP)).stripTrailingZeros()
  }

  private fun hasHigherOrEqualPrecedence(topOpSymbol: String, incomingOp: CalculatorOp): Boolean {
    val topOp = CalculatorOp.fromSymbol(topOpSymbol) ?: return false
    return if (incomingOp == CalculatorOp.POWER) {
      topOp.precedence > incomingOp.precedence
    } else {
      topOp.precedence >= incomingOp.precedence
    }
  }

  private fun isNumber(token: String): Boolean = token.toDoubleOrNull() != null

  private fun isFunction(token: String): Boolean = ScientificFunction.fromSymbol(token) != null

  private fun evaluateFunction(funcSymbol: String, x: Double, angleMode: AngleMode): Double {
    val radians = if (angleMode == AngleMode.DEG) Math.toRadians(x) else x
    return when (funcSymbol) {
      "sin" -> sin(radians)
      "cos" -> cos(radians)
      "tan" -> {
        val cosVal = cos(radians)
        if (abs(cosVal) < 1e-15) throw ArithmeticException("Invalid tan argument")
        tan(radians)
      }
      "asin" -> {
        if (x < -1.0 || x > 1.0) throw ArithmeticException("Domain error")
        val rad = asin(x)
        if (angleMode == AngleMode.DEG) Math.toDegrees(rad) else rad
      }
      "acos" -> {
        if (x < -1.0 || x > 1.0) throw ArithmeticException("Domain error")
        val rad = acos(x)
        if (angleMode == AngleMode.DEG) Math.toDegrees(rad) else rad
      }
      "atan" -> {
        val rad = atan(x)
        if (angleMode == AngleMode.DEG) Math.toDegrees(rad) else rad
      }
      "ln" -> {
        if (x <= 0.0) throw ArithmeticException("Domain error")
        ln(x)
      }
      "log" -> {
        if (x <= 0.0) throw ArithmeticException("Domain error")
        log10(x)
      }
      "exp" -> exp(x)
      "10^" -> 10.0.pow(x)
      "√" -> {
        if (x < 0.0) throw ArithmeticException("Domain error")
        sqrt(x)
      }
      "∛" -> cbrt(x)
      "sqr" -> x * x
      "cube" -> x * x * x
      "inv" -> {
        if (x == 0.0) throw ArithmeticException("Cannot divide by 0")
        1.0 / x
      }
      "fact" -> {
        if (x < 0.0 || x != floor(x) || x > 170.0) throw ArithmeticException("Invalid factorial")
        factorial(x.toInt())
      }
      else -> throw IllegalArgumentException("Unknown function: $funcSymbol")
    }
  }

  private fun factorial(n: Int): Double {
    var res = 1.0
    for (i in 2..n) {
      res *= i
    }
    return res
  }

  private fun tokenize(expr: String): List<String> {
    val tokens = mutableListOf<String>()
    val parts = expr.trim().split("\\s+".toRegex())
    for (part in parts) {
      if (part.isNotEmpty()) {
        tokens.add(part)
      }
    }
    return tokens
  }
}
