package com.example

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backspace
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Functions
import androidx.compose.material.icons.filled.History
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.minimumInteractiveComponentSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle

@Composable
fun CalculatorScreen(
  viewModel: CalculatorViewModel,
  modifier: Modifier = Modifier
) {
  val state by viewModel.state.collectAsStateWithLifecycle()
  val haptic = LocalHapticFeedback.current
  val clipboardManager = LocalClipboardManager.current

  val expressionScrollState = rememberScrollState()
  val resultScrollState = rememberScrollState()

  LaunchedEffect(state.expression, state.currentNumber) {
    expressionScrollState.animateScrollTo(expressionScrollState.maxValue)
    resultScrollState.animateScrollTo(resultScrollState.maxValue)
  }

  Surface(
    modifier = modifier.fillMaxSize(),
    color = MaterialTheme.colorScheme.background
  ) {
    Box(modifier = Modifier.fillMaxSize()) {
      Column(
        modifier = Modifier
          .fillMaxSize()
          .statusBarsPadding()
          .navigationBarsPadding()
          .padding(horizontal = 14.dp, vertical = 6.dp),
        verticalArrangement = Arrangement.SpaceBetween
      ) {
        // Header
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 6.dp, vertical = 2.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            Text(
              text = "Calculator",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.SemiBold,
              color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.8f),
              letterSpacing = 0.5.sp
            )

            // Angle mode badge
            Box(
              modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(MaterialTheme.colorScheme.secondary.copy(alpha = 0.6f))
                .clickable {
                  haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                  viewModel.onAction(CalculatorAction.ToggleAngleMode)
                }
                .padding(horizontal = 8.dp, vertical = 3.dp)
                .testTag("badge_angle_mode")
            ) {
              Text(
                text = state.angleMode.name,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
              )
            }

            // Memory indicator badge
            if (state.hasMemory) {
              Box(
                modifier = Modifier
                  .clip(RoundedCornerShape(8.dp))
                  .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.18f))
                  .padding(horizontal = 6.dp, vertical = 3.dp)
                  .testTag("badge_memory")
              ) {
                Text(
                  text = "M",
                  style = MaterialTheme.typography.labelSmall,
                  fontWeight = FontWeight.Bold,
                  color = MaterialTheme.colorScheme.primary
                )
              }
            }
          }

          Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(
              onClick = {
                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                viewModel.onAction(CalculatorAction.ToggleExtraFunctions)
              },
              modifier = Modifier
                .testTag("btn_toggle_extra_functions")
                .minimumInteractiveComponentSize()
            ) {
              Icon(
                imageVector = Icons.Default.Functions,
                contentDescription = "Extra Functions",
                tint = if (state.isExtraFunctionsOpen) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
              )
            }

            IconButton(
              onClick = {
                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                viewModel.onAction(CalculatorAction.ToggleHistory)
              },
              modifier = Modifier
                .testTag("btn_history")
                .minimumInteractiveComponentSize()
            ) {
              Icon(
                imageVector = Icons.Default.History,
                contentDescription = "History",
                tint = if (state.history.isNotEmpty()) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
              )
            }
          }
        }

        // Display
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .weight(1f)
            .padding(horizontal = 8.dp, vertical = 6.dp),
          verticalArrangement = Arrangement.Bottom,
          horizontalAlignment = Alignment.End
        ) {
          if (state.expression.isNotEmpty()) {
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(expressionScrollState),
              horizontalArrangement = Arrangement.End
            ) {
              Text(
                text = state.expression,
                style = MaterialTheme.typography.titleLarge.copy(fontSize = 20.sp),
                fontWeight = FontWeight.Normal,
                color = MaterialTheme.colorScheme.outline,
                textAlign = TextAlign.End,
                maxLines = 1,
                modifier = Modifier.testTag("display_expression")
              )
            }
            Spacer(modifier = Modifier.height(2.dp))
          }

          val displayText = when {
            state.errorMessage != null -> state.errorMessage!!
            state.currentNumber.isNotEmpty() -> CalculatorFormatter.formatNumber(state.currentNumber)
            state.isCalculated && state.lastResult != null -> CalculatorFormatter.formatNumber(state.lastResult!!)
            else -> "0"
          }

          val fontSize = when {
            displayText.length > 16 -> 26.sp
            displayText.length > 12 -> 34.sp
            displayText.length > 8 -> 44.sp
            else -> 54.sp
          }

          Row(
            modifier = Modifier
              .fillMaxWidth()
              .horizontalScroll(resultScrollState)
              .clickable {
                if (displayText.isNotEmpty() && state.errorMessage == null) {
                  haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                  clipboardManager.setText(AnnotatedString(displayText.replace(",", "")))
                }
              },
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(
              text = displayText,
              fontSize = fontSize,
              lineHeight = fontSize,
              fontWeight = FontWeight.Light,
              fontFamily = FontFamily.Default,
              color = if (state.errorMessage != null) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onBackground,
              textAlign = TextAlign.End,
              maxLines = 1,
              modifier = Modifier.testTag("display_result")
            )
          }

          if (state.previewResult != null && !state.isCalculated && state.errorMessage == null) {
            Spacer(modifier = Modifier.height(2.dp))
            Text(
              text = "= ${state.previewResult}",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Medium,
              color = MaterialTheme.colorScheme.primary.copy(alpha = 0.85f),
              textAlign = TextAlign.End,
              modifier = Modifier.testTag("display_preview")
            )
          } else {
            Spacer(modifier = Modifier.height(8.dp))
          }
        }

        // Memory + Quick Paren Bar
        MemoryAndFunctionBar(
          state = state,
          onAction = { action ->
            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
            viewModel.onAction(action)
          }
        )

        Spacer(modifier = Modifier.height(6.dp))

        // Keypad Container
        BoxWithConstraints(
          modifier = Modifier
            .fillMaxWidth()
            .widthIn(max = 500.dp)
            .align(Alignment.CenterHorizontally)
        ) {
          Column(modifier = Modifier.fillMaxWidth()) {
            AnimatedVisibility(
              visible = state.isExtraFunctionsOpen,
              enter = expandVertically() + fadeIn(),
              exit = shrinkVertically() + fadeOut()
            ) {
              ExtraFunctionsKeypad(
                state = state,
                onAction = { action ->
                  haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                  viewModel.onAction(action)
                },
                modifier = Modifier.padding(bottom = 8.dp)
              )
            }

            CalculatorKeypad(
              isClearAll = state.currentNumber == "0" && state.expression.isEmpty(),
              onAction = { action ->
                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                viewModel.onAction(action)
              }
            )
          }
        }
      }

      // History Sheet
      AnimatedVisibility(
        visible = state.isHistoryOpen,
        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
      ) {
        CalculationHistorySheet(
          history = state.history,
          onSelect = { item ->
            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
            viewModel.onAction(CalculatorAction.SelectHistory(item))
          },
          onClear = {
            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
            viewModel.onAction(CalculatorAction.ClearHistory)
          },
          onClose = {
            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
            viewModel.onAction(CalculatorAction.ToggleHistory)
          }
        )
      }
    }
  }
}

