// Game modes stored in a constant
const WAITING_FOR_NUM_PLAYERS = "waiting for num of players";
const WAITING_FOR_NAME = "waiting for username";
const INSTRUCTIONS = "tell player instructions";
const ASK_FOR_BET = "ask player for betting amount";
const TAKE_BET = "take user's bet";
const DEAL_CARDS = "deal cards";
const SELECT_PLAYER = "select player and check for blackjack";
const PLAYER_ACTION = "player hits or stands";
const CHANGE_ACE_MODE = "change ace mode";
const COMPUTER_CALCULATES = "computer calculates";
const FINAL_RESULT = "final result";

// Declare user inputs as a constant
const INPUT_HIT = "hit";
const INPUT_STAND = "stand";
const INPUT_CHANGE_ACE = "ace";
const POSITION = "position";
const ACE_ONE = "ace 1";
const ACE_ELEVEN = "ace 11";

// Global variables
var allPlayerOutcomes = [];
var allPlayerCards = [];
var playerCards = [];
var computerCards = [];
var cardDeck = [];
var shuffledDeck;
var createDeck;
var playerPoints = 0;
var computerPoints = 0;
var aceIndex = 0;
var aceValue = 0;
var aceCounter = 0;
var userName = [];
var bankRoll = [];
var userBet = [];
var numPlayers = 0;
var stringNames = "";
var stringBet = "";
var currentPlayer = 0;

// Current game mode
var gameMode = WAITING_FOR_NUM_PLAYERS;

// Create a deck of cards
var makeDeck = function () {
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  var emojiSuits = ["♥️", "♦️", "♣️", "♠️"];
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    var currentEmojiSuit = emojiSuits[suitIndex];
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // Create new object attribute for cards to represent their value
      var cardValue = rankCounter;
      if (rankCounter == 1) {
        // Set ace to be 11 points, so that blackjack condition can be fulfilled. Player can change value later
        cardValue = 11;
      } else if (rankCounter == 11 || rankCounter == 12 || rankCounter == 13) {
        cardValue = 10;
      }
      var cardName = rankCounter;
      if (cardName == 1) {
        cardName = "Ace";
      } else if (cardName == 11) {
        cardName = "Jack";
      } else if (cardName == 12) {
        cardName = "Queen";
      } else if (cardName == 13) {
        cardName = "King";
      }
      var card = {
        name: cardName,
        suit: currentSuit,
        emojiSuit: currentEmojiSuit,
        rank: rankCounter,
        value: cardValue,
      };
      cardDeck.push(card);
      rankCounter += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};

var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Shuffle deck of cards
var shuffleDeck = function (cardDeck) {
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[currentIndex];
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cardDeck;
};

// Deal a card to player and computer, repeat twice
var dealCards = function () {
  for (var playerCounter = 0; playerCounter < numPlayers; playerCounter += 1) {
    playerCards.push(shuffledDeck.pop());
    playerCards.push(shuffledDeck.pop());
    allPlayerCards.push(playerCards);
    playerCards = [];
  }
  computerCards.push(shuffledDeck.pop());
  computerCards.push(shuffledDeck.pop());
  // Add computer scores for first two cards
  computerPoints = computerCards[0].value + computerCards[1].value;
  return `The cards have been shuffled! <br> Click submit to see your cards!`;
};

