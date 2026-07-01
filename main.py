import os
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.popup import Popup
from kivy.filechooser import FileChooserListView

def generate_key(password):
    return sum(ord(char) for char in password) % 256

def transform_data(data, key, mode='encrypt'):
    output = bytearray()
    for index, byte in enumerate(data):
        position_salt = (index * 7) % 256
        if mode == 'encrypt':
            new_byte = (byte + key + position_salt) % 256
        else:
            new_byte = (byte - key - position_salt) % 256
        output.append(new_byte)
    return output

class CryptoLayout(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = 32
        self.spacing = 20
        self.selected_file_path = ""

        # Title Header
        self.add_widget(Label(
            text="=== SYSTEM VAULT PROTOCOL ===",
            color=(0, 1, 0, 1),
            font_size='18sp',
            size_hint_y=None,
            height=40
        ))

        # File Selection Tracker Display
        self.file_label = Label(
            text="NO TARGET FILE SELECTED",
            color=(1, 1, 0, 1),
            font_size='14sp',
            size_hint_y=None,
            height=30
        )
        self.add_widget(self.file_label)

        # Browse Launcher Button
        self.browse_btn = Button(
            text="[ LAUNCH_FILE_BROWSER ]",
            color=(0, 0, 0, 1),
            background_color=(0, 1, 0, 1),
            background_normal='',
            size_hint_y=None,
            height=50
        )
        self.browse_btn.bind(on_press=self.open_file_chooser)
        self.add_widget(self.browse_btn)

        # Password Access Layout Row Container
        pass_row = BoxLayout(orientation='horizontal', size_hint_y=None, height=50, spacing=10)
        pass_row.add_widget(Label(text="ACCESS_KEY:", color=(0, 1, 0, 1), size_hint_x=0.3))
        
        self.pass_entry = TextInput(
            hint_text="enter secret phrase",
            password=True,
            multiline=False,
            background_color=(0.06, 0.06, 0.06, 1),
            foreground_color=(0, 1, 0, 1),
            cursor_color=(0, 1, 0, 1),
            hint_text_color=(0, 0.5, 0, 0.5)
        )
        pass_row.add_widget(self.pass_entry)
        self.add_widget(pass_row)

        # Action Buttons Execution Row
        btn_row = BoxLayout(orientation='horizontal', size_hint_y=None, height=60, spacing=15)
        
        encrypt_btn = Button(
            text="[ ENCRYPT ]",
            color=(0, 0, 0, 1),
            background_color=(0, 1, 0, 1),
            background_normal=''
        )
        encrypt_btn.bind(on_press=lambda x: self.execute_cipher('encrypt'))
        
        decrypt_btn = Button(
            text="[ DECRYPT ]",
            color=(0, 1, 0, 1),
            background_color=(0, 0, 0, 1),
            background_normal='',
            border=(2, 2, 2, 2)
        )
        decrypt_btn.bind(on_press=lambda x: self.execute_cipher('decrypt'))

        btn_row.add_widget(encrypt_btn)
        btn_row.add_widget(decrypt_btn)
        self.add_widget(btn_row)

    def open_file_chooser(self, instance):
        box = BoxLayout(orientation='vertical')
        file_chooser = FileChooserListView(path="/sdcard" if os.path.exists("/sdcard") else ".")
        box.add_widget(file_chooser)
        
        select_btn = Button(text="[ CONFIRM_SELECTION ]", size_hint_y=None, height=50, color=(0,0,0,1), background_color=(0,1,0,1), background_normal='')
        box.add_widget(select_btn)
        
        popup = Popup(title="Select Target File Deck", content=box, size_hint=(0.9, 0.9))
        
        def confirm(obj):
            if file_chooser.selection:
                self.selected_file_path = file_chooser.selection[0]
                self.file_label.text = f"TARGET: {os.path.basename(self.selected_file_path)}"
                self.file_label.color = (0, 1, 0, 1)
            popup.dismiss()
            
        select_btn.bind(on_press=confirm)
        popup.open()

    def execute_cipher(self, mode):
        password = self.pass_entry.text.strip()
        if not self.selected_file_path:
            self.show_popup("ERROR", "No target workspace file selected.")
            return
        if not password:
            self.show_popup("ERROR", "Access signature key empty.")
            return

        try:
            with open(self.selected_file_path, 'rb') as f:
                file_data = f.read()

            key = generate_key(password)
            processed_data = transform_data(file_data, key, mode)

            if mode == 'encrypt' and not self.selected_file_path.endswith('.enc'):
                output_path = self.selected_file_path + '.enc'
            elif mode == 'decrypt' and self.selected_file_path.endswith('.enc'):
                output_path = self.selected_file_path[:-4]
            else:
                output_path = self.selected_file_path + ('.dec' if mode == 'decrypt' else '.enc')

            with open(output_path, 'wb') as f:
                f.write(processed_data)

            self.show_popup("SUCCESS", f"File processed!\nSaved as: {os.path.basename(output_path)}")
            self.pass_entry.text = ""
        except Exception as e:
            self.show_popup("CRASH", f"Failure: {str(e)}")

    def show_popup(self, title, message):
        lbl = Label(text=message, halign="center", valign="middle")
        lbl.bind(size=lambda s, w: setattr(lbl, 'text_size', w))
        popup = Popup(title=title, content=lbl, size_hint=(0.8, 0.4))
        popup.open()

class CryptographicVaultApp(App):
    def build(self):
        # Set canvas window global style to dark black
        from kivy.core.window import Window
        Window.clearcolor = (0, 0, 0, 1)
        return CryptoLayout()

if __name__ == "__main__":
    CryptographicVaultApp().run()
    
