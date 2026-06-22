[app]

# App name
title = Advanced Calculator

# Package name (no spaces)
package.name = advancedcalculator

# Package domain
package.domain = org.example

# App version (required)
version = 1.0


# Location of main.py
source.dir = .


# Files included in build
source.include_exts = py,png,jpg,kv


# Python dependencies
requirements = python3,kivy


# Phone settings
orientation = portrait

fullscreen = 0



[buildozer]

# Log level
log_level = 2



[android]

# Android architecture
android.archs = arm64-v8a

# Minimum Android version
android.minapi = 21

# Target Android version
android.api = 35

# AndroidX support
android.enable_androidx = True
