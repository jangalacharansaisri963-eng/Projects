import random
from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.popup import Popup

class MenuScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(name='menu', **kwargs)
        layout = BoxLayout(orientation='vertical', padding=40, spacing=20)
        
        # Game Title matching your configuration
        title = Label(text="Tic Tac Toe", font_size='36sp', size_hint_y=0.3, bold=True)
        layout.add_widget(title)
        
        subtitle = Label(text="Select Difficulty to Start", font_size='18sp', size_hint_y=0.1)
        layout.add_widget(subtitle)
        
        btn_layout = BoxLayout(orientation='vertical', spacing=15, size_hint_y=0.6)
        
        easy_btn = Button(text="Easy Mode", font_size='20sp', background_normal='', background_color=(0.18, 0.67, 0.38, 1))
        med_btn = Button(text="Medium Mode", font_size='20sp', background_normal='', background_color=(0.15, 0.60, 0.35, 1))
        hard_btn = Button(text="Hard Mode (Tryhard)", font_size='20sp', background_normal='', background_color=(0.12, 0.52, 0.30, 1))
        
        easy_btn.bind(on_press=lambda x: self.start_game('easy'))
        med_btn.bind(on_press=lambda x: self.start_game('medium'))
        hard_btn.bind(on_press=lambda x: self.start_game('hard'))
        
        btn_layout.add_widget(easy_btn)
        btn_layout.add_widget(med_btn)
        btn_layout.add_widget(hard_btn)
        
        layout.add_widget(btn_layout)
        self.add_widget(layout)

    def start_game(self, difficulty):
        game_screen = self.manager.get_screen('game')
        game_screen.set_difficulty(difficulty)
        self.manager.current = 'game'


class GameScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(name='game', **kwargs)
        self.difficulty = 'easy'
        self.board = [""] * 9
        self.human = "X"
        self.ai = "O"
        
        self.layout = BoxLayout(orientation='vertical', padding=10, spacing=5)
        
        self.status_label = Label(text="Your Turn (X)", font_size='22sp', size_hint_y=0.1)
        self.layout.add_widget(self.status_label)
        
        self.grid = GridLayout(cols=3, spacing=5, padding=5)
        self.buttons = []
        for i in range(9):
            btn = Button(text="", font_size='40sp', background_normal='', background_color=(0.2, 0.2, 0.2, 1))
            btn.bind(on_press=lambda instance, idx=i: self.human_move(idx))
            self.grid.add_widget(btn)
            self.buttons.append(btn)
        self.layout.add_widget(self.grid)
        
        home_btn = Button(text="Quit to Home", size_hint_y=0.1, background_normal='', background_color=(0.7, 0.2, 0.2, 1))
        home_btn.bind(on_press=self.go_home)
        self.layout.add_widget(home_btn)
        
        self.add_widget(self.layout)

    def set_difficulty(self, diff):
        self.difficulty = diff
        self.reset_game()

    def human_move(self, index):
        if self.board[index] != "" or self.check_winner(self.board):
            return
            
        self.make_move(index, self.human)
        
        if self.handle_game_end():
            return
            
        self.status_label.text = "AI thinking..."
        self.ai_move()

    def ai_move(self):
        available_moves = [i for i, val in enumerate(self.board) if val == ""]
        if not available_moves:
            return

        move = None
        if self.difficulty == 'easy':
            move = random.choice(available_moves)
        elif self.difficulty == 'medium':
            if random.random() < 0.5:
                move = self.get_best_move()
            else:
                move = random.choice(available_moves)
        elif self.difficulty == 'hard':
            move = self.get_best_move()

        if move is not None:
            self.make_move(move, self.ai)
            self.handle_game_end()

    def make_move(self, index, player):
        self.board[index] = player
        self.buttons[index].text = player
        if player == self.human:
            self.buttons[index].background_color = (0.3, 0.5, 0.9, 1)
            self.status_label.text = "AI's Turn (O)"
        else:
            self.buttons[index].background_color = (0.9, 0.6, 0.2, 1)
            self.status_label.text = "Your Turn (X)"

    def get_best_move(self):
        best_score = -float('inf')
        move = None
        for i in range(9):
            if self.board[i] == "":
                self.board[i] = self.ai
                score = self.minimax(self.board, 0, False)
                self.board[i] = ""
                if score > best_score:
                    best_score = score
                    move = i
        return move

    def minimax(self, board, depth, is_maximizing):
        winner = self.check_winner(board)
        if winner == self.ai: return 10 - depth
        if winner == self.human: return depth - 10
        if "" not in board: return 0

        if is_maximizing:
            best_score = -float('inf')
            for i in range(9):
                if board[i] == "":
                    board[i] = self.ai
                    score = self.minimax(board, depth + 1, False)
                    board[i] = ""
                    best_score = max(score, best_score)
            return best_score
        else:
            best_score = float('inf')
            for i in range(9):
                if board[i] == "":
                    board[i] = self.human
                    score = self.minimax(board, depth + 1, True)
                    board[i] = ""
                    best_score = min(score, best_score)
            return best_score

    def check_winner(self, board):
        win_states = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        for win in win_states:
            if board[win[0]] == board[win[1]] == board[win[2]] != "":
                return board[win[0]]
        return None

    def handle_game_end(self):
        winner = self.check_winner(self.board)
        if winner:
            msg = "You Won!" if winner == self.human else "The AI Beats You!"
            self.show_end_popup(msg)
            return True
        elif "" not in self.board:
            self.show_end_popup("It's a Draw Game!")
            return True
        return False

    def show_end_popup(self, message):
        content = BoxLayout(orientation='vertical', padding=15, spacing=10)
        lbl = Label(text=message, font_size='20sp')
        btn = Button(text="Return to Main Menu", size_hint_y=0.4, background_normal='', background_color=(0.18, 0.67, 0.38, 1))
        
        content.add_widget(lbl)
        content.add_widget(btn)
        
        popup = Popup(title="Game Over", content=content, size_hint=(0.8, 0.4), auto_dismiss=False)
        btn.bind(on_press=lambda x: (popup.dismiss(), self.go_home()))
        popup.open()

    def go_home(self, *args):
        self.manager.current = 'menu'

    def reset_game(self):
        self.board = [""] * 9
        self.status_label.text = "Your Turn (X)"
        for btn in self.buttons:
            btn.text = ""
            btn.background_color = (0.2, 0.2, 0.2, 1)


class TicTacToeApp(App):
    def build(self):
        # Setting application window parameters to match your identity strings
        self.title = "Tic Tac Toe"
        sm = ScreenManager()
        sm.add_widget(MenuScreen())
        sm.add_widget(GameScreen())
        return sm

if __name__ == "__main__":
    TicTacToeApp().run()
        
