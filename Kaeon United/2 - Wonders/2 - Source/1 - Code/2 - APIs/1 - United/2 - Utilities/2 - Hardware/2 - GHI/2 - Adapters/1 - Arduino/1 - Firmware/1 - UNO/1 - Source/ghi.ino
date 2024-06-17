char receivedChar;
String message = "";

bool myPins[] = {
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false
};

void setup() {
	
	pinMode(2, INPUT);
	pinMode(3, OUTPUT);
	pinMode(4, INPUT);
	pinMode(5, OUTPUT);
	pinMode(6, OUTPUT);
	pinMode(7, INPUT);
	pinMode(8, INPUT);
	pinMode(9, OUTPUT);
	pinMode(10, OUTPUT);
	pinMode(11, OUTPUT);
	pinMode(12, INPUT);
	pinMode(13, INPUT);
	
	Serial.begin(9600);
}

void loop() {
	getChar();
}

String getInput() {
	
	String input = "";
	
	for(int i = 2; i <= 13; i++) {
		
		char write = 0;
		
		if((i == 2 || i == 4 || i == 7 || i == 8 || i == 12 || i == 13) && !myPins[i - 2])
			write = digitalRead(i);
		
		input = String(input + write);
	}
	
	char writeA0 = analogRead(A0);
	char writeA1 = analogRead(A1);
	char writeA2 = analogRead(A2);
	char writeA3 = analogRead(A3);
	char writeA4 = analogRead(A4);
	char writeA5 = analogRead(A5);
	
	return String(input + writeA0 + writeA1 + writeA2 + writeA3 + writeA4 + writeA5);
}

void getChar() {
	
	if(Serial.available() > 0) {
		
		char read = Serial.read();
		
		message = String(message + read);
		
		if(message.length() == 12) {
			
			execute(message);
			
			message = "";
		}
	}
}

void execute(String message) {
	
	for(int i = 0; i < message.length(); i++) {
		
		int pin = i + 2;
		
		if(pin == 2 || pin == 4 || pin == 7 || pin == 8 || pin == 12 || pin == 13) {
			
			if(message[i] != 0) {
				
				if(!myPins[i]) {
					
					pinMode(pin, OUTPUT);
					digitalWrite(pin, HIGH);
					
					myPins[i] = true;
				}
			}
			
			else {
				
				if(myPins[i]) {
					
					digitalWrite(pin, LOW);
					pinMode(pin, INPUT);
					
					myPins[i] = false;
				}
			}
		}
		
		else {
			analogWrite(pin, message[i]);
		}
	}
	
	Serial.println(getInput());
}