var selectPlayer = function () {
  // Add player scores for first two cards
  // Use global value 'currentPlayer' to change index and hence player's cards that are being accessed in main array when it's subsequent player's turn
  playerPoints =
    allPlayerCards[currentPlayer][0].value +
    allPlayerCards[currentPlayer][1].value;
  if (
    // If player gets blackjack, declare winner and reset game
    playerPoints == 21 &&
    computerPoints != 21
  ) {
    // Update points
    bankRoll[currentPlayer] =
      bankRoll[currentPlayer] + userBet[currentPlayer] * 1.5;
    allPlayerOutcomes.push("win");
    gameMode = SELECT_PLAYER;
    playerPoints = 0;
    currentPlayer += 1;
    return `${userName[currentPlayer]}! <br>YOU HAVE GOTTEN BLACKJACK AND WIN! 🥳 <br><br> Your cards: <br>${allPlayerCards[currentPlayer][0].name} of ${allPlayerCards[currentPlayer][0].emojiSuit} <br>${allPlayerCards[currentPlayer][1].name} of ${allPlayerCards[currentPlayer][1].emojiSuit} <br><br> Your bank $${bankRoll[currentPlayer]} <br><br> Time for the next player! `;
  } else if (
    // If both get blackjack, declare draw and reset game
    playerPoints == 21 &&
    computerPoints == 21
  ) {
    bankRoll[currentPlayer] = bankRoll[currentPlayer] - userBet[currentPlayer];
    allPlayerOutcomes.push("draw");
    gameMode = SELECT_PLAYER;
    playerPoints = 0;
    currentPlayer += 1;
    return `${userName[currentPlayer]}!<br> You both drew blackjacks! Its a draw! 😐 <br><br> Your cards: <br>${allPlayerCards[currentPlayer][0].name} of ${allPlayerCards[currentPlayer][0].emojiSuit} <br>${allPlayerCards[currentPlayer][1].name} of ${allPlayerCards[currentPlayer][1].emojiSuit} <br><br> Your bank $${bankRoll[currentPlayer]} <br><br> Time for the next player!`;
  } else if (playerPoints > 21) {
    gameMode = PLAYER_ACTION;
    return `${userName[currentPlayer]}, you will bust and lose unless you change your ace card's value! <br><br> Type 'ace' to change its value.<br><br> Your cards: <br>${allPlayerCards[currentPlayer][0].name} of ${allPlayerCards[currentPlayer][0].emojiSuit} <br>${allPlayerCards[currentPlayer][1].name} of ${allPlayerCards[currentPlayer][1].emojiSuit}  <br> Your points: ${playerPoints}`;
  } else {
    gameMode = PLAYER_ACTION;
    // Otherwise inform player of current cards and ask if they want to hit, stand or change ace value
    return `${userName[currentPlayer]}, your cards are: <br>${allPlayerCards[currentPlayer][0].name} of ${allPlayerCards[currentPlayer][0].emojiSuit} <br>${allPlayerCards[currentPlayer][1].name} of ${allPlayerCards[currentPlayer][1].emojiSuit}  <br> Your points: ${playerPoints} <br><br> Please enter 'hit' if you would like more cards <br><br> Please enter 'stand' if you do not want anymore cards <br><br> Please enter 'ace' if you would like to change the value of an ace card`;
  }
};

// If player wants to change ace value, ensure they are selecting ace card in array, otherwise inform them of this condition
var checkForAce = function (input) {
  if (gameMode == CHANGE_ACE_MODE) {
    aceIndex = Number(input) - 1;
    if (allPlayerCards[currentPlayer][aceIndex].name != "Ace") {
      gameMode = PLAYER_ACTION;
      // Run while loop to output all player card names and suits in output statement
      var aceInvalidOutput = `${userName[currentPlayer]}, you can only change the value of aces. <br><br> Your cards are: `;
      aceCounter = 0;
      while (aceCounter < allPlayerCards[currentPlayer].length) {
        aceInvalidOutput =
          aceInvalidOutput +
          `<br> ${allPlayerCards[currentPlayer][aceCounter].name} of ${allPlayerCards[currentPlayer][aceCounter].emojiSuit}`;
        aceCounter += 1;
      }
      return (
        aceInvalidOutput +
        `<br> Your points: ${playerPoints}<br><br> Please enter 'hit' if you would like more cards <br><br> Please enter 'stand' if you do not want anymore cards <br><br> Please enter 'ace' if you would like to change the value of an ace card`
      );
      // If player selects ace card in their array, switch mode and allow them to change ace value
    } else if (allPlayerCards[currentPlayer][aceIndex].name == "Ace") {
      gameMode = PLAYER_ACTION;
      return `${userName[currentPlayer]}, you have chosen to change the value of the ace card in positon: ${input} <br> Please type either 'ace 1' or 'ace 11' to change the value`;
    }
  }
};

