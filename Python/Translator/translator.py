import base64
import re
import pyperclip

# --- CHECK CLIPBOARD AVAILABILITY ---
try:
    pyperclip.paste()
    CLIPBOARD_AVAILABLE = True
except Exception:
    CLIPBOARD_AVAILABLE = False
# ------------------------------------

from deep_translator import GoogleTranslator

# -----------------------------
# LANGUAGE CODES
# -----------------------------
def get_lang_code(target):
    mapping = {
        "english": "en", "spanish": "es", "french": "fr", "german": "de", 
        "italian": "it", "portuguese": "pt", "dutch": "nl", "swedish": "sv", 
        "norwegian": "no", "danish": "da", "finnish": "fi", "polish": "pl", 
        "czech": "cs", "slovak": "sk", "romanian": "ro", "hungarian": "hu", 
        "croatian": "hr", "slovenian": "sl", "albanian": "sq", "estonian": "et", 
        "latvian": "lv", "lithuanian": "lt", "turkish": "tr", "indonesian": "id", 
        "malay": "ms", "filipino": "tl", "vietnamese": "vi", "irish": "ga", 
        "welsh": "cy", "afrikaans": "af", "swahili": "sw", "latin": "la",
        "japanese": "ja", "chinese": "zh-CN", "hindi": "hi", "telugu": "te"
    }
    return mapping.get(target)


# -----------------------------
# MAIN TERMINAL
# -----------------------------
def run_translator():

    print("--- Translator CLI Terminal v4.0 ---")
    print("Supported Languages:")
    print("ENGLISH, SPANISH, FRENCH, GERMAN, ITALIAN, PORTUGUESE, DUTCH")
    print("SWEDISH, NORWEGIAN, DANISH, FINNISH, POLISH, CZECH, SLOVAK")
    print("ROMANIAN, HUNGARIAN, CROATIAN, SLOVENIAN, ALBANIAN, ESTONIAN")
    print("LATVIAN, LITHUANIAN, TURKISH, INDONESIAN, MALAY, FILIPINO")
    print("VIETNAMESE, IRISH, WELSH, AFRIKAANS, SWAHILI, LATIN, JAPANESE, CHINESE")
    print("HINDI, TELUGU")
    print("\nOperations:")
    print("  Forward: [text] (func translate to [target])")
    print("  Reverse: [payload] (func decode from [target])")
    print("  Supported Encoders: BINARY, HEX, OCTAL, ASCII, BASE64")
    print("\nCommands:")
    print("  (func copy)  -> Copy latest output")
    print("  (func paste) -> Show clipboard")
    
    if not CLIPBOARD_AVAILABLE:
        print("\n[!] System clipboard unavailable. Clipboard tools disabled.")

    last_result = ""

    while True:

        try:
            # Set the user typing prefix to a single dollar sign
            cmd = input("\n$ ").strip()

            if cmd.lower() in ("exit", "quit"):
                break

            if cmd.lower() == "clear":
                print("\n" * 100)
                continue

            if cmd.lower() == "(func copy)":
                if not CLIPBOARD_AVAILABLE:
                    print("Translator: Clipboard operations not supported on this device.")
                elif last_result:
                    pyperclip.copy(last_result)
                    print("Translator: Copied to clipboard.")
                else:
                    print("Translator: Nothing to copy.")
                continue

            if cmd.lower() == "(func paste)":
                if not CLIPBOARD_AVAILABLE:
                    print("Translator: Clipboard operations not supported on this device.")
                else:
                    try:
                        pasted = pyperclip.paste()
                        print(f"Translator: Clipboard content: {pasted}")
                    except Exception as e:
                        print(f"Translator: Clipboard Error: {e}")
                continue

            # -------------------------------------------------------------
            # REVERSE DECODER PROCESSING
            # -------------------------------------------------------------
            decode_match = re.search(r"(.*)\(func decode from (.*)\)", cmd)
            if decode_match:
                payload = decode_match.group(1).strip()
                target = decode_match.group(2).strip().lower()
                decoded_str = ""

                if target == "binary":
                    byte_elements = payload.split()
                    decoded_bytes = bytes(int(b, 2) for b in byte_elements)
                    decoded_str = decoded_bytes.decode("utf-8")

                elif target == "hex":
                    byte_elements = payload.split()
                    decoded_bytes = bytes(int(h, 16) for h in byte_elements)
                    decoded_str = decoded_bytes.decode("utf-8")

                elif target == "octal":
                    byte_elements = payload.split()
                    decoded_bytes = bytes(int(o, 8) for o in byte_elements)
                    decoded_str = decoded_bytes.decode("utf-8")

                elif target == "ascii":
                    byte_elements = payload.split()
                    decoded_bytes = bytes(int(a) for a in byte_elements)
                    decoded_str = decoded_bytes.decode("utf-8")

                elif target == "base64":
                    decoded_str = base64.b64decode(payload.encode("utf-8")).decode("utf-8")
                else:
                    decoded_str = f"Unknown target decoder '{target}'"

                last_result = decoded_str
                print(f"Translator: {decoded_str}")
                continue

            # -------------------------------------------------------------
            # FORWARD ENCODER & TRANSLATION PROCESSING
            # -------------------------------------------------------------
            translate_match = re.search(r"(.*)\(func translate to (.*)\)", cmd)
            if not translate_match:
                print("Translator: Syntax Error. Use [text] (func translate to [target]) or (func decode from [target])")
                continue

            # FIXED: Removed the buggy '.strip_match =' assignment pattern 
            payload = translate_match.group(1).strip()
            target = translate_match.group(2).strip().lower()

            payload_bytes = payload.encode("utf-8")

            # Encoders
            if target == "binary":
                result = " ".join(format(b, "08b") for b in payload_bytes)
            elif target == "hex":
                result = " ".join(format(b, "02X") for b in payload_bytes)
            elif target == "octal":
                result = " ".join(format(b, "03o") for b in payload_bytes)
            elif target == "ascii":
                result = " ".join(str(b) for b in payload_bytes)
            elif target == "base64":
                result = base64.b64encode(payload_bytes).decode("utf-8")

            # Translation
            else:
                lang = get_lang_code(target)
                if lang:
                    result = GoogleTranslator(source="auto", target=lang).translate(payload)
                else:
                    result = f"Unknown target language or encoder '{target}'"

            last_result = result
            print(f"Translator: {result}")

        except Exception as e:
            print(f"Translator: Error - {e}")


if __name__ == "__main__":
    run_translator()
    
