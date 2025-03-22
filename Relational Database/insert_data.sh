#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.
INPUT="games.csv"

[ ! -f $INPUT ] && { echo "$INPUT file is not found"; exit 99; }
while IFS=',' read year round winner opponent winner_goals opponent_goals
do
  if [[ "$year" == "year" ]]; then
    continue
  fi

  $PSQL "INSERT INTO teams (name) VALUES ('$winner'), ('$opponent') ON CONFLICT (name) DO NOTHING;"
  $PSQL "INSERT INTO games
    (year, round, winner_id, opponent_id, winner_goals, opponent_goals) VALUES
    ($year, '$round', (SELECT team_id FROM teams WHERE name = '$winner'), (SELECT team_id FROM teams WHERE name = '$opponent'), $winner_goals, $opponent_goals);
  "
done < "$INPUT"