// If ace card is correctly selected, allow user to enter string to change ace value
var changeAceValue = function (input) {
  if (input == ACE_ELEVEN) {
    aceValue = Number(11);
    playerPoints = playerPoints + 10;
  } else if (input == ACE_ONE) {
    aceValue = Number(1);
    playerPoints = playerPoints - 10;
  }
  allPlayerCards[currentPlayer][aceIndex].value = aceValue;
  gameMode = PLAYER_ACTION;
  // Run while loop to output all player card names and suits in output statement
  var aceChangeOutput = `${userName[currentPlayer]}, you have changed the value of ${allPlayerCards[currentPlayer][aceIndex].name} of ${allPlayerCards[currentPlayer][aceIndex].emojiSuit} to ${aceValue}. <br><br> Your cards are: `;
  aceCounter = 0;
  while (aceCounter < allPlayerCards[currentPlayer].length) {
    aceChangeOutput =
      aceChangeOutput +
      `<br> ${allPlayerCards[currentPlayer][aceCounter].name} of ${allPlayerCards[currentPlayer][aceCounter].emojiSuit}`;
    aceCounter += 1;
  }
  return (
    aceChangeOutput +
    `<br> Your points: ${playerPoints}<br><br> Please enter 'hit' if you would like more cards <br><br> Please enter 'stand' if you do not want anymore cards <br><br> Please enter 'ace' if you would like to change the value of an ace card`
  );
};

// Allow player to draw extra card
var playerDrawsExtraCard = function () {
  allPlayerCards[currentPlayer].push(shuffledDeck.pop());
  var playerCardMessage = `Your cards are: `;
  var endMessage = "";
  // Update player points
  playerCounter = allPlayerCards[currentPlayer].length - 1;
  while (playerCounter < allPlayerCards[currentPlayer].length) {
    playerPoints =
      playerPoints + allPlayerCards[currentPlayer][playerCounter].value;
    endMessage = `<br> Your points: ${playerPoints}<br><br> Please enter 'hit' if you would like more cards <br><br> Please enter 'stand' if you do not want anymore cards <br><br> Please enter 'ace' if you would like to change the value of an ace card`;
    playerCounter += 1;
  }
  // Run while loop to output all player card names and suits in output statement
  aceCounter = 0;
  while (aceCounter < allPlayerCards[currentPlayer].length) {
    playerCardMessage =
      playerCardMessage +
      `<br> ${allPlayerCards[currentPlayer][aceCounter].name} of ${allPlayerCards[currentPlayer][aceCounter].emojiSuit}`;
    aceCounter += 1;
  }
  // If player busts, output results and reset game
  if (playerPoints > 21) {
    // However, if player draws ace, allow them to change value
    counter = allPlayerCards[currentPlayer].length - 1;
    while (counter < allPlayerCards[currentPlayer].length) {
      if (allPlayerCards[currentPlayer][counter].name == "Ace") {
        gameMode = PLAYER_ACTION;
        return `${userName[currentPlayer]}, you will bust and lose unless you change your ace card's value! <br><br> Type 'ace' to change its value.<br><br> ${playerCardMessage}`;
      }
      counter += 1;
    }
    // Also, if player busts and has an ace with value 11, allow them to change value
    secondCounter = 0;
    while (secondCounter < allPlayerCards[currentPlayer].length) {
      if (
        allPlayerCards[currentPlayer][secondCounter].name == "Ace" &&
        allPlayerCards[currentPlayer][secondCounter].value == 11
      ) {
        gameMode = PLAYER_ACTION;
        return `${userName[currentPlayer]}, you will bust and lose unless you change your ace card's value! <br><br> Type 'ace' to change its value.<br><br> ${playerCardMessage}`;
      }
      secondCounter += 1;
    }
    allPlayerOutcomes.push("lose");
    bankRoll[currentPlayer] = bankRoll[currentPlayer] - userBet[currentPlayer];
    playerPoints = 0;
    currentPlayer += 1;
    gameMode = SELECT_PLAYER;
    return `${userName[currentPlayer]}, you've bust and lost! 😭 <br><br>  ${playerCardMessage} <br> Your points: ${playerPoints}<br><br> Click submit to start a new game!<br><br> Your bank $${bankRoll[currentPlayer]} `;
  }
  // If player gets blackjack, output results and reset game
  if (playerPoints == 21) {
    bankRoll[currentPlayer] = bankRoll[currentPlayer] + userBet[currentPlayer];
    allPlayerOutcomes.push("win");
    playerPoints = 0;
    currentPlayer += 1;
    gameMode = SELECT_PLAYER;
    return `${userName[currentPlayer]}, you've gotten blackjack and won! 🥳 <br><br>${playerCardMessage}<br><br> Your bank $${bankRoll[currentPlayer]} <br><br> Click submit to start a new game!`;
  }

  return `${userName[currentPlayer]}, ${playerCardMessage}  ${endMessage};`;
};

