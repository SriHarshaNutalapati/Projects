from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from rasa_sdk import Action
from rasa_sdk.events import SlotSet
import zomatopy
import json, re, difflib

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class ActionSearchRestaurants(Action):
	def name(self):
		return 'action_search_restaurants'
		
	def run(self, dispatcher, tracker, domain):
		config={ "user_key":"c417dc3b448f83d939ed839148b79926"}
		zomato = zomatopy.initialize_app(config)
		loc = tracker.get_slot('location')
		cuisine = tracker.get_slot('cuisine').lower()
		price = tracker.get_slot('price')
		location_detail=zomato.get_location(loc, 1)
		d1 = json.loads(location_detail)
		lat=d1["location_suggestions"][0]["latitude"]
		lon=d1["location_suggestions"][0]["longitude"]
		cuisines_dict={'chinese':25,'italian':55,'north indian':50,'south indian':85,'american':1,'mexican':73}
		results=zomato.restaurant_search("", lat, lon, str(cuisines_dict.get(cuisine)), 100)
		price_dict = {'low':1,'mid':2,'high':3}
		d = json.loads(results)
		response=""
		res_count = 0
		res_email_body = ""
		res_five_responses = ""
		no_results_found_check = False
		if d['results_found'] == 0:
			dispatcher.utter_message("Sorry, No restaurants found for your criteria.")
			return [SlotSet('no_results_found',True)] 
		else:
			try:
				for restaurant in sorted(d['restaurants'], key=lambda x: x['restaurant']['user_rating']['aggregate_rating'], reverse=True):
					if((price_dict.get(price) == 1) and (restaurant['restaurant']['average_cost_for_two'] < 300) and (res_count < 10)):
						response=response + restaurant['restaurant']['name']+ " in "+ restaurant['restaurant']['location']['address']+ " has been rated "+ restaurant['restaurant']['user_rating']['aggregate_rating']+"\n"
						res_count = res_count + 1
						res_email_body = res_email_body + "-"*15 + "\n"
						res_email_body = res_email_body + "Restaurant Name: " + restaurant['restaurant']['name'] + "\n"
						res_email_body = res_email_body + "Restaurant locality address: " + restaurant['restaurant']['location']['address'] + "\n"
						res_email_body = res_email_body + "Average budget for two people: " + str(restaurant['restaurant']['average_cost_for_two']) + "\n"
						res_email_body = res_email_body + "Zomato user rating: " + restaurant['restaurant']['user_rating']['aggregate_rating'] + "\n"
					elif((price_dict.get(price) == 2) and (restaurant['restaurant']['average_cost_for_two'] >= 300) and (restaurant['restaurant']['average_cost_for_two'] <= 700) and (res_count < 10)):
						response=response + restaurant['restaurant']['name']+ " in "+ restaurant['restaurant']['location']['address']+ " has been rated "+ restaurant['restaurant']['user_rating']['aggregate_rating']+"\n"
						res_count = res_count + 1
						res_email_body = res_email_body + "-"*15 + "\n"
						res_email_body = res_email_body + "Restaurant Name: " + restaurant['restaurant']['name'] + "\n"
						res_email_body = res_email_body + "Restaurant locality address: " + restaurant['restaurant']['location']['address'] + "\n"
						res_email_body = res_email_body + "Average budget for two people: " + str(restaurant['restaurant']['average_cost_for_two']) + "\n"
						res_email_body = res_email_body + "Zomato user rating: " + restaurant['restaurant']['user_rating']['aggregate_rating'] + "\n"                      
					elif((price_dict.get(price) == 3) and (restaurant['restaurant']['average_cost_for_two'] > 700) and (res_count < 10)):
						response=response+ restaurant['restaurant']['name']+ " in "+ restaurant['restaurant']['location']['address']+ " has been rated "+ restaurant['restaurant']['user_rating']['aggregate_rating']+"\n"
						res_count = res_count + 1
						res_email_body = res_email_body + "-"*15 + "\n"
						res_email_body = res_email_body + "Restaurant Name: " + restaurant['restaurant']['name'] + "\n"
						res_email_body = res_email_body + "Restaurant locality address: " + restaurant['restaurant']['location']['address'] + "\n"
						res_email_body = res_email_body + "Average budget for two people: " + str(restaurant['restaurant']['average_cost_for_two']) + "\n"
						res_email_body = res_email_body + "Zomato user rating: " + restaurant['restaurant']['user_rating']['aggregate_rating'] + "\n"       
					if res_count <= 5:
						res_five_responses = response
					if res_count == 10:
						break
			except Exception as e:
				pass
			
			if res_count == 0:
				no_results_found_check = True
				dispatcher.utter_message("Sorry, No restaurants found for your criteria.")
			else:
				dispatcher.utter_message("Showing you top rated restaurants:")
				dispatcher.utter_message(res_five_responses)
			return [SlotSet('emailbody',res_email_body), SlotSet('no_results_found',no_results_found_check)] # put the response in emailbody if user wants a email.

