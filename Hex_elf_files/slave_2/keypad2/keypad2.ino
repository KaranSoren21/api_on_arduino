#include <LiquidCrystal.h>
#include <Servo.h>
#include <Keypad.h>
#include <Wire.h>
const int led = 13;
int inPin = 9;
int val = 0;
const int maxlength = 64;

char buffer[maxlength];
char printable[maxlength];

int received = 0;
int pos = 0;
//int signal_1 = 0;
String signal_1 ="";

const byte ROWS = 4; //four rows
const byte COLS = 3; //three columns
char keys[ROWS][COLS] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'#','0','*'}
};
byte rowPins[ROWS] = {8, 7, 2, 3}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {4, 5, 6}; //connect to the column pinouts of the keypad
String msg;
Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );
Servo ServoMotor;
Servo ServoMotor1;
LiquidCrystal lcd(12, 11, A0, A1, A2, A3);

void setup(){

  Serial.begin(57600);
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event
  pinMode(led, OUTPUT); //declare LED as output
  pinMode(inPin,INPUT); //declare pushbutton as input
  ServoMotor.attach(10);
  ServoMotor1.attach(13);  
  lcd.begin(16,2);
}

void loop()
{
  //delay(1000);
  val = digitalRead(inPin);
  if (received > 0) 
  {
          memcpy(printable, buffer, maxlength);
      
          for (int i = 0; i < received; i++) 
          {
             Serial.print(printable[i]);
          }
          Serial.println(""); 
          received = 0;
  }
  String message = String(printable);
  back: 
  if(message == "HIGH")
  {
    signal_1 = "HIGH";
  }
  else if(message == "LOW")
  {
    signal_1 = "LOW";
  }
  
  char key = keypad.getKey();
   
  
   if(signal_1 == "HIGH")
   {    
        if (key != NO_KEY)
        {
           //Serial.println(key);
           lcd.print("*");
           msg = msg+String(key);
       
                if (msg == "1234" && msg.length() == 4)
                {
                    ServoMotor1.write(0);
                    delay(250);
                    ServoMotor.write(0);
                    msg = "";
                    val = LOW;
                    //delay(500);
                    //lcd.clear();
                    //delay(500);
                    lcd.clear();
                    lcd.print("VaultUnlock");
                    delay(100);
                    lcd.clear();
                    lcd.print("PressPushButton To Lock");
                    delay(500);
                    lcd.clear();
                    //lcd.clear();
                }
                else if(msg.length() > 3)
                {
                  if(keypad.getKey() != "1")
                  {
                    if(keypad.getKey() != "2")
                    {
                      if(keypad.getKey() != "3")
                      {
                        if(keypad.getKey() != "4")
                        {
                            msg = "";
                            lcd.clear();
                            lcd.print("Wrong Password");                  
                            delay(200);
                            lcd.clear();
                            
                            goto back; 
                        }
                      }
                    }
                  }
                  
                }
        }
        
  }
  else if(signal_1 == "LOW")
  {
      ServoMotor.write(90);
      delay(250);
      ServoMotor1.write(90);
      //msg = "";
     // lcd.clear();
      //delay(500);
      lcd.print("PressPushButton To Access Keypad");
      delay(500);
      lcd.clear();
  }
}

// function that executes whenever data is received from master
// this function is registered as an event, see setup()

void receiveEvent(int howMany) {
  received = howMany;
  memset(buffer, 0, maxlength);

  for (int i = 0; i < howMany; i++) {
    buffer[i] = Wire.read();
  }
}
