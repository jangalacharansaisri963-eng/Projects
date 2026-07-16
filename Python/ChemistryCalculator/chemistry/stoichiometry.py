"""
Stoichiometry calculations

Uses balanced equation coefficients.

Formula:

wanted moles =
given moles ×
(wanted coefficient / given coefficient)
"""


# ==========================
# Mole Stoichiometry
# ==========================

def stoich_moles(
    given_moles,
    given_coefficient,
    wanted_coefficient
):

    if given_coefficient <= 0:
        raise ValueError(
            "Coefficient must be positive"
        )


    return (
        given_moles
        *
        wanted_coefficient
        /
        given_coefficient
    )



# ==========================
# Mass Stoichiometry
# ==========================

def stoich_mass(
    given_mass,
    given_molar_mass,
    given_coefficient,
    wanted_coefficient,
    wanted_molar_mass
):
    """
    grams → moles → ratio → grams
    """


    given_moles = (
        given_mass
        /
        given_molar_mass
    )


    wanted_moles = stoich_moles(
        given_moles,
        given_coefficient,
        wanted_coefficient
    )


    return (
        wanted_moles
        *
        wanted_molar_mass
    )
