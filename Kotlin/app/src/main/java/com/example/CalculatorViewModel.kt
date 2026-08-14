package com.example

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.math.BigDecimal
import java.math.RoundingMode

class CalculatorViewModel : ViewModel() {

  private val _state = MutableStateFlow(CalculatorState())
  val state: StateFlow<CalculatorState> = _state.asStateFlow()

  fun onAction(action: CalculatorAction) {
    when (action) {
      is CalculatorAction.Number -> handleNumber(action.digit)
      is CalculatorAction.Decimal -> handleDecimal()
      is CalculatorAction.Operator -> handleOperator(action.op)
      is CalculatorAction.ScientificFunc -> handleScientificFunc(action.func)
      is CalculatorAction.Constant -> handleConstant(action.constVal)
      is CalculatorAction.OpenParenthesis -> handleOpenParenthesis()
      is CalculatorAction.CloseParenthesis -> handleCloseParenthesis()
      is CalculatorAction.Equals -> handleEquals()
      is CalculatorAction.Clear -> handleClear()
      is CalculatorAction.AllClear -> handleAllClear()
      is CalculatorAction.Backspace -> handleBackspace()
      is CalculatorAction.ToggleSign -> handleToggleSign()
      is CalculatorAction.Percentage -> handlePercentage()
      is CalculatorAction.ToggleSecondMode -> _state.update { it.copy(isSecondMode = !it.isSecondMode) }
      is CalculatorAction.ToggleAngleMode -> _state.update {
        val newMode = if (it.angleMode == AngleMode.DEG) AngleMode.RAD else AngleMode.DEG
        val updated = it.copy(angleMode = newMode)
        updated.copy(previewResult = computePreview(updated))
      }
      is CalculatorAction.ToggleExtraFunctions -> _state.update { it.copy(isExtraFunctionsOpen = !it.isExtraFunctionsOpen) }
      is CalculatorAction.MemoryClear -> _state.update { it.copy(memory = BigDecimal.ZERO, hasMemory = false) }
      is CalculatorAction.MemoryRecall -> handleMemoryRecall()
      is CalculatorAction.MemoryAdd -> handleMemoryModify(add = true)
      is CalculatorAction.MemorySubtract -> handleMemoryModify(add = false)
      is CalculatorAction.SelectHistory -> handleSelectHistory(action.history)
      is CalculatorAction.ToggleHistory -> _state.update { it.copy(isHistoryOpen = !it.isHistoryOpen) }
      is CalculatorAction.ClearHistory -> _state.update { it.copy(history = emptyList()) }
    }
  }

  private fun handleNumber(digit: Int) {
    _state.update { current ->
      if (current.isCalculated) {
        val newNumber = digit.toString()
        current.copy(
          expression = "",
          currentNumber = newNumber,
          previewResult = null,
          isCalculated = false,
          errorMessage = null
        )
      } else {
        val currentNum = if (current.currentNumber == "0") "" else current.currentNumber
        if (currentNum.length >= 15) return@update current
        val newNumber = currentNum + digit.toString()
        val updatedState = current.copy(
          currentNumber = newNumber,
          errorMessage = null
        )
        updatedState.copy(previewResult = computePreview(updatedState))
      }
    }
  }

  private fun handleDecimal() {
    _state.update { current ->
      if (current.isCalculated) {
        current.copy(
          expression = "",
          currentNumber = "0.",
          previewResult = null,
          isCalculated = false,
          errorMessage = null
        )
      } else if (!current.currentNumber.contains(".")) {
        val newNumber = if (current.currentNumber.isEmpty()) "0." else current.currentNumber + "."
        current.copy(
          currentNumber = newNumber,
          errorMessage = null
        )
      } else {
        current
      }
    }
  }

  private fun handleOperator(op: CalculatorOp) {
    _state.update { current ->
      if (current.errorMessage != null) {
        return@update current
      }

      val newExpression: String
      if (current.isCalculated && current.lastResult != null) {
        newExpression = "${current.lastResult} ${op.symbol}"
      } else if (current.currentNumber.isNotEmpty() && current.currentNumber != "-") {
        newExpression = if (current.expression.isEmpty()) {
          "${current.currentNumber} ${op.symbol}"
        } else {
          "${current.expression} ${current.currentNumber} ${op.symbol}"
        }
      } else if (current.expression.isNotEmpty()) {
        val trimmed = current.expression.trimEnd()
        val parts = trimmed.split(" ")
        if (parts.isNotEmpty() && CalculatorOp.fromSymbol(parts.last()) != null) {
          val base = parts.dropLast(1).joinToString(" ")
          newExpression = if (base.isEmpty()) "" else "$base ${op.symbol}"
        } else {
          newExpression = "${current.expression} ${op.symbol}"
        }
      } else {
        newExpression = "0 ${op.symbol}"
      }

      val updated = current.copy(
        expression = newExpression,
        currentNumber = "",
        isCalculated = false,
        errorMessage = null
      )
      updated.copy(previewResult = computePreview(updated))
    }
  }

