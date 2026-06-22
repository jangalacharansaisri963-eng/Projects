from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.label import Label
import math


class CalculatorApp(App):

    def build(self):

        layout = BoxLayout(
            orientation="vertical",
            padding=20,
            spacing=15
        )

        self.entry = TextInput(
            hint_text="Enter equation",
            multiline=False,
            font_size=24
        )

        calculate = Button(
            text="Calculate",
            font_size=20
        )

        calculate.bind(
            on_press=self.calculate
        )

        self.result = Label(
            text="Answer:",
            font_size=24
        )

        layout.add_widget(self.entry)
        layout.add_widget(calculate)
        layout.add_widget(self.result)

        return layout


    def calculate(self, instance):

        try:
            answer = eval(
                self.entry.text,
                {
                    "__builtins__": None,
                    "sqrt": math.sqrt,
                    "sin": math.sin,
                    "cos": math.cos,
                    "tan": math.tan,
                    "pi": math.pi,
                    "e": math.e
                }
            )

            self.result.text = f"Answer: {answer}"

        except:
            self.result.text = "Error"


CalculatorApp().run()
