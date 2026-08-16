package com.example

import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale
import kotlin.math.*

data class TerminalLine(
  val id: Long = System.currentTimeMillis() + (0..1000).random(),
  val input: String? = null,
  val output: String? = null,
  val isError: Boolean = false,
  val isSystem: Boolean = false
)

data class UserFunction(
  val name: String,
  val params: List<String>,
  val bodyExpr: String
)

class PythonTerminalEngine {

  val variables = mutableMapOf<String, Double>(
    "pi" to Math.PI,
    "e" to Math.E,
    "tau" to Math.PI * 2.0
  )

  val functions = mutableMapOf<String, UserFunction>()

  private val numberFormatter = DecimalFormat("0.########", DecimalFormatSymbols(Locale.US))

  fun execute(command: String): TerminalLine {
    val trimmed = command.trim()
    if (trimmed.isEmpty()) return TerminalLine(input = command, output = null)

    when (trimmed.lowercase()) {
      "help", "?" -> return TerminalLine(input = command, output = getHelpText(), isSystem = true)
      "vars", "locals()" -> return TerminalLine(input = command, output = getVarsText(), isSystem = true)
      "funcs" -> return TerminalLine(input = command, output = getFuncsText(), isSystem = true)
      "reset" -> {
        variables.clear()
        variables["pi"] = Math.PI
        variables["e"] = Math.E
        variables["tau"] = Math.PI * 2.0
        functions.clear()
        return TerminalLine(input = command, output = "Environment reset (variables & functions cleared).", isSystem = true)
      }
    }

    if (trimmed.startsWith("def ")) return handleFunctionDefinition(command, trimmed)

    if (trimmed.contains("=") && !trimmed.contains("==") && !trimmed.contains("!=") && !trimmed.contains("<=") && !trimmed.contains(">=")) {
      return handleVariableAssignment(command, trimmed)
    }

    return try {
      val result = evaluateExpr(trimmed)
      variables["_"] = result
      TerminalLine(input = command, output = formatValue(result), isError = false)
    } catch (e: Exception) {
      TerminalLine(input = command, output = "SyntaxError: ${e.message ?: "Invalid expression"}", isError = true)
    }
  }

  private fun getHelpText(): String = """
    Python Math Shell:
    • Variables:  x = 10,  r = 5.5,  area = pi * r**2
    • Functions:  def square(x): return x * x
                  def hypot(a, b): return sqrt(a**2 + b**2)
    • Arithmetic: +, -, *, /, //, %, **, abs, round, floor, ceil, fact, gcd, lcm, min, max, sum
    • Logarithms: ln, log, log10, log2, exp, sqrt, cbrt
    • Trig:       sin, cos, tan, asin, acos, atan, rad, deg
    • Constants:  pi, e, tau
    • Commands:   vars, funcs, clear, reset, export
  """.trimIndent()

  private fun getVarsText(): String {
    if (variables.isEmpty()) return "No variables defined."
    val sb = StringBuilder("Defined Variables:\n")
    variables.toSortedMap().forEach { (k, v) -> sb.append("  $k = ${formatValue(v)}\n") }
    return sb.toString().trimEnd()
  }

  private fun getFuncsText(): String {
    if (functions.isEmpty()) return "No custom functions defined.\nExample: def f(x): return x**2"
    val sb = StringBuilder("Defined Functions:\n")
    functions.toSortedMap().forEach { (name, fn) ->
      sb.append("  def $name(${fn.params.joinToString(", ")}): return ${fn.bodyExpr}\n")
    }
    return sb.toString().trimEnd()
  }