@Composable
private fun MemoryAndFunctionBar(
  state: CalculatorState,
  onAction: (CalculatorAction) -> Unit,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 4.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Row(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      MemoryChip(
        label = "MC",
        enabled = state.hasMemory,
        testTag = "btn_mem_clear",
        onClick = { onAction(CalculatorAction.MemoryClear) }
      )
      MemoryChip(
        label = "MR",
        enabled = state.hasMemory,
        testTag = "btn_mem_recall",
        onClick = { onAction(CalculatorAction.MemoryRecall) }
      )
      MemoryChip(
        label = "M+",
        enabled = true,
        testTag = "btn_mem_add",
        onClick = { onAction(CalculatorAction.MemoryAdd) }
      )
      MemoryChip(
        label = "M−",
        enabled = true,
        testTag = "btn_mem_sub",
        onClick = { onAction(CalculatorAction.MemorySubtract) }
      )
    }

    Row(
      horizontalArrangement = Arrangement.spacedBy(6.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      QuickChip(
        label = "(",
        testTag = "btn_paren_open",
        onClick = { onAction(CalculatorAction.OpenParenthesis) }
      )
      QuickChip(
        label = ")",
        testTag = "btn_paren_close",
        onClick = { onAction(CalculatorAction.CloseParenthesis) }
      )
      QuickChip(
        label = if (state.isExtraFunctionsOpen) "▲" else "▼",
        testTag = "btn_extra_toggle",
        onClick = { onAction(CalculatorAction.ToggleExtraFunctions) }
      )
    }
  }
}

@Composable
private fun MemoryChip(
  label: String,
  enabled: Boolean,
  testTag: String,
  onClick: () -> Unit
) {
  Box(
    modifier = Modifier
      .clip(RoundedCornerShape(12.dp))
      .background(
        if (enabled) MaterialTheme.colorScheme.secondary.copy(alpha = 0.4f)
        else MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
      )
      .clickable(enabled = enabled, onClick = onClick)
      .padding(horizontal = 10.dp, vertical = 6.dp)
      .testTag(testTag),
    contentAlignment = Alignment.Center
  ) {
    Text(
      text = label,
      style = MaterialTheme.typography.labelMedium,
      fontWeight = FontWeight.Medium,
      color = if (enabled) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)
    )
  }
}

