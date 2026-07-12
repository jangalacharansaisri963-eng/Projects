from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput

class CalculatorApp(App):
    def build(self):
        # Main layout
        self.layout = BoxLayout(orientation='vertical', padding=10, spacing=10)

        # Display screen
        self.display = TextInput(text='0', readonly=True, halign='right', font_size=48)
        self.layout.add_widget(self.display)

        # Button layout (simplified example of the grid)
        # In a full app, you would define all buttons from your image
        buttons = [
            ['(', ')', 'mc', 'm+', 'm-', 'mr'],
            ['2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ'],
            ['1/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀'],
            ['7', '8', '9', '÷'],
            ['4', '5', '6', '×'],
            ['1', '2', '3', '-'],
            ['0', '.', '=', '+']
        ]

        for row in buttons:
            h_layout = BoxLayout(spacing=5)
            for label in row:
                btn = Button(text=label, font_size=24)
                # Here you would bind the button to a function:
                # btn.bind(on_press=self.on_button_press)
                h_layout.add_widget(btn)
            self.layout.add_widget(h_layout)

        return self.layout

if __name__ == '__main__':
    CalculatorApp().run()