  private fun handleFunctionDefinition(rawCommand: String, trimmed: String): TerminalLine {
    try {
      val defContent = trimmed.removePrefix("def").trim()
      val colonIdx = defContent.indexOf(':')
      if (colonIdx == -1) return TerminalLine(input = rawCommand, output = "SyntaxError: Expected ':' in function definition", isError = true)

      val header = defContent.substring(0, colonIdx).trim()
      var body = defContent.substring(colonIdx + 1).trim()
      if (body.startsWith("return ")) body = body.removePrefix("return").trim()
      if (body.isEmpty()) return TerminalLine(input = rawCommand, output = "SyntaxError: Function body cannot be empty", isError = true)

      val parenOpen = header.indexOf('(')
      val parenClose = header.lastIndexOf(')')
      if (parenOpen == -1 || parenClose == -1 || parenClose < parenOpen) {
        return TerminalLine(input = rawCommand, output = "SyntaxError: Invalid header 'def name(params):'", isError = true)
      }

      val funcName = header.substring(0, parenOpen).trim()
      if (!funcName.matches(Regex("^[a-zA-Z_][a-zA-Z0-9_]*$"))) {
        return TerminalLine(input = rawCommand, output = "SyntaxError: Invalid function name '$funcName'", isError = true)
      }

      val paramsStr = header.substring(parenOpen + 1, parenClose).trim()
      val params = if (paramsStr.isEmpty()) emptyList() else paramsStr.split(",").map { it.trim() }

      for (p in params) {
        if (!p.matches(Regex("^[a-zA-Z_][a-zA-Z0-9_]*$"))) {
          return TerminalLine(input = rawCommand, output = "SyntaxError: Invalid parameter name '$p'", isError = true)
        }
      }

      functions[funcName] = UserFunction(name = funcName, params = params, bodyExpr = body)
      return TerminalLine(
        input = rawCommand,
        output = "Defined function '$funcName(${params.joinToString(", ")})'",
        isSystem = true
      )
    } catch (e: Exception) {
      return TerminalLine(input = rawCommand, output = "SyntaxError: ${e.message ?: "Invalid function definition"}", isError = true)
    }
  }

  private fun handleVariableAssignment(rawCommand: String, trimmed: String): TerminalLine {
    val eqIdx = trimmed.indexOf('=')
    val varName = trimmed.substring(0, eqIdx).trim()
    val expr = trimmed.substring(eqIdx + 1).trim()

    if (!varName.matches(Regex("^[a-zA-Z_][a-zA-Z0-9_]*$"))) {
      return TerminalLine(input = rawCommand, output = "SyntaxError: Invalid variable name '$varName'", isError = true)
    }

    return try {
      val value = evaluateExpr(expr)
      variables[varName] = value
      TerminalLine(input = rawCommand, output = "$varName = ${formatValue(value)}", isError = false)
    } catch (e: Exception) {
      TerminalLine(input = rawCommand, output = "SyntaxError: ${e.message ?: "Invalid expression"}", isError = true)
    }
  }

  fun evaluateExpr(expr: String, localVars: Map<String, Double> = emptyMap()): Double {
    val tokens = tokenize(expr)
    val parser = Parser(tokens, localVars, variables, functions)
    val result = parser.parseExpression()
    if (!parser.isDone()) throw IllegalArgumentException("Unexpected token after expression")
    return result
  }

  private fun tokenize(expr: String): List<String> {
    val tokens = mutableListOf<String>()
    var i = 0
    val len = expr.length
    while (i < len) {
      val c = expr[i]
      if (c.isWhitespace()) { i++; continue }

      if (i + 1 < len) {
        val two = expr.substring(i, i + 2)
        if (two in listOf("**", "//", "==", "!=", "<=", ">=")) {
          tokens.add(two); i += 2; continue
        }
      }

      if (c in "+-*/%()^,<>") { tokens.add(c.toString()); i++; continue }

      if (c.isDigit() || (c == '.' && i + 1 < len && expr[i + 1].isDigit())) {
        var num = ""
        while (i < len && (expr[i].isDigit() || expr[i] == '.' || expr[i] == 'e' || expr[i] == 'E')) {
          if ((expr[i] == 'e' || expr[i] == 'E') && i + 1 < len && (expr[i + 1] == '+' || expr[i + 1] == '-')) {
            num += expr[i]; num += expr[i + 1]; i += 2; continue
          }
          num += expr[i]; i++
        }
        tokens.add(num); continue
      }

      if (c.isLetter() || c == '_') {
        var id = ""
        while (i < len && (expr[i].isLetterOrDigit() || expr[i] == '_')) {
          id += expr[i]; i++
        }
        tokens.add(id); continue
      }

      throw IllegalArgumentException("Unexpected character: '$c'")
    }
    return tokens
  }