class CheckLocation(Action):
	def name(self):
		return 'check_location'
		
	def run(self, dispatcher, tracker, domain):
		loc = tracker.get_slot('location')
		check_loc = True
		cities=['Ahmedabad', 'Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune',
		'Agra', 'Ajmer', 'Aligarh', 'Amravati', 'Amritsar', 
		'Asansol', 'Aurangabad', 'Bareilly', 'Belgaum', 'Bhavnagar', 
		'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro' 
		'Steel City', 'Chandigarh', 'Coimbatore', 'Cuttack', 'Dehradun', 'Dhanbad', 
		'Bhilai', 'Durgapur', 'Dindigul', 'Erode', 'Faridabad', 'Firozabad', 'Ghaziabad', 
		'Gorakhpur', 'Gulbarga', 'Guntur', 'Gwalior', 'Gurgaon', 'Guwahati', 'Hamirpur', 
		'Hubli–Dharwad', 'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 
		'Jamshedpur', 'Jhansi', 'Jodhpur', 'Kakinada', 'Kannur', 'Kanpur', 'Karnal', 'Kochi', 
		'Kolhapur', 'Kollam', 'Kozhikode', 'Kurnool', 'Ludhiana', 'Lucknow', 'Madurai', 'Malappuram', 
		'Mathura', 'Mangalore', 'Meerut', 'Moradabad', 'Mysore', 'Nagpur', 'Nanded', 'Nashik', 
		'Nellore', 'Noida', 'Patna', 'Pondicherry', 'Purulia', 'Prayagraj', 'Raipur', 'Rajkot', 'Rajahmundry', 
		'Ranchi', 'Rourkela', 'Salem', 'Sangli', 'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat', 'Thanjavur', 'Thiruvananthapuram', 'Thrissur', 
		'Tiruchirappalli', 'Tirunelveli', 'Ujjain', 'Bijapur', 'Vadodara', 'Varanasi', 'Vasai-Virar City', 'Vijayawada', 'Visakhapatnam', 'Vellore', 
		'Warangal']

		cities_lower=[x.lower() for x in cities]

		if loc is None:
			loc = self.getLocationFromMessage(loc, cities_lower, tracker)
		
		if loc.lower() not in cities_lower:
			# if location is misspelled or if there are extra words with location, we will correct it here.
			# using python difflib
			close_matches_count = 0
			check_loc = False
			try:
				loc_list = loc.split()
				for word in loc_list:
					close_matches = difflib.get_close_matches(word.lower(), cities_lower)
					if len(close_matches) > 0:
						close_matches_count += 1
			except Exception as e:
				pass
			finally:
				if close_matches_count == 0:
					dispatcher.utter_message("Sorry, we don’t operate in this city. Can you please specify some other location?")
				else:
					dispatcher.utter_message("Sorry, didn’t find any such location. Can you please tell again?")
		cuisine_check = tracker.get_slot("check_cuisine_slot")
		price_check = tracker.get_slot("check_price_slot")
		if price_check is None:
			price_check = False
		if cuisine_check is None:
			cuisine_check = False
		return [SlotSet("check_op", check_loc), SlotSet("check_cuisine_slot", cuisine_check), SlotSet("check_price_slot", price_check), SlotSet("location", loc)]

	def getLocationFromMessage(self, location, cities_list, tracker):
		latest_message = (tracker.latest_message)['text']
		try:
			loc_list = latest_message.split()
			for word in loc_list:
				close_matches = difflib.get_close_matches(word.lower(), cities_list)
				if len(close_matches) > 0:
					location = close_matches[0]
		except Exception as e:
			pass
		return location

class SendEmail(Action):

	def name(self):
		return 'send_email'

	def run(self, dispatcher, tracker, domain):
		try:
			dispatcher.utter_message("Came to send email")
			body = tracker.get_slot('emailbody')
			from_user = 'srihar9397@gmail.com'
			to_user = tracker.get_slot('user_email_id')
			password = 'sonybravia'
			msg = MIMEMultipart()
			msg['From'] = from_user
			msg['TO'] = to_user
			msg['Subject'] = 'Top 10 restaurants for your criteria'
			msg.attach(MIMEText(body,'plain'))
			server = smtplib.SMTP('smtp.gmail.com',587)
			server.starttls()
			server.login(from_user, password)
			text = msg.as_string()
			server.sendmail(from_user,to_user,text)
			server.quit()
		except Exception as e:
			pass
		

