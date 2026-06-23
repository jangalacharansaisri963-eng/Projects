from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.label import Label

import sympy as sp


class CalculatorApp(App):

    def build(self):

        self.title = "Advanced Calculator"

        layout = BoxLayout(
            orientation="vertical",
            padding=20,
            spacing=15
        )

        self.entry = TextInput(
            hint_text="Example: sqrt(25) or x+5",
            multiline=False,
            font_size=24
        )

        button = Button(
            text="Calculate",
            font_size=20
        )

        button.bind(
            on_press=self.calculate
        )

        self.result = Label(
            text="Answer:",
            font_size=24
        )

        layout.add_widget(self.entry)
        layout.add_widget(button)
        layout.add_widget(self.result)

        return layout


    def calculate(self, instance):

        try:

            expression = self.entry.text

            x = sp.Symbol("x")

            answer = sp.sympify(
                expression,
                locals={
                    "sqrt": sp.sqrt,
                    "sin": sp.sin,
                    "cos": sp.cos,
                    "tan": sp.tan,
                    "log": sp.log,
                    "pi": sp.pi,
                    "E": sp.E,
                    "x": x
                }
            )

            self.result.text = f"Answer: {sp.simplify(answer)}"

        except Exception:

            self.result.text = "Invalid equation"


CalculatorApp().run()