// Calculate computer's score and automatically draw more if necessary
var calculateComputerScore = function () {
  // If two card score >= 17 and < 21, change game mode to compare with player's score
  if (computerPoints >= 17 && computerPoints < 21) {
    gameMode = FINAL_RESULT;
  }
  // If computer gets blackjack, output results and reset game
  else if (computerPoints == 21) {
    bankRoll[currentPlayer] = bankRoll[currentPlayer] - userBet[currentPlayer];
    allPlayerOutcomes.push("lose");
    playerPoints = 0;
    currentPlayer += 1;
    gameMode = SELECT_PLAYER;
    return `Sorry ${userName[currentPlayer]}! <br> The computer has gotten Blackjack and won! 😭 <br><br>Computer's cards: <br> ${computerCards[0].name} of ${computerCards[0].emojiSuit} <br>${computerCards[1].name} of ${computerCards[1].emojiSuit}<br> Computer's points: ${computerPoints}<br><br> Your bank $${bankRoll[currentPlayer]} `;
  } else {
    // Otherwise computer draws card until it reaches at least 17, gets blackjack or busts
    while (computerPoints < 17) {
      computerCards.push(shuffledDeck.pop());
      computerPoints =
        computerPoints + computerCards[computerCards.length - 1].value;
      // Run while loop to generate all computer card names and suits
      var computerCardMessage = `Computer's cards are: `;
      computerCounter = 0;
      while (computerCounter < computerCards.length) {
        computerCardMessage =
          computerCardMessage +
          `<br> ${computerCards[computerCounter].name} of ${computerCards[computerCounter].emojiSuit}`;
        computerCounter += 1;
      }
      // If computer gets at least 17, change game mode and compare with player
      if (computerPoints >= 17 && computerPoints < 21) {
        gameMode = FINAL_RESULT;
      }
      // If computer gets blackjack after drawing cards, return winning statement and reset game
      if (computerPoints == 21) {
        bankRoll[currentPlayer] =
          bankRoll[currentPlayer] - userBet[currentPlayer];
        allPlayerOutcomes.push("lose");
        playerPoints = 0;
        currentPlayer += 1;
        gameMode = SELECT_PLAYER;
        return `Sorry ${userName[currentPlayer]}! <br> The computer has gotten Blackjack and won! 😭 <br><br>
          ${computerCardMessage} 
          <br> Computer's points: ${computerPoints}<br><br> Your bank $${bankRoll[currentPlayer]} <br><br> Click submit to start a new game!`;
      }
      // If computer busts, output results and reset game
      if (computerPoints > 21) {
        bankRoll[currentPlayer] =
          bankRoll[currentPlayer] + userBet[currentPlayer];
        allPlayerOutcomes.push("win");
        playerPoints = 0;
        currentPlayer += 1;
        gameMode = SELECT_PLAYER;
        return `${userName[currentPlayer]}, the computer has bust, you win! 🥳 <br><br>
          ${computerCardMessage} 
          <br> Computer's points: ${computerPoints}<br><br> Your bank $${bankRoll[currentPlayer]} <br><br> Click submit to start a new game!`;
      }
    }
  }
};
// If above conditions are all not met, compare player results to computer results and output winner
var determineFinalResult = function () {
  // Run while loop to generate all computer card names and suits
  var computerCardMessage = `Computer's cards are: `;
  computerCounter = 0;
  while (computerCounter < computerCards.length) {
    computerCardMessage =
      computerCardMessage +
      `<br> ${computerCards[computerCounter].name} of ${computerCards[computerCounter].emojiSuit}`;
    computerCounter += 1;
  }
  // Run while loop to generate all player card names and suits
  var playerCardMessage = `Your cards are: `;
  aceCounter = 0;
  while (aceCounter < allPlayerCards[currentPlayer].length) {
    playerCardMessage =
      playerCardMessage +
      `<br> ${allPlayerCards[currentPlayer][aceCounter].name} of ${allPlayerCards[currentPlayer][aceCounter].emojiSuit}`;
    aceCounter += 1;
    // Combine player and computer output statements
    var finalOutput = `<br><br> ${playerCardMessage} <br><br> ${computerCardMessage}  <br><br> Click submit to start a new game!`;
  }
  gameMode = SELECT_PLAYER;
  currentPlayer += 1;
  playerPoints = 0;
  // Determine game outcome
  if (playerPoints > computerPoints) {
    bankRoll[currentPlayer] = bankRoll[currentPlayer] + userBet[currentPlayer];
    return `${userName[currentPlayer]}, you have won! 🥳 ${finalOutput}<br><br> Your bank: $${bankRoll[currentPlayer]}`;
  } else if (playerPoints < computerPoints) {
    bankRoll[currentPlayer] = bankRoll[currentPlayer] - userBet[currentPlayer];
    return `${userName[currentPlayer]}, you have lost! 😭 ${finalOutput}<br><br> Your bank: $${bankRoll[currentPlayer]} `;
  } else {
    bankRoll[currentPlayer] = bankRoll[currentPlayer] - userBet[currentPlayer];
    return `${userName[currentPlayer]}, its a draw! 😐 ${finalOutput}<br><br> Your bank: $${bankRoll[currentPlayer]} `;
  }
};

