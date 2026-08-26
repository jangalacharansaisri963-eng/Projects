import pandas as pd

# 1. Create sample data
data = {
    "Order ID": [101, 102, 103, 104, 105],
    "Product": ["Laptop", "Mouse", "Keyboard", "Monitor", "USB Cable"],
    "Category": [
        "Electronics",
        "Accessories",
        "Accessories",
        "Electronics",
        "Accessories",
    ],
    "Quantity": [2, 5, 3, 1, 10],
    "Unit Price ($)": [1200.00, 25.50, 45.00, 300.00, 12.99],
}

# 2. Convert to a pandas DataFrame
df = pd.DataFrame(data)

# 3. Calculate a Total Price column
df["Total Price ($)"] = df["Quantity"] * df["Unit Price ($)"]

# 4. Export the DataFrame to an Excel file
file_name = "sales_report.xlsx"
df.to_excel(file_name, index=False)

print(f"Excel file '{file_name}' has been successfully created!")