  private fun formatValue(v: Double): String {
    if (v.isNaN()) return "NaN"
    if (v.isInfinite()) return if (v > 0) "inf" else "-inf"
    if (v == floor(v) && abs(v) < 1e15) return v.toLong().toString()
    return numberFormatter.format(v)
  }

  private inner class Parser(
    private val tokens: List<String>,
    private val localVars: Map<String, Double>,
    private val globalVars: Map<String, Double>,
    private val userFuncs: Map<String, UserFunction>
  ) {
    private var pos = 0
    fun isDone(): Boolean = pos >= tokens.size
    private fun peek(): String? = if (pos < tokens.size) tokens[pos] else null
    private fun consume(): String = tokens[pos++]
    private fun match(expected: String): Boolean {
      if (peek() == expected) { pos++; return true }
      return false
    }

    fun parseExpression(): Double {
      var left = parseAdditive()
      while (pos < tokens.size) {
        val op = peek() ?: break
        if (op in listOf("==", "!=", "<", ">", "<=", ">=")) {
          consume()
          val right = parseAdditive()
          left = when (op) {
            "==" -> if (abs(left - right) < 1e-12) 1.0 else 0.0
            "!=" -> if (abs(left - right) >= 1e-12) 1.0 else 0.0
            "<" -> if (left < right) 1.0 else 0.0
            ">" -> if (left > right) 1.0 else 0.0
            "<=" -> if (left <= right) 1.0 else 0.0
            ">=" -> if (left >= right) 1.0 else 0.0
            else -> left
          }
        } else break
      }
      return left
    }

    private fun parseAdditive(): Double {
      var left = parseMultiplicative()
      while (pos < tokens.size) {
        val op = peek() ?: break
        if (op == "+" || op == "-") {
          consume()
          val right = parseMultiplicative()
          left = if (op == "+") left + right else left - right
        } else break
      }
      return left
    }

    private fun parseMultiplicative(): Double {
      var left = parsePower()
      while (pos < tokens.size) {
        val op = peek() ?: break
        if (op in listOf("*", "/", "//", "%")) {
          consume()
          val right = parsePower()
          left = when (op) {
            "*" -> left * right
            "/" -> {
              if (right == 0.0) throw ArithmeticException("ZeroDivisionError: division by zero")
              left / right
            }
            "//" -> {
              if (right == 0.0) throw ArithmeticException("ZeroDivisionError: integer division by zero")
              floor(left / right)
            }
            "%" -> {
              if (right == 0.0) throw ArithmeticException("ZeroDivisionError: modulo by zero")
              val mod = left % right
              if ((mod > 0 && right < 0) || (mod < 0 && right > 0)) mod + right else mod
            }
            else -> left
          }
        } else break
      }
      return left
    }

    private fun parsePower(): Double {
      val base = parseUnary()
      if (peek() == "**" || peek() == "^") {
        consume()
        val exp = parsePower()
        return base.pow(exp)
      }
      return base
    }

    private fun parseUnary(): Double {
      if (match("+")) return parseUnary()
      if (match("-")) return -parseUnary()
      return parsePrimary()
    }

    private fun parsePrimary(): Double {
      val token = peek() ?: throw IllegalArgumentException("Unexpected end of expression")
      if (match("(")) {
        val expr = parseExpression()
        if (!match(")")) throw IllegalArgumentException("Missing closing ')'")
        return expr
      }
      val num = token.toDoubleOrNull()
      if (num != null) { consume(); return num }

      val id = consume()
      if (peek() == "(") {
        consume()
        val args = mutableListOf<Double>()
        if (peek() != ")") {
          args.add(parseExpression())
          while (match(",")) args.add(parseExpression())
        }
        if (!match(")")) throw IllegalArgumentException("Missing closing ')' for function '$id'")
        return evaluateCall(id, args)
      }

      localVars[id]?.let { return it }
      globalVars[id]?.let { return it }
      throw IllegalArgumentException("NameError: name '$id' is not defined")
    }

    private fun evaluateCall(name: String, args: List<Double>): Double {
      when (name.lowercase()) {
        "abs" -> { checkArgs(name, args, 1); return abs(args[0]) }
        "round" -> {
          return if (args.size == 1) round(args[0])
          else {
            val factor = 10.0.pow(args[1].toInt())
            round(args[0] * factor) / factor
          }
        }
        "floor" -> { checkArgs(name, args, 1); return floor(args[0]) }
        "ceil" -> { checkArgs(name, args, 1); return ceil(args[0]) }
        "fact", "factorial" -> {
          checkArgs(name, args, 1)
          val n = args[0].toInt()
          if (n < 0) throw IllegalArgumentException("ValueError: factorial() not defined for negative values")
          var res = 1.0
          for (k in 2..n) res *= k
          return res
        }
        "pow" -> { checkArgs(name, args, 2); return args[0].pow(args[1]) }
        "min" -> { if (args.isEmpty()) throw IllegalArgumentException("min() expected at least 1 argument"); return args.minOrNull() ?: 0.0 }
        "max" -> { if (args.isEmpty()) throw IllegalArgumentException("max() expected at least 1 argument"); return args.maxOrNull() ?: 0.0 }
        "sum" -> return args.sum()
        "gcd" -> {
          checkArgs(name, args, 2)
          var a = abs(args[0].toLong())
          var b = abs(args[1].toLong())
          while (b != 0L) { val t = b; b = a % b; a = t }
          return a.toDouble()
        }
        "lcm" -> {
          checkArgs(name, args, 2)
          val a = abs(args[0].toLong())
          val b = abs(args[1].toLong())
          if (a == 0L || b == 0L) return 0.0
          var x = a; var y = b
          while (y != 0L) { val t = y; y = x % y; x = t }
          return ((a / x) * b).toDouble()
        }

        // Logarithms & Roots
        "sqrt" -> {
          checkArgs(name, args, 1)
          if (args[0] < 0) throw IllegalArgumentException("ValueError: math domain error: sqrt of negative number")
          return sqrt(args[0])
        }
        "cbrt" -> { checkArgs(name, args, 1); return cbrt(args[0]) }
        "exp" -> { checkArgs(name, args, 1); return exp(args[0]) }
        "log", "ln" -> {
          if (args.isEmpty() || args.size > 2) throw IllegalArgumentException("TypeError: log takes 1 or 2 arguments")
          if (args[0] <= 0) throw IllegalArgumentException("ValueError: math domain error: log of non-positive")
          return if (args.size == 1) ln(args[0]) else ln(args[0]) / ln(args[1])
        }
        "log10" -> {
          checkArgs(name, args, 1)
          if (args[0] <= 0) throw IllegalArgumentException("ValueError: math domain error: log10 of non-positive")
          return log10(args[0])
        }
        "log2" -> {
          checkArgs(name, args, 1)
          if (args[0] <= 0) throw IllegalArgumentException("ValueError: math domain error: log2 of non-positive")
          return ln(args[0]) / ln(2.0)
        }

        // Trigonometry
        "sin" -> { checkArgs(name, args, 1); return sin(args[0]) }
        "cos" -> { checkArgs(name, args, 1); return cos(args[0]) }
        "tan" -> { checkArgs(name, args, 1); return tan(args[0]) }
        "asin" -> { checkArgs(name, args, 1); return asin(args[0]) }
        "acos" -> { checkArgs(name, args, 1); return acos(args[0]) }
        "atan" -> { checkArgs(name, args, 1); return atan(args[0]) }
        "atan2" -> { checkArgs(name, args, 2); return atan2(args[0], args[1]) }
        "rad", "radians" -> { checkArgs(name, args, 1); return Math.toRadians(args[0]) }
        "deg", "degrees" -> { checkArgs(name, args, 1); return Math.toDegrees(args[0]) }
      }

      val userFn = userFuncs[name]
      if (userFn != null) {
        if (args.size != userFn.params.size) {
          throw IllegalArgumentException("TypeError: ${userFn.name}() takes ${userFn.params.size} arguments (${args.size} given)")
        }
        val callScope = mutableMapOf<String, Double>()
        callScope.putAll(globalVars)
        for (idx in userFn.params.indices) callScope[userFn.params[idx]] = args[idx]
        return evaluateExpr(userFn.bodyExpr, callScope)
      }
      throw IllegalArgumentException("NameError: name '$name' is not defined")
    }

    private fun checkArgs(name: String, args: List<Double>, expected: Int) {
      if (args.size != expected) throw IllegalArgumentException("TypeError: $name() takes $expected argument(s) (${args.size} given)")
    }
  }
}
