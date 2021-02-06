## Common stories
* greet
    - utter_greet

* restaurant_search
    - utter_ask_location

* goodbye
    - utter_goodbye
    - action_restart

* affirm
    - slot{"no_results_found": false}
    - utter_email_id

* affirm
    - slot{"no_results_found": true}
    - utter_greet

* email_ask{"user_email_id": "srihar9397@gmail.com"}
    - slot{"user_email_id": "srihar9397@gmail.com"}
    - send_email
    - utter_email_sent
    - utter_goodbye
    - action_restart

* affirm+email_ask{"user_email_id": "abcabc.bcd@gmail.com"}
    - slot{"user_email_id": "abcabc.bcd@gmail.com"}
    - send_email
    - utter_email_sent
    - utter_goodbye
    - action_restart

## Location based stories
* restaurant_search{"location": "delhi"}
    - slot{"location": "delhi"}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"location": "delhi"}
    - slot{"location": "delhi"}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"location": "delhi"}
    - slot{"location": "delhi"}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"no_results_found": false}
    - slot{"emailbody": "Showing top 10 restaurants:"}
    - utter_email_conf

* restaurant_search{"location": "delhi"}
    - slot{"location": "delhi"}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"no_results_found": true}
    - utter_ask_location

* restaurant_search{"location": "delhi"}
    - slot{"location": "delhi"}
    - check_location
    - slot{"check_op": false}
    - utter_ask_location

## Cuisine based stories
* restaurant_search{"cuisine": "chinese"}
    - slot{"cuisine": "chinese"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "chinese"}
    - slot{"check_op": true}
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"cuisine": "chinese"}
    - slot{"cuisine": "chinese"}
    - check_cuisine
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"cuisine": "chinese"}
    - slot{"cuisine": "chinese"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "chinese"}
    - slot{"check_op": false}
    - utter_ask_location

* restaurant_search{"cuisine": "chinese"}
    - slot{"cuisine": "chinese"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "chinese"}
    - slot{"check_op": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"no_results_found": false}
    - slot{"emailbody": "Showing top 10 restaurants:"}
    - utter_email_conf

* restaurant_search{"cuisine": "chinese"}
    - slot{"cuisine": "chinese"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "chinese"}
    - slot{"check_op": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"no_results_found": true}
    - utter_ask_location