  private fun handleScientificFunc(func: ScientificFunction) {
    _state.update { current ->
      val effectiveFunc = if (current.isSecondMode) {
        when (func) {
          ScientificFunction.SIN -> ScientificFunction.ASIN
          ScientificFunction.COS -> ScientificFunction.ACOS
          ScientificFunction.TAN -> ScientificFunction.ATAN
          ScientificFunction.LN -> ScientificFunction.EXP_N
          ScientificFunction.LOG -> ScientificFunction.TEN_POW
          ScientificFunction.SQRT -> ScientificFunction.SQUARE
          ScientificFunction.CBRT -> ScientificFunction.CUBE
          else -> func
        }
      } else {
        func
      }

      val isImmediateUnary = effectiveFunc in listOf(
        ScientificFunction.SQUARE,
        ScientificFunction.CUBE,
        ScientificFunction.INVERSE,
        ScientificFunction.FACTORIAL
      )

      if (isImmediateUnary) {
        val numStr = if (current.currentNumber.isNotEmpty()) current.currentNumber else current.lastResult ?: "0"
        val fullExpr = "${effectiveFunc.symbol} ( $numStr )"
        val eval = CalculatorEvaluator.evaluate(fullExpr, current.angleMode)
        eval.fold(
          onSuccess = { resBd ->
            val formatted = CalculatorFormatter.formatBigDecimal(resBd)
            val updated = current.copy(
              currentNumber = formatted,
              errorMessage = null
            )
            updated.copy(previewResult = computePreview(updated))
          },
          onFailure = { error ->
            current.copy(errorMessage = error.message ?: "Error")
          }
        )
      } else {
        val newExpr = if (current.expression.isEmpty()) {
          "${effectiveFunc.symbol} ("
        } else {
          "${current.expression} ${effectiveFunc.symbol} ("
        }
        val updated = current.copy(
          expression = newExpr,
          currentNumber = "",
          errorMessage = null
        )
        updated.copy(previewResult = computePreview(updated))
      }
    }
  }

  private fun handleConstant(constVal: MathConstant) {
    _state.update { current ->
      val updated = current.copy(
        currentNumber = constVal.symbol,
        isCalculated = false,
        errorMessage = null
      )
      updated.copy(previewResult = computePreview(updated))
    }
  }

  private fun handleOpenParenthesis() {
    _state.update { current ->
      val newExpr = if (current.expression.isEmpty()) {
        "("
      } else {
        "${current.expression} ("
      }
      val updated = current.copy(expression = newExpr, currentNumber = "", errorMessage = null)
      updated.copy(previewResult = computePreview(updated))
    }
  }

  private fun handleCloseParenthesis() {
    _state.update { current ->
      val newExpr = buildString {
        if (current.expression.isNotEmpty()) {
          append(current.expression.trim())
          if (current.currentNumber.isNotEmpty() && current.currentNumber != "-") {
            append(" ")
            append(current.currentNumber)
          }
          append(" )")
        }
      }.trim()

      val updated = current.copy(expression = newExpr, currentNumber = "", errorMessage = null)
      updated.copy(previewResult = computePreview(updated))
    }
  }

  private fun handleEquals() {
    _state.update { current ->
      if (current.expression.isEmpty() && current.currentNumber.isNotEmpty()) {
        return@update current
      }

      val fullExpression = buildString {
        if (current.expression.isNotEmpty()) {
          append(current.expression.trim())
          if (current.currentNumber.isNotEmpty() && current.currentNumber != "-") {
            append(" ")
            append(current.currentNumber)
          }
        }
      }.trim()

      if (fullExpression.isEmpty()) return@update current

      val openCount = fullExpression.count { it == '(' }
      val closeCount = fullExpression.count { it == ')' }
      val balancedExpression = if (openCount > closeCount) {
        fullExpression + " )".repeat(openCount - closeCount)
      } else {
        fullExpression
      }

      val evalResult = CalculatorEvaluator.evaluate(balancedExpression, current.angleMode)
      evalResult.fold(
        onSuccess = { resultBd ->
          val formattedResult = CalculatorFormatter.formatBigDecimal(resultBd)
          val plainResult = resultBd.toPlainString()
          val newHistory = CalculationHistory(
            expression = balancedExpression,
            result = formattedResult
          )
          current.copy(
            expression = balancedExpression,
            currentNumber = formattedResult,
            lastResult = plainResult,
            previewResult = null,
            isCalculated = true,
            errorMessage = null,
            history = listOf(newHistory) + current.history.take(29)
          )
        },
        onFailure = { error ->
          current.copy(
            errorMessage = error.message ?: "Error",
            previewResult = null,
            isCalculated = true
          )
        }
      )
    }
  }