@Composable
private fun QuickChip(
  label: String,
  testTag: String,
  onClick: () -> Unit
) {
  Box(
    modifier = Modifier
      .clip(RoundedCornerShape(12.dp))
      .background(MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f))
      .clickable(onClick = onClick)
      .padding(horizontal = 11.dp, vertical = 6.dp)
      .testTag(testTag),
    contentAlignment = Alignment.Center
  ) {
    Text(
      text = label,
      style = MaterialTheme.typography.labelMedium,
      fontWeight = FontWeight.Bold,
      color = MaterialTheme.colorScheme.onSecondary
    )
  }
}

@Composable
private fun ExtraFunctionsKeypad(
  state: CalculatorState,
  onAction: (CalculatorAction) -> Unit,
  modifier: Modifier = Modifier
) {
  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(6.dp)
  ) {
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
      ExtraFunctionButton(
        text = "2nd",
        isHighlighted = state.isSecondMode,
        testTag = "btn_2nd",
        onClick = { onAction(CalculatorAction.ToggleSecondMode) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = state.angleMode.name,
        testTag = "btn_angle_toggle",
        onClick = { onAction(CalculatorAction.ToggleAngleMode) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = if (state.isSecondMode) "sin⁻¹" else "sin",
        testTag = "btn_sin",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.SIN)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = if (state.isSecondMode) "cos⁻¹" else "cos",
        testTag = "btn_cos",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.COS)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = if (state.isSecondMode) "tan⁻¹" else "tan",
        testTag = "btn_tan",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.TAN)) },
        modifier = Modifier.weight(1f)
      )
    }

    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
      ExtraFunctionButton(
        text = if (state.isSecondMode) "eˣ" else "ln",
        testTag = "btn_ln",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.LN)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = if (state.isSecondMode) "10ˣ" else "log",
        testTag = "btn_log",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.LOG)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = "xʸ",
        testTag = "btn_power",
        onClick = { onAction(CalculatorAction.Operator(CalculatorOp.POWER)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = if (state.isSecondMode) "x²" else "√x",
        testTag = "btn_sqrt",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.SQRT)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = "x!",
        testTag = "btn_fact",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.FACTORIAL)) },
        modifier = Modifier.weight(1f)
      )
    }

    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
      ExtraFunctionButton(
        text = "1/x",
        testTag = "btn_inv",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.INVERSE)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = "π",
        testTag = "btn_pi",
        onClick = { onAction(CalculatorAction.Constant(MathConstant.PI)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = "e",
        testTag = "btn_e",
        onClick = { onAction(CalculatorAction.Constant(MathConstant.E)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = if (state.isSecondMode) "x³" else "∛x",
        testTag = "btn_cbrt",
        onClick = { onAction(CalculatorAction.ScientificFunc(ScientificFunction.CBRT)) },
        modifier = Modifier.weight(1f)
      )
      ExtraFunctionButton(
        text = "( )",
        testTag = "btn_parens_combo",
        onClick = {
          if (state.expression.count { it == '(' } > state.expression.count { it == ')' }) {
            onAction(CalculatorAction.CloseParenthesis)
          } else {
            onAction(CalculatorAction.OpenParenthesis)
          }
        },
        modifier = Modifier.weight(1f)
      )
    }
  }
}

@Composable
private fun ExtraFunctionButton(
  text: String,
  isHighlighted: Boolean = false,
  testTag: String,
  onClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  val shape = RoundedCornerShape(16.dp)
  val bgColor = if (isHighlighted) MaterialTheme.colorScheme.primary.copy(alpha = 0.25f)
  else MaterialTheme.colorScheme.secondary.copy(alpha = 0.7f)
  val textColor = if (isHighlighted) MaterialTheme.colorScheme.primary
  else MaterialTheme.colorScheme.onSecondary

  Box(
    modifier = modifier
      .height(44.dp)
      .clip(shape)
      .background(bgColor)
      .clickable(onClick = onClick)
      .testTag(testTag),
    contentAlignment = Alignment.Center
  ) {
    Text(
      text = text,
      style = MaterialTheme.typography.bodyMedium,
      fontWeight = FontWeight.Medium,
      color = textColor
    )
  }
}

