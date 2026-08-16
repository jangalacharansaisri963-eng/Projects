package com.example

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.math.BigDecimal

class CalculatorUnitTest {

  @Test
  fun testContinuousTypingAndPreviewFlow() {
    val vm = CalculatorViewModel()

    // 1 + 1
    vm.onAction(CalculatorAction.Number(1))
    assertEquals("1", vm.state.value.expression)
    assertNull(vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Operator(CalculatorOp.ADD))
    assertEquals("1+", vm.state.value.expression)
    assertEquals("1", vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Number(1))
    assertEquals("1+1", vm.state.value.expression)
    assertEquals("2", vm.state.value.previewResult)

    // * 2 (1+1*2)
    vm.onAction(CalculatorAction.Operator(CalculatorOp.MULTIPLY))
    assertEquals("1+1×", vm.state.value.expression)
    assertEquals("2", vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Number(2))
    assertEquals("1+1×2", vm.state.value.expression)
    assertEquals("3", vm.state.value.previewResult)

    // Press Equals: result becomes primary expression
    vm.onAction(CalculatorAction.Equals)
    assertEquals("3", vm.state.value.expression)
    assertNull(vm.state.value.previewResult)
    assertTrue(vm.state.value.isCalculated)

    // Multiply by 3 (3 * 3 = 9)
    vm.onAction(CalculatorAction.Operator(CalculatorOp.MULTIPLY))
    assertEquals("3×", vm.state.value.expression)
    assertEquals("3", vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Number(3))
    assertEquals("3×3", vm.state.value.expression)
    assertEquals("9", vm.state.value.previewResult)

    // Press Equals: result 9
    vm.onAction(CalculatorAction.Equals)
    assertEquals("9", vm.state.value.expression)
    assertNull(vm.state.value.previewResult)
  }

  @Test
  fun testVideoCalculationSequence() {
    // Exact sequence in the user's video: 2 × 3 = 6, 6 × 5 = 30
    val vm = CalculatorViewModel()

    vm.onAction(CalculatorAction.Number(2))
    vm.onAction(CalculatorAction.Operator(CalculatorOp.MULTIPLY))
    vm.onAction(CalculatorAction.Number(3))
    assertEquals("2×3", vm.state.value.expression)
    assertEquals("6", vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Equals)
    assertEquals("6", vm.state.value.expression)
    assertNull(vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Operator(CalculatorOp.MULTIPLY))
    vm.onAction(CalculatorAction.Number(5))
    assertEquals("6×5", vm.state.value.expression)
    assertEquals("30", vm.state.value.previewResult)

    vm.onAction(CalculatorAction.Equals)
    assertEquals("30", vm.state.value.expression)
    assertNull(vm.state.value.previewResult)
  }

  @Test
  fun testBasicAddition() {
    val result = CalculatorEvaluator.evaluate("2 + 3").getOrThrow()
    assertEquals("5", result.toPlainString())
  }

  @Test
  fun testBasicSubtraction() {
    val result = CalculatorEvaluator.evaluate("10 − 4").getOrThrow()
    assertEquals("6", result.toPlainString())
  }

  @Test
  fun testBasicMultiplication() {
    val result = CalculatorEvaluator.evaluate("7 × 8").getOrThrow()
    assertEquals("56", result.toPlainString())
  }

  @Test
  fun testBasicDivision() {
    val result = CalculatorEvaluator.evaluate("20 ÷ 4").getOrThrow()
    assertEquals("5", result.toPlainString())
  }

  @Test
  fun testOperatorPrecedence() {
    val result = CalculatorEvaluator.evaluate("2 + 3 × 4").getOrThrow()
    assertEquals("14", result.toPlainString())
  }

  @Test
  fun testTrigonometryDegree() {
    val sin30 = CalculatorEvaluator.evaluate("sin(30)", AngleMode.DEG).getOrThrow()
    assertEquals(0.5, sin30.toDouble(), 0.0001)

    val cos60 = CalculatorEvaluator.evaluate("cos(60)", AngleMode.DEG).getOrThrow()
    assertEquals(0.5, cos60.toDouble(), 0.0001)
  }

