from Hologram.HologramCloud import HologramCloud

import requests
import sys

hologram = HologramCloud(dict(), network='cellular')

try:
	hologram.network.connect()

except:
	pass

try:
	hologram.openReceiveSocket()

except:
	pass

while True:

	try:

		message = hologram.popReceivedMessage()

		if message != None:

			print('RECEIVED: ' + message)

			response = requests.post('http://localhost:' + sys.argv[1] + '/', data=message).text

			hologram.sendMessage(response, topics=['UHAPI'])

			print('RESPONSE: ' + response)

	except:
		pass