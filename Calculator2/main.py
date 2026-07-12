from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
import math

class CalculatorApp(App):
    def build(self):
        self.layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        self.display = TextInput(text='0', readonly=True, halign='right', font_size=40)
        self.layout.add_widget(self.display)

        # Mapping buttons to math functions
        self.math_functions = {
            'sin': math.sin, 'cos': math.cos, 'tan': math.tan,
            'ln': math.log, 'log₁₀': math.log10, '√': math.sqrt
        }

        grid = GridLayout(cols=6, spacing=2)
        buttons = [
            '(', ')', 'mc', 'm+', 'm-', 'mr',
            '2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ',
            '1/x', '√', '³√', 'ʸ√', 'ln', 'log₁₀',
            'x!', 'sin', 'cos', 'tan', 'e', 'EE',
            'Rand', 'sinh', 'cosh', 'tanh', 'π', 'Rad',
            'Del', 'AC', '%', '÷', '7', '8',
            '9', '×', '4', '5', '6', '-',
            '1', '2', '3', '+', '+/-', '0', '.', '='
        ]

        for btn_text in buttons:
            btn = Button(text=btn_text)
            btn.bind(on_press=self.on_button_press)
            grid.add_widget(btn)
        
        self.layout.add_widget(grid)
        return self.layout

    def on_button_press(self, instance):
        text = instance.text
        current = self.display.text

        if text == 'AC':
            self.display.text = '0'
        elif text == '=':
            try:
                # Prepare expression: Replace symbols with Python operators
                expr = current.replace('×', '*').replace('÷', '/')
                # Safe evaluation
                result = eval(expr, {"__builtins__": None}, self.math_functions)
                self.display.text = str(round(result, 8))
            except Exception:
                self.display.text = 'Error'
        elif text in self.math_functions:
            # Simple implementation for scientific functions
            try:
                val = float(current)
                result = self.math_functions[text](val)
                self.display.text = str(round(result, 8))
            except Exception:
                self.display.text = 'Error'
        else:
            # Append numbers/symbols
            if current == '0':
                self.display.text = text
            else:
                self.display.text += text

if __name__ == '__main__':
    CalculatorApp().run()
