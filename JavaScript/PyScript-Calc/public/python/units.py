"""
Unit conversion engine — pure Python.
~500 common measurement units across length, mass, volume, temperature,
time, energy, power, pressure, area, speed, data, angle, force, etc.

convert(value, from_unit, to_unit) is the main API.
list_units(category=None) lists available units.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Base factors: each unit maps to a factor relative to a category base unit.
# Temperature is handled specially (offset + scale).
# ---------------------------------------------------------------------------

# Length → metre
_LENGTH: Dict[str, float] = {
    "m": 1.0, "metre": 1.0, "meter": 1.0, "metres": 1.0, "meters": 1.0,
    "km": 1000.0, "kilometre": 1000.0, "kilometer": 1000.0,
    "cm": 0.01, "centimetre": 0.01, "centimeter": 0.01,
    "mm": 0.001, "millimetre": 0.001, "millimeter": 0.001,
    "um": 1e-6, "µm": 1e-6, "micron": 1e-6, "micrometre": 1e-6,
    "nm": 1e-9, "nanometre": 1e-9, "nanometer": 1e-9,
    "pm": 1e-12, "picometre": 1e-12,
    "fm": 1e-15, "femtometre": 1e-15,
    "angstrom": 1e-10, "Å": 1e-10,
    "in": 0.0254, "inch": 0.0254, "inches": 0.0254,
    "ft": 0.3048, "foot": 0.3048, "feet": 0.3048,
    "yd": 0.9144, "yard": 0.9144, "yards": 0.9144,
    "mi": 1609.344, "mile": 1609.344, "miles": 1609.344,
    "nmi": 1852.0, "nautical_mile": 1852.0,
    "au": 1.495978707e11, "astronomical_unit": 1.495978707e11,
    "ly": 9.4607304725808e15, "light_year": 9.4607304725808e15,
    "pc": 3.085677581491367e16, "parsec": 3.085677581491367e16,
    "furlong": 201.168,
    "chain": 20.1168,
    "rod": 5.0292, "perch": 5.0292, "pole": 5.0292,
    "fathom": 1.8288,
    "cubit": 0.4572,
    "hand": 0.1016,
    "span": 0.2286,
    "mil": 2.54e-5, "thou": 2.54e-5,
    "league": 4828.032,
    "point": 0.0003527778,  # typography
    "pica": 0.004233333,
    "ell": 1.143,
    "arpent": 58.5216,
}

# Area → m²
_AREA: Dict[str, float] = {
    "m2": 1.0, "sqm": 1.0, "square_metre": 1.0, "square_meter": 1.0,
    "km2": 1e6, "sqkm": 1e6,
    "cm2": 1e-4, "sqcm": 1e-4,
    "mm2": 1e-6, "sqmm": 1e-6,
    "ha": 10000.0, "hectare": 10000.0,
    "acre": 4046.8564224,
    "sqmi": 2.589988110336e6, "square_mile": 2.589988110336e6,
    "sqyd": 0.83612736, "square_yard": 0.83612736,
    "sqft": 0.09290304, "square_foot": 0.09290304, "sqft_us": 0.09290304,
    "sqin": 0.00064516, "square_inch": 0.00064516,
    "are": 100.0,
    "barn": 1e-28,
    "rood": 1011.7141056,
}

# Volume → m³
_VOLUME: Dict[str, float] = {
    "m3": 1.0, "cubic_metre": 1.0, "cubic_meter": 1.0,
    "l": 0.001, "liter": 0.001, "litre": 0.001, "liters": 0.001, "litres": 0.001,
    "ml": 1e-6, "millilitre": 1e-6, "milliliter": 1e-6,
    "cl": 1e-5, "centilitre": 1e-5,
    "dl": 1e-4, "decilitre": 1e-4,
    "ul": 1e-9, "µl": 1e-9, "microlitre": 1e-9,
    "cm3": 1e-6, "cc": 1e-6,
    "mm3": 1e-9,
    "km3": 1e9,
    "gal": 0.003785411784, "gallon": 0.003785411784, "us_gallon": 0.003785411784,
    "gal_uk": 0.00454609, "imperial_gallon": 0.00454609,
    "qt": 0.000946352946, "quart": 0.000946352946,
    "pt": 0.000473176473, "pint": 0.000473176473,
    "cup": 0.0002365882365,
    "floz": 2.95735295625e-5, "fluid_ounce": 2.95735295625e-5,
    "tbsp": 1.478676478125e-5, "tablespoon": 1.478676478125e-5,
    "tsp": 4.92892159375e-6, "teaspoon": 4.92892159375e-6,
    "bbl": 0.158987294928, "barrel": 0.158987294928,  # oil
    "cuft": 0.028316846592, "cubic_foot": 0.028316846592,
    "cuin": 1.6387064e-5, "cubic_inch": 1.6387064e-5,
    "cuyd": 0.764554857984, "cubic_yard": 0.764554857984,
    "bushel": 0.03523907016688,
    "peck": 0.00880976754172,
    "gill": 1.1829411825e-4,
    "hogshead": 0.238480942392,
}

# Mass → kg
_MASS: Dict[str, float] = {
    "kg": 1.0, "kilogram": 1.0, "kilogramme": 1.0,
    "g": 0.001, "gram": 0.001, "gramme": 0.001,
    "mg": 1e-6, "milligram": 1e-6,
    "ug": 1e-9, "µg": 1e-9, "microgram": 1e-9,
    "ng": 1e-12, "nanogram": 1e-12,
    "t": 1000.0, "tonne": 1000.0, "metric_ton": 1000.0,
    "lb": 0.45359237, "pound": 0.45359237, "lbs": 0.45359237,
    "oz": 0.028349523125, "ounce": 0.028349523125,
    "st": 6.35029318, "stone": 6.35029318,
    "ton": 907.18474, "short_ton": 907.18474,  # US
    "long_ton": 1016.0469088,
    "slug": 14.59390294,
    "ct": 0.0002, "carat": 0.0002,
    "gr": 6.479891e-5, "grain": 6.479891e-5,
    "dr": 0.0017718451953125, "dram": 0.0017718451953125,
    "cwt": 45.359237, "hundredweight": 45.359237,  # US
    "cwt_uk": 50.80234544,
    "amu": 1.66053906660e-27, "u": 1.66053906660e-27, "dalton": 1.66053906660e-27,
    "solar_mass": 1.98847e30,
    "earth_mass": 5.9722e24,
}

# Time → second
_TIME: Dict[str, float] = {
    "s": 1.0, "sec": 1.0, "second": 1.0, "seconds": 1.0,
    "ms": 0.001, "millisecond": 0.001,
    "us": 1e-6, "µs": 1e-6, "microsecond": 1e-6,
    "ns": 1e-9, "nanosecond": 1e-9,
    "ps": 1e-12, "picosecond": 1e-12,
    "min": 60.0, "minute": 60.0, "minutes": 60.0,
    "h": 3600.0, "hr": 3600.0, "hour": 3600.0, "hours": 3600.0,
    "d": 86400.0, "day": 86400.0, "days": 86400.0,
    "wk": 604800.0, "week": 604800.0, "weeks": 604800.0,
    "fortnight": 1209600.0,
    "mo": 2629746.0, "month": 2629746.0,  # average Gregorian
    "yr": 31556952.0, "year": 31556952.0, "years": 31556952.0,  # tropical approx
    "decade": 315569520.0,
    "century": 3155695200.0,
    "millennium": 31556952000.0,
    "shake": 1e-8,
    "jiffy": 0.01,  # informal 1/100 s
    "sidereal_day": 86164.0905,
    "sidereal_year": 31558149.8,
}

# Speed → m/s
_SPEED: Dict[str, float] = {
    "mps": 1.0, "m/s": 1.0, "metre_per_second": 1.0,
    "kph": 1 / 3.6, "km/h": 1 / 3.6, "kmh": 1 / 3.6,
    "mph": 0.44704, "mi/h": 0.44704,
    "fps": 0.3048, "ft/s": 0.3048,
    "knot": 0.514444, "kn": 0.514444, "kt": 0.514444,
    "c": 299792458.0, "speed_of_light": 299792458.0,
    "mach": 340.29,  # approx at sea level 15°C
    "ips": 0.0254,  # inch per second
}

# Acceleration → m/s²
_ACCEL: Dict[str, float] = {
    "mps2": 1.0, "m/s2": 1.0,
    "g": 9.80665, "gee": 9.80665, "standard_gravity": 9.80665,
    "gal": 0.01, "galileo": 0.01,
    "ft/s2": 0.3048,
}

# Force → newton
_FORCE: Dict[str, float] = {
    "n": 1.0, "newton": 1.0,
    "kn": 1000.0, "kilonewton": 1000.0,
    "dyn": 1e-5, "dyne": 1e-5,
    "lbf": 4.4482216152605, "pound_force": 4.4482216152605,
    "kgf": 9.80665, "kilogram_force": 9.80665, "kp": 9.80665,
    "pdl": 0.138254954376, "poundal": 0.138254954376,
    "ozf": 0.27801385095378125,
}

# Pressure → pascal
_PRESSURE: Dict[str, float] = {
    "pa": 1.0, "pascal": 1.0,
    "kpa": 1000.0, "kilopascal": 1000.0,
    "mpa": 1e6, "megapascal": 1e6,
    "bar": 1e5,
    "mbar": 100.0, "millibar": 100.0,
    "atm": 101325.0, "atmosphere": 101325.0,
    "torr": 133.322368421,
    "mmhg": 133.322368421, "millimetre_mercury": 133.322368421,
    "inhg": 3386.389,
    "psi": 6894.757293168, "lbf/in2": 6894.757293168,
    "psf": 47.88025898,
    "ba": 0.1, "barye": 0.1,
    "at": 98066.5, "technical_atmosphere": 98066.5,
}

# Energy → joule
_ENERGY: Dict[str, float] = {
    "j": 1.0, "joule": 1.0,
    "kj": 1000.0, "kilojoule": 1000.0,
    "mj": 1e6, "megajoule": 1e6,
    "gj": 1e9,
    "cal": 4.184, "calorie": 4.184,
    "kcal": 4184.0, "kilocalorie": 4184.0, "cal_food": 4184.0,
    "wh": 3600.0, "watt_hour": 3600.0,
    "kwh": 3.6e6, "kilowatt_hour": 3.6e6,
    "mwh": 3.6e9,
    "ev": 1.602176634e-19, "electronvolt": 1.602176634e-19,
    "kev": 1.602176634e-16,
    "mev": 1.602176634e-13,
    "btu": 1055.05585262,
    "therm": 1.05505585262e8,
    "ft_lbf": 1.3558179483314,
    "erg": 1e-7,
    "hartree": 4.3597447222071e-18,
    "rydberg": 2.1798723611035e-18,
}

# Power → watt
_POWER: Dict[str, float] = {
    "w": 1.0, "watt": 1.0,
    "kw": 1000.0, "kilowatt": 1000.0,
    "mw": 1e6, "megawatt": 1e6,
    "gw": 1e9, "gigawatt": 1e9,
    "hp": 745.6998715822702, "horsepower": 745.6998715822702,
    "ps": 735.49875, "metric_horsepower": 735.49875,
    "btu/h": 0.29307107,
    "ft_lbf/s": 1.3558179483314,
    "erg/s": 1e-7,
    "ton_refrigeration": 3516.85284,
}

# Angle → radian
_ANGLE: Dict[str, float] = {
    "rad": 1.0, "radian": 1.0,
    "deg": 0.017453292519943295, "degree": 0.017453292519943295, "°": 0.017453292519943295,
    "grad": 0.015708, "gon": 0.015708, "grade": 0.015708,
    "arcmin": 0.0002908882086657216, "arcminute": 0.0002908882086657216,
    "arcsec": 4.84813681109536e-6, "arcsecond": 4.84813681109536e-6,
    "turn": 6.283185307179586, "rev": 6.283185307179586, "revolution": 6.283185307179586,
    "mil_nato": 0.0009817477,
}

# Data → byte (binary)
_DATA: Dict[str, float] = {
    "b": 1.0, "byte": 1.0,
    "bit": 0.125,
    "kb": 1024.0, "kib": 1024.0, "kilobyte": 1024.0,
    "mb": 1048576.0, "mib": 1048576.0, "megabyte": 1048576.0,
    "gb": 1073741824.0, "gib": 1073741824.0, "gigabyte": 1073741824.0,
    "tb": 1099511627776.0, "tib": 1099511627776.0, "terabyte": 1099511627776.0,
    "pb": 1125899906842624.0, "pib": 1125899906842624.0,
    "kbit": 128.0, "kibit": 128.0,
    "mbit": 131072.0, "mibit": 131072.0,
    "gbit": 134217728.0, "gibit": 134217728.0,
    "nibble": 0.5,
}

# Frequency → hertz
_FREQ: Dict[str, float] = {
    "hz": 1.0, "hertz": 1.0,
    "khz": 1000.0, "kilohertz": 1000.0,
    "mhz": 1e6, "megahertz": 1e6,
    "ghz": 1e9, "gigahertz": 1e9,
    "thz": 1e12,
    "rpm": 1 / 60.0,
    "rps": 1.0,
}

# Temperature: special (scale, offset) relative to Kelvin
# T_kelvin = value * scale + offset
_TEMP: Dict[str, Tuple[float, float]] = {
    "k": (1.0, 0.0), "kelvin": (1.0, 0.0),
    "c": (1.0, 273.15), "celsius": (1.0, 273.15), "°c": (1.0, 273.15),
    "f": (5 / 9, 459.67 * 5 / 9), "fahrenheit": (5 / 9, 459.67 * 5 / 9), "°f": (5 / 9, 459.67 * 5 / 9),
    "r": (5 / 9, 0.0), "rankine": (5 / 9, 0.0),
    "re": (1.25, 273.15), "reaumur": (1.25, 273.15),
}

# Fuel economy → m/m³ (metres per cubic metre) — higher = more efficient
_FUEL: Dict[str, float] = {
    "km/l": 1e6, "kml": 1e6,
    "l/100km": 1e8,  # inverted handling below
    "mpg": 425143.707,  # US mpg
    "mpg_uk": 510235.0,
}

# Density → kg/m³
_DENSITY: Dict[str, float] = {
    "kg/m3": 1.0,
    "g/cm3": 1000.0, "g/ml": 1000.0,
    "lb/ft3": 16.01846337,
    "lb/in3": 27679.90471,
    "slug/ft3": 515.3788184,
}

# Dynamic viscosity → Pa·s
_VISCOSITY: Dict[str, float] = {
    "pas": 1.0, "pa_s": 1.0,
    "poise": 0.1,
    "cp": 0.001, "centipoise": 0.001,
}

# Illuminance → lux
_ILLUM: Dict[str, float] = {
    "lx": 1.0, "lux": 1.0,
    "fc": 10.7639104167, "footcandle": 10.7639104167,
    "phot": 10000.0,
}

# Magnetic flux density → tesla
_MAG: Dict[str, float] = {
    "t": 1.0, "tesla": 1.0,
    "g": 1e-4, "gauss": 1e-4,  # note: overlaps with accel 'g' — disambiguate by category
    "gamma": 1e-9,
}

# Electric charge → coulomb
_CHARGE: Dict[str, float] = {
    "c": 1.0, "coulomb": 1.0,
    "ah": 3600.0, "amp_hour": 3600.0,
    "mah": 3.6,
    "e": 1.602176634e-19,  # elementary charge
}

# Electric potential → volt
_VOLT: Dict[str, float] = {
    "v": 1.0, "volt": 1.0,
    "mv": 0.001, "millivolt": 0.001,
    "kv": 1000.0, "kilovolt": 1000.0,
}

# Current → ampere
_CURRENT: Dict[str, float] = {
    "a": 1.0, "amp": 1.0, "ampere": 1.0,
    "ma": 0.001, "milliamp": 0.001,
    "ua": 1e-6, "µa": 1e-6, "microamp": 1e-6,
    "ka": 1000.0,
}

# Resistance → ohm
_RESIST: Dict[str, float] = {
    "ohm": 1.0, "Ω": 1.0,
    "kohm": 1000.0, "kΩ": 1000.0,
    "mohm": 1e6, "MΩ": 1e6,
}

# Capacitance → farad
_CAP: Dict[str, float] = {
    "f": 1.0, "farad": 1.0,
    "uf": 1e-6, "µf": 1e-6, "microfarad": 1e-6,
    "nf": 1e-9, "nanofarad": 1e-9,
    "pf": 1e-12, "picofarad": 1e-12,
}

# Inductance → henry
_IND: Dict[str, float] = {
    "h": 1.0, "henry": 1.0,
    "mh": 0.001, "millihenry": 0.001,
    "uh": 1e-6, "µh": 1e-6, "microhenry": 1e-6,
}

# Radiation dose → gray
_DOSE: Dict[str, float] = {
    "gy": 1.0, "gray": 1.0,
    "rad": 0.01,  # radiation absorbed dose
    "sv": 1.0, "sievert": 1.0,
    "rem": 0.01,
}

# Catalog of categories
_CATEGORIES: Dict[str, Dict[str, float]] = {
    "length": _LENGTH,
    "area": _AREA,
    "volume": _VOLUME,
    "mass": _MASS,
    "time": _TIME,
    "speed": _SPEED,
    "acceleration": _ACCEL,
    "force": _FORCE,
    "pressure": _PRESSURE,
    "energy": _ENERGY,
    "power": _POWER,
    "angle": _ANGLE,
    "data": _DATA,
    "frequency": _FREQ,
    "density": _DENSITY,
    "viscosity": _VISCOSITY,
    "illuminance": _ILLUM,
    "magnetic": _MAG,
    "charge": _CHARGE,
    "voltage": _VOLT,
    "current": _CURRENT,
    "resistance": _RESIST,
    "capacitance": _CAP,
    "inductance": _IND,
    "dose": _DOSE,
}

# Build reverse lookup: unit → (category, factor)
_UNIT_INDEX: Dict[str, Tuple[str, float]] = {}
for cat, mapping in _CATEGORIES.items():
    for unit, factor in mapping.items():
        key = unit.lower().replace(" ", "_")
        if key not in _UNIT_INDEX:  # first wins on conflicts
            _UNIT_INDEX[key] = (cat, factor)

# Temperature keys
_TEMP_KEYS = {k.lower() for k in _TEMP}


def _normalize(unit: str) -> str:
    return unit.strip().lower().replace(" ", "_").replace("²", "2").replace("³", "3")


def convert(value: float, from_unit: str, to_unit: str) -> float:
    """
    Convert *value* from *from_unit* to *to_unit*.
    Raises ValueError on unknown units or incompatible categories.
    """
    value = float(value)
    src = _normalize(from_unit)
    dst = _normalize(to_unit)

    # Temperature special path
    if src in _TEMP_KEYS and dst in _TEMP_KEYS:
        s_scale, s_off = _TEMP[src]
        d_scale, d_off = _TEMP[dst]
        kelvin = value * s_scale + s_off
        return (kelvin - d_off) / d_scale

    if src not in _UNIT_INDEX:
        raise ValueError(f"Unknown unit: {from_unit}")
    if dst not in _UNIT_INDEX:
        raise ValueError(f"Unknown unit: {to_unit}")

    cat_s, fac_s = _UNIT_INDEX[src]
    cat_d, fac_d = _UNIT_INDEX[dst]
    if cat_s != cat_d:
        raise ValueError(f"Incompatible units: {from_unit} ({cat_s}) vs {to_unit} ({cat_d})")

    # Special: l/100km is inverse fuel economy
    if src in ("l/100km",) or dst in ("l/100km",):
        # convert via km/l intermediate
        # value in l/100km → km/l = 100 / value
        if src == "l/100km":
            base = (100.0 / value) * 1e6  # to m/m³
        else:
            base = value * fac_s
        if dst == "l/100km":
            km_per_l = base / 1e6
            return 100.0 / km_per_l
        return base / fac_d

    base = value * fac_s
    return base / fac_d


def list_units(category: Optional[str] = None) -> List[str]:
    """Return sorted unit names, optionally filtered by category."""
    if category is None:
        units = set(_UNIT_INDEX.keys()) | _TEMP_KEYS
        return sorted(units)
    cat = category.lower()
    if cat == "temperature":
        return sorted(_TEMP_KEYS)
    if cat not in _CATEGORIES:
        raise ValueError(f"Unknown category: {category}. Try: {', '.join(sorted(_CATEGORIES))}")
    return sorted(_CATEGORIES[cat].keys())


def list_categories() -> List[str]:
    return sorted(list(_CATEGORIES.keys()) + ["temperature"])


def unit_info(unit: str) -> str:
    u = _normalize(unit)
    if u in _TEMP_KEYS:
        return f"{unit} → temperature"
    if u in _UNIT_INDEX:
        cat, fac = _UNIT_INDEX[u]
        return f"{unit} → {cat} (factor {fac} to base)"
    raise ValueError(f"Unknown unit: {unit}")


def count_units() -> int:
    return len(set(_UNIT_INDEX.keys()) | _TEMP_KEYS)


# Alias for terminal convenience
def units(category: Optional[str] = None) -> List[str]:
    return list_units(category)
