import tkinter as tk
import math


def calculate():
    try:
        expression = entry.get()

        result = eval(
            expression,
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

        result_label.config(text=f"Answer: {result}")

    except:
        result_label.config(text="❌ Invalid calculation")


def clear():
    entry.delete(0, tk.END)
    result_label.config(text="Answer:")


app = tk.Tk()

app.title("Advanced Calculator")
app.geometry("420x300")


title = tk.Label(
    app,
    text="🐉 Advanced Calculator",
    font=("Arial", 16)
)

title.pack(pady=10)


entry = tk.Entry(
    app,
    width=35,
    font=("Arial", 14)
)

entry.pack()


calculate_button = tk.Button(
    app,
    text="Calculate",
    command=calculate,
    width=15
)

calculate_button.pack(pady=10)


clear_button = tk.Button(
    app,
    text="Clear",
    command=clear,
    width=15
)

clear_button.pack()


result_label = tk.Label(
    app,
    text="Answer:",
    font=("Arial", 14)
)

result_label.pack(pady=20)


app.mainloop()