  @Test
  fun testFactorialAndLogarithm() {
    val fact5 = CalculatorEvaluator.evaluate("fact(5)").getOrThrow()
    assertEquals("120", fact5.toPlainString())

    val log100 = CalculatorEvaluator.evaluate("log(100)").getOrThrow()
    assertEquals("2", log100.toPlainString())
  }

  @Test
  fun testDivisionByZero() {
    val result = CalculatorEvaluator.evaluate("10 ÷ 0")
    assertTrue(result.isFailure)
  }

  @Test
  fun testMemoryFunctions() {
    val vm = CalculatorViewModel()
    // Type 25 and add to memory
    vm.onAction(CalculatorAction.Number(2))
    vm.onAction(CalculatorAction.Number(5))
    vm.onAction(CalculatorAction.MemoryAdd)
    assertTrue(vm.state.value.hasMemory)
    assertEquals(BigDecimal("25"), vm.state.value.memory)

    // Clear display, then recall memory
    vm.onAction(CalculatorAction.AllClear)
    assertEquals("", vm.state.value.expression)
    vm.onAction(CalculatorAction.MemoryRecall)
    assertEquals("25", vm.state.value.expression)

    // Memory clear
    vm.onAction(CalculatorAction.MemoryClear)
    assertEquals(false, vm.state.value.hasMemory)
  }

  @Test
  fun testPythonTerminalEngineVariableAndFunctions() {
    val engine = PythonTerminalEngine()

    // Variable assignment: x = 15
    val varRes = engine.execute("x = 15")
    assertEquals("x = 15", varRes.output)
    assertEquals(false, varRes.isError)

    // Expression: x * 3
    val mulRes = engine.execute("x * 3")
    assertEquals("45", mulRes.output)

    // Function definition: def sqr(n): return n * n
    val defRes = engine.execute("def sqr(n): return n * n")
    assertTrue(defRes.isSystem)

    // Function call: sqr(9)
    val callRes = engine.execute("sqr(9)")
    assertEquals("81", callRes.output)

    // Two-parameter function: def hypot(a, b): return sqrt(a**2 + b**2)
    val defHypot = engine.execute("def hypot(a, b): return sqrt(a**2 + b**2)")
    assertTrue(defHypot.isSystem)

    val hypotRes = engine.execute("hypot(3, 4)")
    assertEquals("5", hypotRes.output)

    // Built-in math functions: sin(pi / 2), fact(5)
    val trigRes = engine.execute("sin(pi / 2)")
    assertEquals("1", trigRes.output)

    val factRes = engine.execute("fact(5)")
    assertEquals("120", factRes.output)
  }

  @Test
  fun testMathModulesDirectly() {
    // ArithmeticModule
    assertEquals(15.0, ArithmeticModule.add(10.0, 5.0), 0.0001)
    assertEquals(5.0, ArithmeticModule.subtract(10.0, 5.0), 0.0001)
    assertEquals(50.0, ArithmeticModule.multiply(10.0, 5.0), 0.0001)
    assertEquals(2.0, ArithmeticModule.divide(10.0, 5.0), 0.0001)
    assertEquals(3.0, ArithmeticModule.floorDivide(7.0, 2.0), 0.0001)
    assertEquals(1.0, ArithmeticModule.modulo(7.0, 2.0), 0.0001)
    assertEquals(8.0, ArithmeticModule.power(2.0, 3.0), 0.0001)
    assertEquals(6L, ArithmeticModule.gcd(18L, 24L))
    assertEquals(72L, ArithmeticModule.lcm(18L, 24L))

    // LogarithmsModule
    assertEquals(12.0, LogarithmsModule.sqrt(144.0), 0.0001)
    assertEquals(3.0, LogarithmsModule.cbrt(27.0), 0.0001)
    assertEquals(2.0, LogarithmsModule.log10(100.0), 0.0001)
    assertEquals(3.0, LogarithmsModule.log2(8.0), 0.0001)
    assertEquals(1.0, LogarithmsModule.ln(Math.E), 0.0001)

    // TrigonometryModule
    assertEquals(0.0, TrigonometryModule.sin(0.0), 0.0001)
    assertEquals(1.0, TrigonometryModule.cos(0.0), 0.0001)
    assertEquals(180.0, TrigonometryModule.radiansToDegrees(Math.PI), 0.0001)
  }
}
