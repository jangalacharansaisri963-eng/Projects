"""
Molarity calculations

Formula:

M = n / V

M = molarity
n = moles
V = volume in litres
"""


# ==========================
# Moles and Molarity
# ==========================

def molarity(
    moles,
    volume
):

    if volume <= 0:
        raise ValueError(
            "Volume must be positive"
        )


    return moles / volume



def moles_from_molarity(
    concentration,
    volume
):
    """
    n = MV
    """

    return concentration * volume



def volume_from_molarity(
    moles,
    concentration
):
    """
    V = n/M
    """

    if concentration <= 0:
        raise ValueError(
            "Molarity must be positive"
        )


    return moles / concentration