  private fun handleClear() {
    _state.update { current ->
      if (current.currentNumber.isNotEmpty() && current.currentNumber != "0") {
        current.copy(currentNumber = "0", errorMessage = null)
      } else {
        current.copy(
          expression = "",
          currentNumber = "0",
          previewResult = null,
          lastResult = null,
          isCalculated = false,
          errorMessage = null
        )
      }
    }
  }

  private fun handleAllClear() {
    _state.update { current ->
      current.copy(
        expression = "",
        currentNumber = "0",
        previewResult = null,
        lastResult = null,
        isCalculated = false,
        errorMessage = null
      )
    }
  }

  private fun handleBackspace() {
    _state.update { current ->
      if (current.isCalculated || current.errorMessage != null) {
        return@update current.copy(
          expression = "",
          currentNumber = "0",
          previewResult = null,
          isCalculated = false,
          errorMessage = null
        )
      }

      if (current.currentNumber.isNotEmpty()) {
        val newNum = current.currentNumber.dropLast(1)
        val finalNum = if (newNum.isEmpty() || newNum == "-") "0" else newNum
        val updated = current.copy(currentNumber = finalNum)
        updated.copy(previewResult = computePreview(updated))
      } else if (current.expression.isNotEmpty()) {
        val trimmed = current.expression.trimEnd()
        val parts = trimmed.split(" ").toMutableList()
        if (parts.isNotEmpty()) {
          val lastPart = parts.removeAt(parts.size - 1)
          val newExpr = parts.joinToString(" ")
          val restoredNum = if (CalculatorOp.fromSymbol(lastPart) == null && lastPart != "(" && lastPart != ")") lastPart else ""
          val updated = current.copy(
            expression = newExpr,
            currentNumber = restoredNum
          )
          updated.copy(previewResult = computePreview(updated))
        } else {
          current.copy(expression = "", currentNumber = "0", previewResult = null)
        }
      } else {
        current
      }
    }
  }

  private fun handleToggleSign() {
    _state.update { current ->
      if (current.currentNumber.isEmpty() || current.currentNumber == "0") {
        current
      } else if (current.currentNumber.startsWith("-")) {
        val updated = current.copy(currentNumber = current.currentNumber.substring(1))
        updated.copy(previewResult = computePreview(updated))
      } else {
        val updated = current.copy(currentNumber = "-" + current.currentNumber)
        updated.copy(previewResult = computePreview(updated))
      }
    }
  }

  private fun handlePercentage() {
    _state.update { current ->
      val numStr = if (current.currentNumber.isNotEmpty()) current.currentNumber else current.lastResult
      if (numStr.isNullOrEmpty() || numStr == "0") return@update current

      try {
        val bd = BigDecimal(numStr).divide(BigDecimal("100"), 10, RoundingMode.HALF_UP).stripTrailingZeros()
        val formatted = bd.toPlainString()
        val updated = current.copy(
          currentNumber = formatted,
          isCalculated = false
        )
        updated.copy(previewResult = computePreview(updated))
      } catch (_: Exception) {
        current
      }
    }
  }

  private fun handleMemoryRecall() {
    _state.update { current ->
      if (!current.hasMemory) return@update current
      val formatted = CalculatorFormatter.formatBigDecimal(current.memory)
      current.copy(
        currentNumber = formatted,
        isCalculated = false,
        errorMessage = null
      )
    }
  }

  private fun handleMemoryModify(add: Boolean) {
    _state.update { current ->
      val numStr = if (current.currentNumber.isNotEmpty()) current.currentNumber else current.lastResult ?: "0"
      val valueBd = try {
        BigDecimal(numStr.replace(",", ""))
      } catch (_: Exception) {
        BigDecimal.ZERO
      }

      val newMemory = if (add) current.memory.add(valueBd) else current.memory.subtract(valueBd)
      current.copy(
        memory = newMemory,
        hasMemory = true
      )
    }
  }

  private fun handleSelectHistory(historyItem: CalculationHistory) {
    _state.update { current ->
      val cleanResult = historyItem.result.replace(",", "")
      current.copy(
        expression = historyItem.expression,
        currentNumber = cleanResult,
        lastResult = cleanResult,
        previewResult = null,
        isCalculated = true,
        isHistoryOpen = false,
        errorMessage = null
      )
    }
  }

  private fun computePreview(state: CalculatorState): String? {
    if (state.expression.isEmpty()) return null
    val fullExpression = buildString {
      append(state.expression.trim())
      if (state.currentNumber.isNotEmpty() && state.currentNumber != "-") {
        append(" ")
        append(state.currentNumber)
      }
    }.trim()

    val openCount = fullExpression.count { it == '(' }
    val closeCount = fullExpression.count { it == ')' }
    val balancedExpression = if (openCount > closeCount) {
      fullExpression + " )".repeat(openCount - closeCount)
    } else {
      fullExpression
    }

    val result = CalculatorEvaluator.evaluate(balancedExpression, state.angleMode).getOrNull() ?: return null
    return CalculatorFormatter.formatBigDecimal(result)
  }
}
