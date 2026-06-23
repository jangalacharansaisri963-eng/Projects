[app]

title = Advanced Calculator

package.name = advancedcalculator

package.domain = org.example


source.dir = .

source.include_exts = py,png,jpg,kv,json


version = 1.0


requirements = python3,kivy,sympy==1.13.1


orientation = portrait

fullscreen = 0


# Android settings

android.api = 35

android.minapi = 23

android.build_tools_version = 35.0.0

android.ndk = 25c


android.archs = arm64-v8a,armeabi-v7a


# Avoid weird SDK auto choices

android.accept_sdk_license = True


# App icon later if needed
# icon.filename = %(source.dir)s/icon.png



[buildozer]

log_level = 2

warn_on_root = 1
