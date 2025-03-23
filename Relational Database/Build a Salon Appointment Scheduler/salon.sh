#! /bin/bash

PSQL="psql --username=freecodecamp --dbname=salon -A -t -c"
PSQL_E="psql --username=freecodecamp --dbname=salon -A -t -q -c"

echo "~~~~~ MY SALON ~~~~~

Welcome to My Salon, how can I help you?
"

while :
do
  $PSQL "SELECT service_id, name FROM services;" | while IFS='|' read -r service_id service_name
  do
    echo "$service_id) $service_name"
  done

  read SERVICE_ID_SELECTED
  SERVICE_NAME_SELECTED=`$PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED"`

  if [[ "$SERVICE_NAME_SELECTED" == "" ]]; then
    printf "\nI could not find that service. What would you like today?\n"
  else
    break
  fi
done

printf "\nWhat's your phone number?\n"
read CUSTOMER_PHONE

CUSTOMER_ID=0
CUSTOMER_NAME=""
while IFS='|' read -r cust_id cust_name
do
  CUSTOMER_ID=$cust_id
  CUSTOMER_NAME=$cust_name
done <<< $($PSQL "SELECT customer_id, name FROM customers WHERE phone = '$CUSTOMER_PHONE';")

if [[ "$CUSTOMER_NAME" == "" ]]; then
  printf "\nI don't have a record for that phone number, what's your name?\n"
  read CUSTOMER_NAME

  $PSQL_E "INSERT INTO customers (phone, name) VALUES ('$CUSTOMER_PHONE', '$CUSTOMER_NAME');"
  CUSTOMER_ID=`$PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE'"`
fi

echo "
What time would you like your $SERVICE_NAME_SELECTED, $CUSTOMER_NAME?"
read SERVICE_TIME

$PSQL_E "INSERT INTO appointments (customer_id, service_id, time)
VALUES ($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME');"

echo "
I have put you down for a $SERVICE_NAME_SELECTED at $SERVICE_TIME, $CUSTOMER_NAME."