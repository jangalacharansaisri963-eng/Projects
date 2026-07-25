print("========== BMI Calculator ==========")


def calculate_bmi(weight, height):
    return weight / (height * height)


while True:

    try:
        weight = float(input("\nEnter your weight (kg): "))
        height = float(input("Enter your height (m): "))

        if weight <= 0 or height <= 0:
            print("Weight and height must be greater than 0.")
            continue

        bmi = calculate_bmi(weight, height)

        print("\n========== Results ==========")
        print(f"BMI: {bmi:.2f}")

        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25:
            category = "Normal Weight"
        elif bmi < 30:
            category = "Overweight"
        elif bmi < 35:
            category = "Obesity Class I"
        elif bmi < 40:
            category = "Obesity Class II"
        else:
            category = "Obesity Class III"

        print(f"Category: {category}")

        ideal_min = 18.5 * height * height
        ideal_max = 24.9 * height * height

        print(f"Ideal Weight Range: {ideal_min:.1f} kg - {ideal_max:.1f} kg")
        print("=============================")

        again = input("\nContinue? (y/n): ").lower()

        if again != "y":
            print("\nThanks for using BMI Calculator!")
            break

    except ValueError:
        print("Please enter valid numbers.")