"""
library.py

Registers all Chemistry Calculator functions.
"""

from chemistry.mole import (
    moles_from_mass,
    mass_from_moles,
    particles_from_moles,
    moles_from_particles,
    moles_from_volume,
    volume_from_moles,
)

from chemistry.molarity import (
    molarity,
    moles_from_molarity,
    volume_from_molarity,
)

from chemistry.dilution import (
    dilution,
)

from chemistry.stoichiometry import (
    stoich_moles,
    stoich_mass,
)


CHEMISTRY_LIB = {

    # ==========================
    # Mole Concept
    # ==========================

    "moles_from_mass": moles_from_mass,
    "mass_from_moles": mass_from_moles,

    "particles_from_moles": particles_from_moles,
    "moles_from_particles": moles_from_particles,

    "moles_from_volume": moles_from_volume,
    "volume_from_moles": volume_from_moles,


    # ==========================
    # Molarity
    # ==========================

    "molarity": molarity,
    "moles_from_molarity": moles_from_molarity,
    "volume_from_molarity": volume_from_molarity,


    # ==========================
    # Dilution
    # ==========================

    "dilution": dilution,


    # ==========================
    # Stoichiometry
    # ==========================

    "stoich_moles": stoich_moles,
    "stoich_mass": stoich_mass,

}