var main = function (input) {
  var myOutputValue = "";
  if (gameMode == WAITING_FOR_NUM_PLAYERS) {
    // Empty global variables if players want to change no of players
    playerPoints = 0;
    computerPoints = 0;
    allPlayerOutcomes = [];
    allPlayerCards = [];
    computerCards = [];
    userName = [];
    userBet = [];
    bankRoll = [];
    gameMode = WAITING_FOR_NAME;
    myOutputValue = `Hello player(s)! <br><br> Please enter the number of people playing`;
  } else if (gameMode == WAITING_FOR_NAME) {
    numPlayers = Number(input);
    myOutputValue = `You have chosen to player with ${numPlayers} players <br><br> Please enter all your names with a spacing and without a comma!!`;
    gameMode = INSTRUCTIONS;
  } else if (gameMode == INSTRUCTIONS) {
    stringNames = input;
    userName = stringNames.split(" ");
    gameMode = ASK_FOR_BET;

    myOutputValue = `Hello ${userName}! <br><br> Welcome to blackjack!!! 2️⃣1️⃣♠️❤️♣️♦️ <br><br> These are the rules:<br> You will be dealt two cards after clicking submit <br> The aim is to get 21 points without exceeding it <br> You need to hit a minimum of 17 points <br> Aces are worth either 1 or 11 and can be changed throughout the game <br><br> Press submit to continue`;
  } else if (gameMode == ASK_FOR_BET) {
    // Empty global variables for subsequent rounds
    playerPoints = 0;
    computerPoints = 0;
    allPlayerOutcomes = [];
    allPlayerCards = [];
    computerCards = [];
    userBet = [];
    gameMode = TAKE_BET;
    myOutputValue = `${userName}, before we begin enter an amount that each of you would like to bet! <br> Please enter the amount with a space and without a comma`;
  } else if (gameMode == TAKE_BET) {
    gameMode = DEAL_CARDS;
    stringBet = input;
    userBet = stringBet.split(" ").map(Number);
    for (var bankCounter = 0; bankCounter < numPlayers; bankCounter += 1) {
      bankRoll.push(100);
    }
    myOutputValue = `${userName}, you have chosen to bet $${userBet} this round respectively. <br><br> Your current bank totals are $${bankRoll}.
    <br><br> When you're ready click submit to play! `;
  } else if (gameMode == DEAL_CARDS) {
    gameMode = SELECT_PLAYER;

    // Create a deck of cards
    createDeck = makeDeck();
    // Shuffle deck of cards
    shuffledDeck = shuffleDeck(cardDeck);
    // Deal two cards to player and computer
    myOutputValue = dealCards();
  } else if (gameMode == SELECT_PLAYER) {
    // Reset global variable before switching player
    gameMode = PLAYER_ACTION;
    myOutputValue = selectPlayer();
  }
  // // Run while loop to generate all player card names and suits to be used below
  // var aceCounter = 0;
  // var playerCardMessage = `Your cards are: `;
  // while (aceCounter < allPlayerCards[currentPlayer].length) {
  //   playerCardMessage =
  //     playerCardMessage +
  //     `<br> ${allPlayerCards[currentPlayer][aceCounter].name} of ${allPlayerCards[currentPlayer][aceCounter].emojiSuit}`;
  //   aceCounter += 1;
  // }
  // Allow player to hit, stand or change ace value
  if (gameMode == PLAYER_ACTION) {
    if (input == INPUT_CHANGE_ACE) {
      gameMode = CHANGE_ACE_MODE;
      return `${userName[currentPlayer]}, please type in the position of the ace that you want to change <br><br> ${playerCardMessage}`;
    }
    // Change player's ace card based on input and update player's points
    if (input == ACE_ELEVEN || input == ACE_ONE) {
      myOutputValue = changeAceValue(input);
    }
    // Allow player to draw extra card and update player's points
    if (input == INPUT_HIT) {
      myOutputValue = playerDrawsExtraCard();
    }
    // Allow player to stand and switch to next mode
    if (input == INPUT_STAND) {
      // Ensure that player meets minimum game score required, else change game mode back
      if (playerPoints < 17) {
        gameMode = PLAYER_ACTION;

        return `${userName[currentPlayer]}, you need at least 17 points. Please type 'hit' to draw another card. <br><br> ${playerCardMessage}`;
      }
      gameMode = COMPUTER_CALCULATES;
    }
  }
  // Ensure player has selected an ace card
  if (gameMode == CHANGE_ACE_MODE) {
    myOutputValue = checkForAce(input);
  }

  // Check if computer has enough cards and add if necessary
  if (gameMode == COMPUTER_CALCULATES) {
    myOutputValue = calculateComputerScore();
  }
  // Compare player and computer cards and determine winner
  if (gameMode == FINAL_RESULT) {
    myOutputValue = determineFinalResult();
    gameMode = SELECT_PLAYER;
  }

  return myOutputValue;
};
