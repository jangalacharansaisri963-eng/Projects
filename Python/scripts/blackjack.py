# ==========================================
# BLACKJACK TERMINAL GAME
# Version 1.0
# ==========================================

import random


def create_deck():
    cards = [
        "A", "2", "3", "4", "5", "6",
        "7", "8", "9", "10",
        "J", "Q", "K"
    ]

    deck = cards * 4
    random.shuffle(deck)

    return deck


def card_value(card):
    if card in ["J", "Q", "K"]:
        return 10

    if card == "A":
        return 11

    return int(card)


def calculate_score(cards):
    score = sum(card_value(card) for card in cards)

    # Handle Ace
    if "A" in cards and score > 21:
        score -= 10

    return score


def show_cards(player, dealer):
    print("\nYour cards:", player)
    print("Your score:", calculate_score(player))

    print("\nDealer cards:", dealer)


def blackjack_game():

    deck = create_deck()

    player_cards = [
        deck.pop(),
        deck.pop()
    ]

    dealer_cards = [
        deck.pop(),
        deck.pop()
    ]


    while True:

        show_cards(player_cards, [dealer_cards[0], "?"])

        player_score = calculate_score(player_cards)

        if player_score > 21:
            print("\nYou busted!")
            print("Dealer wins!")
            return

        if player_score == 21:
            print("\nBlackjack!")
            break


        choice = input("\nHit or Stand? (h/s): ").lower()

        if choice == "h":
            player_cards.append(deck.pop())

        elif choice == "s":
            break

        else:
            print("Invalid choice!")


    # Dealer turn
    while calculate_score(dealer_cards) < 17:
        dealer_cards.append(deck.pop())


    player_score = calculate_score(player_cards)
    dealer_score = calculate_score(dealer_cards)


    print("\n========== FINAL ==========")

    print("Your cards:", player_cards)
    print("Your score:", player_score)

    print("\nDealer cards:", dealer_cards)
    print("Dealer score:", dealer_score)


    if dealer_score > 21:
        print("\nDealer busted!")
        print("You win!")

    elif player_score > dealer_score:
        print("\nYou win!")

    elif player_score < dealer_score:
        print("\nDealer wins!")

    else:
        print("\nDraw!")


print("=" * 45)
print("          BLACKJACK TERMINAL")
print("             Version 1.0")
print("=" * 45)


while True:

    blackjack_game()

    again = input("\nPlay again? (y/n): ").lower()

    if again != "y":
        print("\nThanks for playing Blackjack!")
        break