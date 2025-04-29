#!/bin/bash

TESTING=true
ARG=$1
PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"
EXISTS=false

if [ -z "$ARG" ]; then
  echo "Please provide an element as an argument."
  exit 0
fi

if [ `$PSQL "SELECT EXISTS(
  SELECT * FROM elements
  WHERE atomic_number = $(($ARG)) OR symbol = '$ARG' OR name = '$ARG');"` = 'f' ];
then
  echo "I could not find that element in the database."
  exit 0
fi

while IFS="|" read -r atomic_number name symbol type atomic_mass melt_point boil_point
do
  echo "The element with atomic number $atomic_number is $name ($symbol). It's a $type, with a mass of $atomic_mass amu. $name has a melting point of $melt_point celsius and a boiling point of $boil_point celsius."
done <<< $($PSQL "SELECT
  elements.atomic_number, elements.name, elements.symbol,
  types.type, properties.atomic_mass, properties.melting_point_celsius, properties.boiling_point_celsius
  FROM elements
  JOIN properties ON properties.atomic_number = elements.atomic_number
  JOIN types ON types.type_id = properties.type_id
  WHERE elements.atomic_number = $(($ARG)) OR symbol = '$ARG' OR name = '$ARG';")