@Composable
private fun CalculatorKeypad(
  isClearAll: Boolean,
  onAction: (CalculatorAction) -> Unit,
  modifier: Modifier = Modifier
) {
  val haptic = LocalHapticFeedback.current

  Column(
    modifier = modifier.fillMaxWidth(),
    verticalArrangement = Arrangement.spacedBy(8.dp)
  ) {
    // Row 1: AC/C, ±, %, ÷
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      CalculatorButton(
        text = if (isClearAll) "AC" else "C",
        type = ButtonType.Function,
        testTag = if (isClearAll) "btn_all_clear" else "btn_clear",
        onClick = {
          if (isClearAll) onAction(CalculatorAction.AllClear) else onAction(CalculatorAction.Clear)
        },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "±",
        type = ButtonType.Function,
        testTag = "btn_plus_minus",
        onClick = { onAction(CalculatorAction.ToggleSign) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "%",
        type = ButtonType.Function,
        testTag = "btn_percent",
        onClick = { onAction(CalculatorAction.Percentage) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "÷",
        type = ButtonType.Operator,
        testTag = "btn_divide",
        onClick = { onAction(CalculatorAction.Operator(CalculatorOp.DIVIDE)) },
        modifier = Modifier.weight(1f)
      )
    }

    // Row 2: 7, 8, 9, ×
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      CalculatorButton(
        text = "7",
        type = ButtonType.Number,
        testTag = "btn_7",
        onClick = { onAction(CalculatorAction.Number(7)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "8",
        type = ButtonType.Number,
        testTag = "btn_8",
        onClick = { onAction(CalculatorAction.Number(8)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "9",
        type = ButtonType.Number,
        testTag = "btn_9",
        onClick = { onAction(CalculatorAction.Number(9)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "×",
        type = ButtonType.Operator,
        testTag = "btn_multiply",
        onClick = { onAction(CalculatorAction.Operator(CalculatorOp.MULTIPLY)) },
        modifier = Modifier.weight(1f)
      )
    }

    // Row 3: 4, 5, 6, −
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      CalculatorButton(
        text = "4",
        type = ButtonType.Number,
        testTag = "btn_4",
        onClick = { onAction(CalculatorAction.Number(4)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "5",
        type = ButtonType.Number,
        testTag = "btn_5",
        onClick = { onAction(CalculatorAction.Number(5)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "6",
        type = ButtonType.Number,
        testTag = "btn_6",
        onClick = { onAction(CalculatorAction.Number(6)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "−",
        type = ButtonType.Operator,
        testTag = "btn_subtract",
        onClick = { onAction(CalculatorAction.Operator(CalculatorOp.SUBTRACT)) },
        modifier = Modifier.weight(1f)
      )
    }

    // Row 4: 1, 2, 3, +
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      CalculatorButton(
        text = "1",
        type = ButtonType.Number,
        testTag = "btn_1",
        onClick = { onAction(CalculatorAction.Number(1)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "2",
        type = ButtonType.Number,
        testTag = "btn_2",
        onClick = { onAction(CalculatorAction.Number(2)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "3",
        type = ButtonType.Number,
        testTag = "btn_3",
        onClick = { onAction(CalculatorAction.Number(3)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "+",
        type = ButtonType.Operator,
        testTag = "btn_add",
        onClick = { onAction(CalculatorAction.Operator(CalculatorOp.ADD)) },
        modifier = Modifier.weight(1f)
      )
    }

    // Row 5: 0, ., ⌫, =
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      CalculatorButton(
        text = "0",
        type = ButtonType.Number,
        testTag = "btn_0",
        onClick = { onAction(CalculatorAction.Number(0)) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = ".",
        type = ButtonType.Number,
        testTag = "btn_decimal",
        onClick = { onAction(CalculatorAction.Decimal) },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        icon = Icons.Default.Backspace,
        type = ButtonType.Function,
        testTag = "btn_backspace",
        onClick = { onAction(CalculatorAction.Backspace) },
        onLongClick = {
          haptic.performHapticFeedback(HapticFeedbackType.LongPress)
          onAction(CalculatorAction.AllClear)
        },
        modifier = Modifier.weight(1f)
      )
      CalculatorButton(
        text = "=",
        type = ButtonType.Equals,
        testTag = "btn_equals",
        onClick = { onAction(CalculatorAction.Equals) },
        modifier = Modifier.weight(1f)
      )
    }
  }
}

private enum class ButtonType {
  Number, Function, Operator, Equals
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun CalculatorButton(
  modifier: Modifier = Modifier,
  text: String? = null,
  icon: ImageVector? = null,
  type: ButtonType,
  testTag: String,
  onClick: () -> Unit,
  onLongClick: (() -> Unit)? = null
) {
  val backgroundColor = when (type) {
    ButtonType.Number -> MaterialTheme.colorScheme.surfaceVariant
    ButtonType.Function -> MaterialTheme.colorScheme.secondary
    ButtonType.Operator -> MaterialTheme.colorScheme.primary
    ButtonType.Equals -> MaterialTheme.colorScheme.primary
  }

  val contentColor = when (type) {
    ButtonType.Number -> MaterialTheme.colorScheme.onSurfaceVariant
    ButtonType.Function -> MaterialTheme.colorScheme.onSecondary
    ButtonType.Operator -> MaterialTheme.colorScheme.onPrimary
    ButtonType.Equals -> MaterialTheme.colorScheme.onPrimary
  }

  val shape = RoundedCornerShape(24.dp)

  Box(
    modifier = modifier
      .aspectRatio(1.1f)
      .clip(shape)
      .background(backgroundColor)
      .combinedClickable(
        onClick = onClick,
        onLongClick = onLongClick
      )
      .testTag(testTag)
      .minimumInteractiveComponentSize(),
    contentAlignment = Alignment.Center
  ) {
    if (icon != null) {
      Icon(
        imageVector = icon,
        contentDescription = "Backspace",
        tint = contentColor,
        modifier = Modifier.size(24.dp)
      )
    } else if (text != null) {
      Text(
        text = text,
        style = when (type) {
          ButtonType.Number -> MaterialTheme.typography.titleLarge.copy(fontSize = 24.sp, fontWeight = FontWeight.Normal)
          ButtonType.Function -> MaterialTheme.typography.titleMedium.copy(fontSize = 20.sp, fontWeight = FontWeight.Medium)
          ButtonType.Operator, ButtonType.Equals -> MaterialTheme.typography.headlineMedium.copy(fontSize = 26.sp, fontWeight = FontWeight.Normal)
        },
        color = contentColor
      )
    }
  }
}

@Composable
private fun CalculationHistorySheet(
  history: List<CalculationHistory>,
  onSelect: (CalculationHistory) -> Unit,
  onClear: () -> Unit,
  onClose: () -> Unit,
  modifier: Modifier = Modifier
) {
  Box(
    modifier = modifier
      .fillMaxSize()
      .background(Color.Black.copy(alpha = 0.55f))
      .clickable { onClose() },
    contentAlignment = Alignment.BottomCenter
  ) {
    Card(
      modifier = Modifier
        .fillMaxWidth()
        .fillMaxHeight(0.65f)
        .clickable(enabled = false) {},
      shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
      colors = CardDefaults.cardColors(
        containerColor = MaterialTheme.colorScheme.surface
      )
    ) {
      Column(
        modifier = Modifier
          .fillMaxSize()
          .padding(20.dp)
      ) {
        Box(
          modifier = Modifier
            .size(width = 36.dp, height = 4.dp)
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.outline.copy(alpha = 0.4f))
            .align(Alignment.CenterHorizontally)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = "Calculation History",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
          )

          Row(verticalAlignment = Alignment.CenterVertically) {
            if (history.isNotEmpty()) {
              IconButton(
                onClick = onClear,
                modifier = Modifier.testTag("btn_clear_history")
              ) {
                Icon(
                  imageVector = Icons.Default.Delete,
                  contentDescription = "Clear History",
                  tint = MaterialTheme.colorScheme.error
                )
              }
            }
            IconButton(
              onClick = onClose,
              modifier = Modifier.testTag("btn_close_history")
            ) {
              Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Close",
                tint = MaterialTheme.colorScheme.onSurface
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(12.dp))

        if (history.isEmpty()) {
          Box(
            modifier = Modifier
              .fillMaxSize()
              .padding(bottom = 32.dp),
            contentAlignment = Alignment.Center
          ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
              Icon(
                imageVector = Icons.Default.History,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                modifier = Modifier.size(48.dp)
              )
              Spacer(modifier = Modifier.height(12.dp))
              Text(
                text = "No calculations yet",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.outline
              )
            }
          }
        } else {
          LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
          ) {
            items(history, key = { it.id }) { item ->
              Card(
                modifier = Modifier
                  .fillMaxWidth()
                  .clip(RoundedCornerShape(16.dp))
                  .clickable { onSelect(item) }
                  .testTag("history_item_${item.id}"),
                colors = CardDefaults.cardColors(
                  containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                ),
                shape = RoundedCornerShape(16.dp)
              ) {
                Column(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                  horizontalAlignment = Alignment.End
                ) {
                  Text(
                    text = item.expression,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.outline,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                  )
                  Spacer(modifier = Modifier.height(2.dp))
                  Text(
                    text = "= ${item.result}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                  )
                }
              }
            }
          }
        }
      }
    }
  }
}
