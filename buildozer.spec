[app]

title = Advanced Calculator

package.name = advancedcalculator

package.domain = org.example

source.dir = .

source.include_exts = py,png,jpg,kv

version = 1.0

requirements = python3,kivy,sympy

orientation = portrait

fullscreen = 0


[buildozer]

log_level = 2


[app:android]

android.api = 35

android.minapi = 23

android.build_tools_version = 35.0.0

android.archs = arm64-v8a, armeabi-v7a
