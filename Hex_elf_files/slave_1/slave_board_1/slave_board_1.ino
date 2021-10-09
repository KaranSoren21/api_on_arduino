#include <Wire.h>
#include <LiquidCrystal.h>
const int maxlength = 64;
char buffer[maxlength];
char printable[maxlength];
const int motor =6;
const int motor2 =8;
const int LED1 =13;
const int LED2 =9;
int received = 0;

//initialize the library with the numbers of the interface pins
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
//String msg = "Hello";

void setup() {
  Serial.begin(57600);
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event
  pinMode(motor,OUTPUT);
  pinMode(motor2,OUTPUT);
  pinMode(LED1,OUTPUT);
  pinMode(LED2,OUTPUT);
  //set up the LCD's number of columns and rows:
    lcd.begin(16,2);
  //print a message to the LCD.
  //String message = String(loop1());
  //lcd.print(message);
             // start serial for output
}
//-------------------------------------------------------slave board Sketch---------------------------------------------------
void loop() {
    if (received > 0) {
    memcpy(printable, buffer, maxlength);

    for (int i = 0; i < received; i++) {
      Serial.print(printable[i]);
    }
    Serial.println(""); 
    received = 0;
  }
  String message = String(printable);
  //Serial.println(message);
  int signal_1 = message.toInt();
  Serial.println(signal_1);
  String signal_2 = String(signal_1)+"*C";
  Serial.println(signal_2);
  Serial.println(message);
  //Serial.println(signal_2.charAt(2,4));
  if(signal_2 == message)
  {
    if(signal_1 > 38)
    {
      digitalWrite(motor,HIGH);
      //digitalWrite(motor2,HIGH);
      digitalWrite(LED1,HIGH);
    }
    else if(signal_1 < 39)
    {
      digitalWrite(motor,LOW);
      //digitalWrite(motor2,LOW);
      digitalWrite(LED1,LOW);
    }
  }
  
  String signal_3 = String(signal_1)+"%RH";
  Serial.println(signal_3);
  if(signal_3 == message)
  {
    if(signal_1 > 49)
    {
      //digitalWrite(motor,HIGH);
      digitalWrite(motor2,HIGH);
      digitalWrite(LED2,HIGH);
    }
    else if(signal_1 < 50)
    {
      //digitalWrite(motor,LOW);
      digitalWrite(motor2,LOW);
      digitalWrite(LED2,LOW);
    }
 }
lcd.clear();
lcd.setCursor(0,0);
lcd.print(message);
delay(250);
lcd.clear();  
// function that executes whenever data is received from master
// this function is registered as an event, see setup()
void receiveEvent(int howMany) {
  received = howMany;
  memset(buffer, 0, maxlength);

  for (int i = 0; i < howMany; i++) {
    buffer[i] = Wire.read();
  }
}