class CheckPrice(Action):

	def name(self):
		return 'check_price'

	def run(self, dispatcher, tracker, domain):
		price = tracker.get_slot('price')
		price_dict = {'low':1,'mid':2,'high':3}
		check_price = True
		cuisine_check = tracker.get_slot("check_cuisine_slot")
		loc_check = tracker.get_slot("check_op")
		if cuisine_check is None:
			cuisine_check = False
		if loc_check is None:
			loc_check = False
		if price is None:
			# we will try to get price from latest user message
			price = self.getPriceFromMessage(price, price_dict, tracker)
		elif price not in price_dict.keys():
			# first, we will try to get 
			price_numbers = re.findall(r'\b\d+\b', price)
			if ('300' in price_numbers) and ('700' in price_numbers):
				price = "mid"
			elif '300' in price_numbers:
				price = "low"
			elif '700' in price_numbers:
				price = "high"

			if price not in price_dict.keys():
				# if none of the above conditions are met, we will try to get price from latest user message
				price = self.getPriceFromMessage(price, price_dict, tracker)

		if price not in price_dict.keys():
			# after doing the above, if price is not assigned properly, we will ask user to select price
			dispatcher.utter_message("Please select a price range from above options.")
			check_price = False
		return [SlotSet("check_price_slot", check_price), SlotSet("check_cuisine_slot", cuisine_check), SlotSet("check_op", loc_check), SlotSet("price", price)]

	def getPriceFromMessage(self, price, price_dict, tracker):
		latest_message = (tracker.latest_message)['text']
		try:
			low_list = ['cheap', '300', 'lower', 'cheaper', 'cheapest', 'lowest', 'less', 'lesser']
			mid_list = ['moderate', '700', '300', 'between', 'range', 'budget', 'moderately']
			high_list = ['luxury', '700', 'luxurious', 'expensive', 'costly', 'greater', 'More']
			low_common = [i for i in low_list if i in "".join(latest_message).split()]
			mid_common = [i for i in mid_list if i in "".join(latest_message).split()]
			high_common = [i for i in high_list if i in "".join(latest_message).split()]
			# we will compare the length of above three lists. the list with more elements is considered for price
			highest_list_len = max([len(low_common), len(mid_common), len(high_common)])
			if highest_list_len == len(low_common):
				price = "low"
			if highest_list_len == len(mid_common):
				price = "mid"
			if highest_list_len == len(mid_common):
				price = "high"
		except Exception as e:
			pass
		return price


class CheckCuisine(Action):

	def name(self):
		return 'check_cuisine'

	def run(self, dispatcher, tracker, domain):
		selected_cuisine = tracker.get_slot('cuisine').lower()
		cuisines_list=['chinese','italian','north indian','south indian','american','mexican']
		cuisine_check = True
		loc_check = tracker.get_slot("check_op")
		price_check = tracker.get_slot("check_price_slot")
		if price_check is None:
			price_check = False
		if loc_check is None:
			loc_check = False
		if selected_cuisine is None:
			dispatcher.utter_message("Please select a cuisine from above options.")
			return [SlotSet("check_cuisine_slot", False), SlotSet("check_op", loc_check), SlotSet("check_price_slot", price_check), SlotSet("cuisine", selected_cuisine)]
		elif selected_cuisine not in cuisines_list:
			# if cuisine is misspelled or if there are extra words with cuisine, we will correct it here.
			# using python difflib
			try:
				selected_cuisine_list = selected_cuisine.split()
				for word in selected_cuisine_list:
					close_matches = difflib.get_close_matches(word.lower(), cuisines_list)
					if len(close_matches) > 0:
						selected_cuisine = close_matches[0]
			except Exception as e:
				pass
			finally:
				if selected_cuisine not in cuisines_list:
					dispatcher.utter_message("Please select a cuisine from above options.")
					cuisine_check = False
			return [SlotSet("check_cuisine_slot", cuisine_check), SlotSet("check_op", loc_check), SlotSet("check_price_slot", price_check), SlotSet("cuisine", selected_cuisine)]
		else:
			return [SlotSet("check_cuisine_slot", cuisine_check), SlotSet("check_op", loc_check), SlotSet("check_price_slot", price_check), SlotSet("cuisine", selected_cuisine)]