## Price based stories
* restaurant_search{"price": "mid"}
    - slot{"price": "mid"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": false}
    - utter_ask_location

* restaurant_search{"price": "mid"}
    - slot{"price": "mid"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"price": "mid"}
    - slot{"price": "mid"}
    - check_price
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"price": "mid"}
    - slot{"price": "mid"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - action_search_restaurants
    - slot{"no_results_found": false}
    - slot{"emailbody": "Showing top 10 restaurants:"}
    - utter_email_conf

* restaurant_search{"price": "mid"}
    - slot{"price": "mid"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - action_search_restaurants
    - slot{"no_results_found": true}
    - utter_ask_location

## Combination stories (cuisine and location)
* restaurant_search{"cuisine": "North Indian", "location": "Ahmedabad"}
    - slot{"cuisine": "North Indian"}
    - slot{"location": "Ahmedabad"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "north indian"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"cuisine": "North Indian", "location": "Ahmedabad"}
    - slot{"cuisine": "North Indian"}
    - slot{"location": "Ahmedabad"}
    - check_cuisine
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"cuisine": "North Indian", "location": "Ahmedabad"}
    - slot{"cuisine": "North Indian"}
    - slot{"location": "Ahmedabad"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "north indian"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": false}
    - utter_ask_location

* restaurant_search{"cuisine": "North Indian", "location": "Ahmedabad"}
    - slot{"cuisine": "North Indian"}
    - slot{"location": "Ahmedabad"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "north indian"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: Ground Floor, Sachett 3, Mirambica Road, Near Shankar Society, Naranpura, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.7\n---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: First Floor, Riviera Arcade, Anandnagar Road, Near Punjab Honda, Prahlad Nagar, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.2\n---------------\nRestaurant Name: Royal Punjab Paratha\nRestaurant locality address: 13, Antrix Complex. City Centre, Swastik Char Rasta, Behind Videocon House, C G Road, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.2\n---------------\nRestaurant Name: Kesar Foods\nRestaurant locality address: G 6, Himalaya Complex, Nehru Park, Near Vastrapur, Ahmedabad\nAverage budget for two people: 400\nZomato user rating: 4.2\n---------------\nRestaurant Name: Mehmaan\nRestaurant locality address: 1st Floor, Shivalik Yash, 132 Feet Ring Road, Naranpura, Ahmedabad\nAverage budget for two people: 500\nZomato user rating: 4.0\n---------------\nRestaurant Name: Jay Ambe Thali\nRestaurant locality address: G-12, JB Tower, Near TV Tower, Drive In Road, Gurukul, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.0\n---------------\nRestaurant Name: Kolkata Konnection\nRestaurant locality address: Ground Floor, Prime Plaza, Behind Doordarshan Ground, Satya Marg Road, NFD Lion Circle, Bodakdev, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 3.7\n"}
    - slot{"no_results_found": false}
    - utter_email_conf

* restaurant_search{"cuisine": "North Indian", "location": "Ahmedabad"}
    - slot{"cuisine": "North Indian"}
    - slot{"location": "Ahmedabad"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "north indian"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"emailbody": ""}
    - slot{"no_results_found": true}
    - utter_ask_location

## Combination stories (price and location)
* restaurant_search{"price": "mid", "location": "Ahmedabad"}
    - slot{"price": "mid"}
    - slot{"location": "Ahmedabad"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"price": "mid", "location": "Ahmedabad"}
    - slot{"price": "mid"}
    - slot{"location": "Ahmedabad"}
    - check_price
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"price": "mid", "location": "Ahmedabad"}
    - slot{"price": "mid"}
    - slot{"location": "Ahmedabad"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": false}
    - utter_ask_location

* restaurant_search{"price": "mid", "location": "Ahmedabad"}
    - slot{"price": "mid"}
    - slot{"location": "Ahmedabad"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": true}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: Ground Floor, Sachett 3, Mirambica Road, Near Shankar Society, Naranpura, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.7\n---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: First Floor, Riviera Arcade, Anandnagar Road, Near Punjab Honda, Prahlad Nagar, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.2\n---------------\nRestaurant Name: Royal Punjab Paratha\nRestaurant locality address: 13, Antrix Complex. City Centre, Swastik Char Rasta, Behind Videocon House, C G Road, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.2\n---------------\nRestaurant Name: Kesar Foods\nRestaurant locality address: G 6, Himalaya Complex, Nehru Park, Near Vastrapur, Ahmedabad\nAverage budget for two people: 400\nZomato user rating: 4.2\n---------------\nRestaurant Name: Mehmaan\nRestaurant locality address: 1st Floor, Shivalik Yash, 132 Feet Ring Road, Naranpura, Ahmedabad\nAverage budget for two people: 500\nZomato user rating: 4.0\n---------------\nRestaurant Name: Jay Ambe Thali\nRestaurant locality address: G-12, JB Tower, Near TV Tower, Drive In Road, Gurukul, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.0\n---------------\nRestaurant Name: Kolkata Konnection\nRestaurant locality address: Ground Floor, Prime Plaza, Behind Doordarshan Ground, Satya Marg Road, NFD Lion Circle, Bodakdev, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 3.7\n"}
    - slot{"no_results_found": false}
    - utter_email_conf

* restaurant_search{"price": "mid", "location": "Ahmedabad"}
    - slot{"price": "mid"}
    - slot{"location": "Ahmedabad"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": true}
    - action_search_restaurants
    - slot{"emailbody": ""}
    - slot{"no_results_found": true}
    - utter_ask_location

## Combination stories (price and cuisine)
* restaurant_search{"price": "mid", "cuisine": "Mexican"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "mexican"}
    - slot{"check_price_slot": true}
    - slot{"check_op": false}
    - utter_ask_location

* restaurant_search{"price": "mid", "cuisine": "Mexican"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - check_price
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"price": "mid", "cuisine": "Mexican"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"price": "mid", "cuisine": "Mexican"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "mexican"}
    - slot{"check_price_slot": true}
    - slot{"check_op": true}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: Ground Floor, Sachett 3, Mirambica Road, Near Shankar Society, Naranpura, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.7\n---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: First Floor, Riviera Arcade, Anandnagar Road, Near Punjab Honda, Prahlad Nagar, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.2\n---------------\nRestaurant Name: Royal Punjab Paratha\nRestaurant locality address: 13, Antrix Complex. City Centre, Swastik Char Rasta, Behind Videocon House, C G Road, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.2\n---------------\nRestaurant Name: Kesar Foods\nRestaurant locality address: G 6, Himalaya Complex, Nehru Park, Near Vastrapur, Ahmedabad\nAverage budget for two people: 400\nZomato user rating: 4.2\n---------------\nRestaurant Name: Mehmaan\nRestaurant locality address: 1st Floor, Shivalik Yash, 132 Feet Ring Road, Naranpura, Ahmedabad\nAverage budget for two people: 500\nZomato user rating: 4.0\n---------------\nRestaurant Name: Jay Ambe Thali\nRestaurant locality address: G-12, JB Tower, Near TV Tower, Drive In Road, Gurukul, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.0\n---------------\nRestaurant Name: Kolkata Konnection\nRestaurant locality address: Ground Floor, Prime Plaza, Behind Doordarshan Ground, Satya Marg Road, NFD Lion Circle, Bodakdev, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 3.7\n"}
    - slot{"no_results_found": false}
    - utter_email_conf

* restaurant_search{"price": "mid", "cuisine": "Mexican"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "mexican"}
    - slot{"check_price_slot": true}
    - slot{"check_op": true}
    - action_search_restaurants
    - slot{"emailbody": ""}
    - slot{"no_results_found": true}
    - utter_ask_location

## Combination stories (price, cuisine and location)
* restaurant_search{"price": "mid", "cuisine": "Mexican", "location": "delhi"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - slot{"location": "delhi"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "mexican"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: Ground Floor, Sachett 3, Mirambica Road, Near Shankar Society, Naranpura, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.7\n---------------\nRestaurant Name: Stuff's Food\nRestaurant locality address: First Floor, Riviera Arcade, Anandnagar Road, Near Punjab Honda, Prahlad Nagar, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 4.2\n---------------\nRestaurant Name: Royal Punjab Paratha\nRestaurant locality address: 13, Antrix Complex. City Centre, Swastik Char Rasta, Behind Videocon House, C G Road, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.2\n---------------\nRestaurant Name: Kesar Foods\nRestaurant locality address: G 6, Himalaya Complex, Nehru Park, Near Vastrapur, Ahmedabad\nAverage budget for two people: 400\nZomato user rating: 4.2\n---------------\nRestaurant Name: Mehmaan\nRestaurant locality address: 1st Floor, Shivalik Yash, 132 Feet Ring Road, Naranpura, Ahmedabad\nAverage budget for two people: 500\nZomato user rating: 4.0\n---------------\nRestaurant Name: Jay Ambe Thali\nRestaurant locality address: G-12, JB Tower, Near TV Tower, Drive In Road, Gurukul, Ahmedabad\nAverage budget for two people: 300\nZomato user rating: 4.0\n---------------\nRestaurant Name: Kolkata Konnection\nRestaurant locality address: Ground Floor, Prime Plaza, Behind Doordarshan Ground, Satya Marg Road, NFD Lion Circle, Bodakdev, Ahmedabad\nAverage budget for two people: 700\nZomato user rating: 3.7\n"}
    - slot{"no_results_found": false}
    - utter_email_conf

* restaurant_search{"price": "mid", "cuisine": "Mexican", "location": "delhi"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - slot{"location": "delhi"}
    - check_price
    - slot{"check_price_slot": false}
    - utter_ask_budget

* restaurant_search{"price": "mid", "cuisine": "Mexican", "location": "delhi"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - slot{"location": "delhi"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": false}
    - utter_ask_cuisine

* restaurant_search{"price": "mid", "cuisine": "Mexican", "location": "delhi"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - slot{"location": "delhi"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "mexican"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": false}
    - utter_ask_location

* restaurant_search{"price": "mid", "cuisine": "Mexican", "location": "delhi"}
    - slot{"price": "mid"}
    - slot{"cuisine": "Mexican"}
    - slot{"location": "delhi"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"price": "mid"}
    - slot{"check_cuisine_slot": false}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"cuisine": "mexican"}
    - slot{"check_op": false}
    - check_location
    - slot{"check_op": true}
    - slot{"location": "delhi"}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - action_search_restaurants
    - slot{"emailbody": ""}
    - slot{"no_results_found": true}
    - utter_ask_location

* greet
    - utter_greet
* restaurant_search{"cuisine": "North Indian", "location": "agra"}
    - slot{"cuisine": "North Indian"}
    - slot{"location": "agra"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": false}
    - slot{"check_price_slot": false}
    - slot{"cuisine": "north indian"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": false}
    - slot{"location": "agra"}
    - utter_ask_budget
* restaurant_search{"price": "high"}
    - slot{"price": "high"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": true}
    - slot{"price": "high"}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Peshawri - ITC Mughal\nRestaurant locality address: ITC Mughal, Fatehabad Road, Tajganj, Agra\nAverage budget for two people: 6000\nZomato user rating: 4.6\n---------------\nRestaurant Name: Pind Balluchi\nRestaurant locality address: Opposite Saga Emporium, Fatehabad Road, Tajganj, Agra\nAverage budget for two people: 1100\nZomato user rating: 4.1\n---------------\nRestaurant Name: Taj Bano - ITC Mughal\nRestaurant locality address: ITC Mughal, Fatehabad Road, Tajganj, Agra\nAverage budget for two people: 2500\nZomato user rating: 4.0\n---------------\nRestaurant Name: Capri Restaurant\nRestaurant locality address: Shop no.6-7,upadhyay market,hari parvat,agra,uttar pradesh\nAverage budget for two people: 850\nZomato user rating: 3.8\n"}
    - slot{"no_results_found": false}
    - utter_email_conf
* goodbye
    - utter_goodbye
    - action_restart

* restaurant_search{"cuisine": "thai", "location": "Hyderabad"}
    - slot{"cuisine": "thai"}
    - slot{"location": "Hyderabad"}
    - check_cuisine
    - slot{"check_cuisine_slot": false}
    - slot{"check_op": false}
    - slot{"check_price_slot": false}
    - slot{"cuisine": "thai"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": false}
    - slot{"check_price_slot": false}
    - slot{"location": "Hyderabad"}
    - utter_ask_cuisine
* restaurant_search{"cuisine": "South Indian"}
    - slot{"cuisine": "South Indian"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": true}
    - slot{"check_price_slot": false}
    - slot{"cuisine": "south indian"}
    - utter_ask_budget
* restaurant_search{"price": "low"}
    - slot{"price": "low"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": true}
    - slot{"price": "low"}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Taaza Kitchen\nRestaurant locality address: Plot 497, 100 Feet Road, Ayyappa Society, Mega Hills, Madhapur, Hyderabad\nAverage budget for two people: 100\nZomato user rating: 4.6\n---------------\nRestaurant Name: Pragati Tiffin Center\nRestaurant locality address: H V S Road, Hanuman Tekdi, Near Pargati College, Koti, Hyderabad\nAverage budget for two people: 150\nZomato user rating: 4.5\n---------------\nRestaurant Name: Ram Ki Bandi\nRestaurant locality address: Near Karachi Bakery, Mozamjahi Market, Nampally, Hyderabad\nAverage budget for two people: 150\nZomato user rating: 4.3\n---------------\nRestaurant Name: Varalakshmi Tiffins\nRestaurant locality address: 4-21, Ground Floor, HIG 21, APHB Colony, Opposite DLF Gate 2, Gachibowli, Hyderabad\nAverage budget for two people: 250\nZomato user rating: 4.3\n---------------\nRestaurant Name: Sri Sai Darshini Tiffins & Meals\nRestaurant locality address: Shop No.6 & 7, Ushodaya Towers, Shapur Nagar, Jeedimetla Road, Jeedimetla, Hyderabad\nAverage budget for two people: 200\nZomato user rating: 4.2\n---------------\nRestaurant Name: Lakshmi Tiffin Centre\nRestaurant locality address: Ayyappa Society, Near YSR Statue, Madhapur, Hyderabad\nAverage budget for two people: 200\nZomato user rating: 4.1\n---------------\nRestaurant Name: Hotel Suprabhat\nRestaurant locality address: Opposite Habsiguda Metro Station, Habsiguda Cross Road, Habsiguda, Hyderabad\nAverage budget for two people: 200\nZomato user rating: 4.1\n---------------\nRestaurant Name: Amay Tiffin Corner\nRestaurant locality address: 500001, 4-1-1098, Tilak Road, Bogulkunta, Abids, Hyderabad\nAverage budget for two people: 200\nZomato user rating: 3.9\n---------------\nRestaurant Name: Shree Ganesh Darshini\nRestaurant locality address: 771, Opposite CC Shroff Hospital, Barkatpura, Kacheguda, Hyderabad\nAverage budget for two people: 200\nZomato user rating: 3.7\n"}
    - slot{"no_results_found": false}
    - utter_email_conf
* affirm+email_ask{"user_email_id": "srihar939@gmail.com"}
    - slot{"user_email_id": "srihar939@gmail.com"}
    - send_email
    - utter_email_sent
    - utter_goodbye
    - action_restart

* restaurant_search{"location": "Rishikesh"}
    - slot{"location": "Rishikesh"}
    - check_location
    - slot{"check_op": false}
    - slot{"check_cuisine_slot": false}
    - slot{"check_price_slot": false}
    - slot{"location": "Rishikesh"}
    - utter_ask_location
* restaurant_search{"location": "Belgaum"}
    - slot{"location": "Belgaum"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": false}
    - slot{"check_price_slot": false}
    - slot{"location": "Belgaum"}
    - utter_ask_cuisine
* restaurant_search{"cuisine": "Italian"}
    - slot{"cuisine": "Italian"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": true}
    - slot{"check_price_slot": false}
    - slot{"cuisine": "italian"}
    - utter_ask_budget
* restaurant_search{"price": "high"}
    - slot{"price": "high"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": true}
    - slot{"price": "high"}
    - action_search_restaurants
    - slot{"emailbody": ""}
    - slot{"no_results_found": true}
    - utter_ask_location
* restaurant_search{"location": "Kozhikode"}
    - slot{"location": "Kozhikode"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - slot{"location": "Kozhikode"}
    - action_search_restaurants
    - slot{"emailbody": ""}
    - slot{"no_results_found": true}
    - utter_ask_location
* restaurant_search{"location": "bangalore"}
    - slot{"location": "bangalore"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - slot{"location": "bangalore"}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Fenny's Lounge And Kitchen\nRestaurant locality address: 115, 3rd Floor, Opposite Raheja Arcade, Koramangala 7th Block, Bangalore\nAverage budget for two people: 1600\nZomato user rating: 4.6\n---------------\nRestaurant Name: Olive Bar And Kitchen\nRestaurant locality address: 16, Wood Street, Ashok Nagar, Richmond Road, Bangalore\nAverage budget for two people: 2400\nZomato user rating: 4.6\n---------------\nRestaurant Name: Smoke House Deli\nRestaurant locality address: Plot 1209, Ward 72, HAL 2nd Stage, Doopanahalli, Indiranagar, Bangalore\nAverage budget for two people: 1600\nZomato user rating: 4.5\n---------------\nRestaurant Name: Pasta Street\nRestaurant locality address: 2022, 100 Feet Road,HAL 2nd Stage, Indiranagar, Bangalore\nAverage budget for two people: 1500\nZomato user rating: 4.5\n---------------\nRestaurant Name: Smoke House Deli\nRestaurant locality address: 52/ 53, Ground Floor, Lavelle Road, Bangalore\nAverage budget for two people: 1600\nZomato user rating: 4.5\n---------------\nRestaurant Name: Pasta Street\nRestaurant locality address: 37/2, Chicago Avenue, Opposite Fortis Hospital, Cunningham Road, Bangalore\nAverage budget for two people: 1500\nZomato user rating: 4.5\n---------------\nRestaurant Name: Pasta Street\nRestaurant locality address: 751, 80 Feet Road, Opposite SBI Bank, Koramangala 4th Block, Bangalore\nAverage budget for two people: 1500\nZomato user rating: 4.5\n---------------\nRestaurant Name: Toscano\nRestaurant locality address: 3rd Floor, VR Mall, Whitefield Main Road, Mahadevpura, Whitefield, Bangalore\nAverage budget for two people: 2300\nZomato user rating: 4.5\n---------------\nRestaurant Name: Toit\nRestaurant locality address: 298, 100 Feet Road, Namma Metro Pillar 62, Indiranagar, Bangalore\nAverage budget for two people: 2000\nZomato user rating: 4.4\n---------------\nRestaurant Name: The Pizza Bakery - Brew & Eatery\nRestaurant locality address: 2985, 12th Main, HAL 2nd Stage, Indiranagar, Bangalore\nAverage budget for two people: 1200\nZomato user rating: 4.4\n"}
    - slot{"no_results_found": false}
    - utter_email_conf
* affirm
    - utter_email_id
* affirm+email_ask{"user_email_id": "sriharsha@jiffy.ai"}
    - slot{"user_email_id": "sriharsha@jiffy.ai"}
    - send_email
    - utter_email_sent
    - utter_goodbye
    - action_restart

* restaurant_search{"cuisine": "chinese", "location": "Mumbai", "price": "high"}
    - slot{"cuisine": "chinese"}
    - slot{"location": "Mumbai"}
    - slot{"price": "high"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": false}
    - slot{"check_op": false}
    - slot{"price": "high"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": false}
    - slot{"check_price_slot": true}
    - slot{"cuisine": "chinese"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - slot{"location": "Mumbai"}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: Hakkasan\nRestaurant locality address: 206, 2nd Floor, Krystal, Waterfield Road, Linking Road, Bandra West, Mumbai\nAverage budget for two people: 2600\nZomato user rating: 4.7\n---------------\nRestaurant Name: Pa Pa Ya\nRestaurant locality address: G-2, Ground Floor, North Avenue, Maker Maxity, Bandra Kurla Complex, Mumbai\nAverage budget for two people: 2500\nZomato user rating: 4.6\n---------------\nRestaurant Name: Yazu - Pan Asian Supper Club\nRestaurant locality address: 9, Ground Floor, Raheja Classic Complex, Near Infinity Mall, Phase D, Shastri Nagar, Oshiwara, Andheri West, Mumbai\nAverage budget for two people: 2200\nZomato user rating: 4.5\n---------------\nRestaurant Name: All Stir Fry - Gordon House Hotel\nRestaurant locality address: 5 Battery Street, Opposite Regal Cinema, Apollo Bunder, Near Colaba, Mumbai\nAverage budget for two people: 2300\nZomato user rating: 4.5\n---------------\nRestaurant Name: By the Mekong - The St. Regis Mumbai\nRestaurant locality address: The St. Regis, 462, Senapati Bapat Marg, Lower Parel, Mumbai\nAverage budget for two people: 4000\nZomato user rating: 4.5\n---------------\nRestaurant Name: Yauatcha\nRestaurant locality address: Raheja Tower, Bandra Kurla Complex, Mumbai\nAverage budget for two people: 2800\nZomato user rating: 4.4\n---------------\nRestaurant Name: The Fatty Bao\nRestaurant locality address: Ground Floor, Summerville, 33rd Road, Linking Road, Bandra West, Mumbai\nAverage budget for two people: 2000\nZomato user rating: 4.4\n---------------\nRestaurant Name: Royal China\nRestaurant locality address: Hazarimal Somani Marg, Near Sterling Cinema, Fort, Mumbai\nAverage budget for two people: 2500\nZomato user rating: 4.4\n---------------\nRestaurant Name: Foo\nRestaurant locality address: F1, First Floor, Festival Square, Phoenix Mill Compound, 462, Phoenix Mall, S B Marg, Lower Parel West, Lower Parel, Mumbai\nAverage budget for two people: 2200\nZomato user rating: 4.3\n---------------\nRestaurant Name: Jia The Oriental Kitchen\nRestaurant locality address: 2, Dhanraj Mahal, CS Marg, Colaba, Mumbai\nAverage budget for two people: 2500\nZomato user rating: 4.3\n"}
    - slot{"no_results_found": false}
    - utter_email_conf
* goodbye
    - utter_goodbye
    - action_restart

* restaurant_search{"cuisine": "thai", "price": "range 300-700"}
    - slot{"cuisine": "thai"}
    - slot{"price": "range 300-700"}
    - check_price
    - slot{"check_price_slot": true}
    - slot{"check_cuisine_slot": false}
    - slot{"check_op": false}
    - slot{"price": "mid"}
    - check_cuisine
    - slot{"check_cuisine_slot": false}
    - slot{"check_op": false}
    - slot{"check_price_slot": true}
    - slot{"cuisine": "thai"}
    - utter_ask_cuisine
* restaurant_search{"cuisine": "American"}
    - slot{"cuisine": "American"}
    - check_cuisine
    - slot{"check_cuisine_slot": true}
    - slot{"check_op": false}
    - slot{"check_price_slot": true}
    - slot{"cuisine": "american"}
    - utter_ask_location
* restaurant_search
    - utter_ask_location
* restaurant_search{"location": "Prayagraj"}
    - slot{"location": "Prayagraj"}
    - check_location
    - slot{"check_op": true}
    - slot{"check_cuisine_slot": true}
    - slot{"check_price_slot": true}
    - slot{"location": "Prayagraj"}
    - action_search_restaurants
    - slot{"emailbody": "---------------\nRestaurant Name: KFC\nRestaurant locality address: 229/71, Ground Floor, P Square Mall, MG Marg, Civil Lines, Allahabad\nAverage budget for two people: 450\nZomato user rating: 4.4\n---------------\nRestaurant Name: McDonald's\nRestaurant locality address: 34-B, M.G. Marg, Allahabad, Zone No-3, Allahabad (Uttar Pradesh) \nAverage budget for two people: 500\nZomato user rating: 4.3\n---------------\nRestaurant Name: Pizza Hut\nRestaurant locality address: Shop 31/31, S. P. Marg, Civil Lines, Allahabad\nAverage budget for two people: 600\nZomato user rating: 4.2\n---------------\nRestaurant Name: Hot N Cool\nRestaurant locality address: 194, Opposite Anand Bhawan, Colonel Ganj, Allahabad\nAverage budget for two people: 450\nZomato user rating: 4.2\n---------------\nRestaurant Name: Well Bean Cafe\nRestaurant locality address: 33/5A, First Floor , Above Subway,Tashkand Marg,Civil Lines, Allahabad\nAverage budget for two people: 500\nZomato user rating: 4.2\n---------------\nRestaurant Name: Hot n Cool\nRestaurant locality address: 262, Armaan Market, Indalpur Road, Mahewa, Near Bank Of Baroda, Naini, Allahabad\nAverage budget for two people: 300\nZomato user rating: 4.2\n---------------\nRestaurant Name: 7th Heaven\nRestaurant locality address: 128B/24/6A, Mahatma Gandhi Marg, Civil Lines, Allahabad\nAverage budget for two people: 400\nZomato user rating: 4.1\n---------------\nRestaurant Name: Grill Inn\nRestaurant locality address: 49/15F/2, Mahewa Patti, Uperhari, Near Agriculture University, Naini, Allahabad\nAverage budget for two people: 400\nZomato user rating: 3.8\n---------------\nRestaurant Name: HungersHunt\nRestaurant locality address: Ground Floor, Raju Video Building, Near Uptron Chauraha, Shivkuti, Prayagraj, Teliarganj, Allahabad\nAverage budget for two people: 500\nZomato user rating: 3.7\n---------------\nRestaurant Name: Charcoal\nRestaurant locality address: 3A, Muir Road, Katra, Allahabad\nAverage budget for two people: 350\nZomato user rating: 3.5\n"}
    - slot{"no_results_found": false}
    - utter_email_conf
* goodbye
    - utter_goodbye
    - action_restart
