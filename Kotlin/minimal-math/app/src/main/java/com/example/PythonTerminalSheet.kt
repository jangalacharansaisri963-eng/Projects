package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Output
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PythonTerminalSheet(
  lines: List<TerminalLine>,
  onExecute: (String) -> Unit,
  onClear: () -> Unit,
  onExport: (String) -> Unit,
  onClose: () -> Unit
) {
  var selectedTab by remember { mutableIntStateOf(0) }
  var selectedPythonFile by remember { mutableStateOf("logarithms.py") }
  var inputText by remember { mutableStateOf("") }
  val listState = rememberLazyListState()
  val haptic = LocalHapticFeedback.current

  LaunchedEffect(lines.size) {
    if (lines.isNotEmpty() && selectedTab == 0) listState.animateScrollToItem(lines.size - 1)
  }

  val quickSnippets = listOf(
    "1+1", "log(100)", "sqrt(144)", "gcd(48, 18)",
    "def f(x): return x**2", "def hypot(a,b): return sqrt(a**2+b**2)",
    "help", "vars", "funcs"
  )

  val pythonCodeMap = mapOf(
    "logarithms.py" to """
# Pure Python Logarithms & Roots Implementation
# Executed by Python Engine in Android

def ln(x):
    if x <= 0:
        raise ValueError("math domain error: ln of non-positive")
    e = 2.718281828459045
    k = 0
    while x > 2.0:
        x /= e
        k += 1
    while x < 0.5:
        x *= e
        k -= 1
    y = (x - 1.0) / (x + 1.0)
    y2 = y * y
    term = y
    total = 0.0
    for i in range(1, 35, 2):
        total += term / i
        term *= y2
    return 2.0 * total + (k * 1.0)

def log(x, base=None):
    if base is None:
        return ln(x)
    return ln(x) / ln(base)

def sqrt(x):
    if x < 0:
        raise ValueError("math domain error")
    if x == 0:
        return 0.0
    guess = x / 2.0 if x > 1.0 else 1.0
    for _ in range(25):
        guess = 0.5 * (guess + x / guess)
    return guess
    """.trimIndent(),

    "arithmetic.py" to """
# Pure Python Arithmetic & Number Theory Implementation

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("division by zero")
    return a / b

def factorial(n):
    n = int(n)
    if n < 0:
        raise ValueError("factorial negative error")
    res = 1
    for i in range(2, n + 1):
        res *= i
    return res

def gcd(a, b):
    x, y = abs(int(a)), abs(int(b))
    while y != 0:
        x, y = y, x % y
    return x
    """.trimIndent(),

    "trigonometry.py" to """
# Pure Python Trigonometry Implementation (Taylor Series)

PI = 3.141592653589793

def sin(rad):
    x = rad % (2.0 * PI)
    term = x
    total = x
    x2 = x * x
    for n in range(1, 12):
        term *= -x2 / ((2 * n) * (2 * n + 1))
        total += term
    return total

def cos(rad):
    x = rad % (2.0 * PI)
    term = 1.0
    total = 1.0
    x2 = x * x
    for n in range(1, 12):
        term *= -x2 / ((2 * n - 1) * (2 * n))
        total += term
    return total
    """.trimIndent()
  )

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color.Black.copy(alpha = 0.75f))
      .clickable(onClick = onClose)
  ) {
    Card(
      modifier = Modifier
        .fillMaxWidth()
        .align(Alignment.BottomCenter)
        .clickable(enabled = false) {},
      shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
      colors = CardDefaults.cardColors(containerColor = Color(0xFF101418))
    ) {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 12.dp)
          .imePadding()
          .navigationBarsPadding()
      ) {
        // Header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(28.dp)
                .clip(RoundedCornerShape(6.dp))
                .background(Color(0xFF388E3C).copy(alpha = 0.25f)),
              contentAlignment = Alignment.Center
            ) {
              Text(
                text = "py",
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = Color(0xFF81C784)
              )
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
              text = "Python Engine",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold,
              color = Color.White
            )
          }

          Row {
            if (selectedTab == 0) {
              IconButton(onClick = onClear, modifier = Modifier.size(34.dp).testTag("btn_clear_terminal")) {
                Icon(
                  imageVector = Icons.Default.Delete,
                  contentDescription = "Clear Terminal",
                  tint = MaterialTheme.colorScheme.outline,
                  modifier = Modifier.size(20.dp)
                )
              }
            }
            IconButton(onClick = onClose, modifier = Modifier.size(34.dp).testTag("btn_close_terminal")) {
              Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Close",
                tint = Color.White,
                modifier = Modifier.size(20.dp)
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Tabs: Terminal vs Python Source Modules
        TabRow(
          selectedTabIndex = selectedTab,
          containerColor = Color.Transparent,
          contentColor = Color(0xFF56D364),
          indicator = { tabPositions ->
            TabRowDefaults.SecondaryIndicator(
              Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
              color = Color(0xFF56D364)
            )
          }
        ) {
          Tab(
            selected = selectedTab == 0,
            onClick = { selectedTab = 0 },
            text = { Text("Terminal (REPL)", color = if (selectedTab == 0) Color.White else Color.Gray) },
            icon = { Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(16.dp)) }
          )
          Tab(
            selected = selectedTab == 1,
            onClick = { selectedTab = 1 },
            text = { Text("Python Modules (.py)", color = if (selectedTab == 1) Color.White else Color.Gray) },
            icon = { Icon(Icons.Default.Code, contentDescription = null, modifier = Modifier.size(16.dp)) }
          )
        }

        Spacer(modifier = Modifier.height(10.dp))

        if (selectedTab == 0) {
          // Terminal Tab
          LazyRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
          ) {
            items(quickSnippets) { snippet ->
              Box(
                modifier = Modifier
                  .clip(RoundedCornerShape(8.dp))
                  .background(Color(0xFF21262D))
                  .clickable {
                    haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                    inputText = snippet
                  }
                  .padding(horizontal = 10.dp, vertical = 5.dp)
              ) {
                Text(
                  text = snippet,
                  fontFamily = FontFamily.Monospace,
                  fontSize = 11.sp,
                  color = Color(0xFF79C0FF)
                )
              }
            }
          }

          Spacer(modifier = Modifier.height(10.dp))

          // Console Screen Area
          SelectionContainer {
            LazyColumn(
              state = listState,
              modifier = Modifier
                .fillMaxWidth()
                .height(210.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Color(0xFF0D1117))
                .padding(12.dp),
              verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              items(lines, key = { it.id }) { line ->
                Column(modifier = Modifier.fillMaxWidth()) {
                  if (line.input != null) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                      Text(
                        text = ">>> ",
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF56D364),
                        fontSize = 13.sp
                      )
                      Text(
                        text = line.input,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFFE6EDF3),
                        fontSize = 13.sp
                      )
                    }
                  }

                  if (line.output != null) {
                    Row(
                      modifier = Modifier.fillMaxWidth(),
                      horizontalArrangement = Arrangement.SpaceBetween,
                      verticalAlignment = Alignment.Top
                    ) {
                      Text(
                        text = line.output,
                        fontFamily = FontFamily.Monospace,
                        color = when {
                          line.isError -> Color(0xFFFF7B72)
                          line.isSystem -> Color(0xFF79C0FF)
                          else -> Color(0xFFFFA657)
                        },
                        fontSize = 13.sp,
                        modifier = Modifier.weight(1f)
                      )

                      if (!line.isError && !line.isSystem && line.output.isNotBlank()) {
                        IconButton(
                          onClick = { onExport(line.output) },
                          modifier = Modifier.size(24.dp).testTag("btn_export_output")
                        ) {
                          Icon(
                            imageVector = Icons.Default.Output,
                            contentDescription = "Export to Main Display",
                            tint = Color(0xFF81C784),
                            modifier = Modifier.size(16.dp)
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          Spacer(modifier = Modifier.height(10.dp))

          // Input row
          Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
          ) {
            OutlinedTextField(
              value = inputText,
              onValueChange = { inputText = it },
              modifier = Modifier
                .weight(1f)
                .testTag("input_terminal_command"),
              placeholder = {
                Text(
                  text = "e.g. 1+1 or log(100)",
                  fontFamily = FontFamily.Monospace,
                  fontSize = 12.sp,
                  color = Color.Gray
                )
              },
              prefix = {
                Text(
                  text = ">>> ",
                  fontFamily = FontFamily.Monospace,
                  fontWeight = FontWeight.Bold,
                  color = Color(0xFF56D364),
                  fontSize = 14.sp
                )
              },
              textStyle = TextStyle(
                fontFamily = FontFamily.Monospace,
                fontSize = 13.sp,
                color = Color.White
              ),
              singleLine = true,
              shape = RoundedCornerShape(12.dp),
              colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color(0xFF56D364),
                unfocusedBorderColor = Color(0xFF30363D),
                focusedContainerColor = Color(0xFF0D1117),
                unfocusedContainerColor = Color(0xFF0D1117)
              ),
              keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
              keyboardActions = KeyboardActions(
                onSend = {
                  if (inputText.isNotBlank()) {
                    onExecute(inputText)
                    inputText = ""
                  }
                }
              )
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
              onClick = {
                if (inputText.isNotBlank()) {
                  onExecute(inputText)
                  inputText = ""
                }
              },
              modifier = Modifier
                .size(46.dp)
                .clip(CircleShape)
                .background(Color(0xFF238636))
                .testTag("btn_run_terminal")
            ) {
              Icon(
                imageVector = Icons.AutoMirrored.Filled.Send,
                contentDescription = "Run",
                tint = Color.White,
                modifier = Modifier.size(20.dp)
              )
            }
          }
        } else {
          // Python Code Viewer Tab
          Column(modifier = Modifier.fillMaxWidth()) {
            LazyRow(
              horizontalArrangement = Arrangement.spacedBy(8.dp),
              modifier = Modifier.fillMaxWidth()
            ) {
              items(pythonCodeMap.keys.toList()) { fileName ->
                val isSel = fileName == selectedPythonFile
                Box(
                  modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (isSel) Color(0xFF238636) else Color(0xFF21262D))
                    .clickable { selectedPythonFile = fileName }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                  Text(
                    text = fileName,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    fontWeight = if (isSel) FontWeight.Bold else FontWeight.Normal,
                    color = if (isSel) Color.White else Color(0xFF79C0FF)
                  )
                }
              }
            }

            Spacer(modifier = Modifier.height(10.dp))

            SelectionContainer {
              Box(
                modifier = Modifier
                  .fillMaxWidth()
                  .height(260.dp)
                  .clip(RoundedCornerShape(12.dp))
                  .background(Color(0xFF0D1117))
                  .padding(12.dp)
                  .verticalScroll(rememberScrollState())
              ) {
                Text(
                  text = pythonCodeMap[selectedPythonFile] ?: "",
                  fontFamily = FontFamily.Monospace,
                  fontSize = 12.sp,
                  color = Color(0xFFE6EDF3),
                  lineHeight = 18.sp
                )
              }
            }
          }
        }
      }
    }
  }
}
