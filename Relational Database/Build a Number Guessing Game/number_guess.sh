#!/bin/bash

random() {
    min="$1"
    max="$2"
    
    range=$((max - min + 1))
    rand=$((min + (RANDOM % range)))
    echo "$rand"
}

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"
PSQL_E="psql --username=freecodecamp --dbname=number_guess -t --no-align -q -c"
SECRET=$(random 1 1000)

printf "Enter your username: "
read USERNAME

if [[ `$PSQL "SELECT EXISTS (SELECT * FROM users WHERE name = '$USERNAME')"` == 'f' ]]; then
  $PSQL_E "INSERT INTO users (name) VALUES ('$USERNAME');"
  echo "Welcome, $USERNAME! It looks like this is your first time here."
else
  GAMES_PLAYED=`$PSQL "SELECT COUNT(*) FROM games WHERE user_id = (SELECT id FROM users WHERE name = '$USERNAME');"`
  BEST_GAME=`$PSQL "SELECT MIN(guesses) FROM games WHERE user_id = (SELECT id FROM users WHERE name = '$USERNAME');"`
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

USER_ID=`$PSQL "SELECT id FROM users WHERE name = '$USERNAME';"`

printf "Guess the secret number between 1 and 1000: "
read GUESS
NUM_GUESSES=1

while :
do
  if [[ !("$GUESS" =~ ^[0-9]+$) ]]; then
    printf "That is not an integer, guess again: "
    read GUESS
    NUM_GUESSES=$((NUM_GUESSES+1))
    continue
  fi

  if [ $GUESS -eq $SECRET ]; then
    echo "You guessed it in $NUM_GUESSES tries. The secret number was $SECRET. Nice job!"
    break
  elif [ $SECRET -lt $GUESS ]; then
    printf "It's lower than that, guess again: "
    read GUESS
    NUM_GUESSES=$((NUM_GUESSES+1))
  elif [ $SECRET -gt $GUESS ]; then
    printf "It's higher than that, guess again: "
    read GUESS
    NUM_GUESSES=$((NUM_GUESSES+1))
  fi
done

$PSQL_E "INSERT INTO games (user_id, guesses) VALUES ($USER_ID, $NUM_GUESSES);"
