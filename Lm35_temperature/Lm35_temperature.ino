#define LM35 A1
#define __relay LED_BUILTIN
String inputString = "";
bool stringComplete = false;
float tempr = 0.0;
void setup(){
  pinMode(__relay, OUTPUT);
  digitalWrite(__relay, LOW);
  Serial.begin(9600);
}
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}
volatile static long unsigned int time_now =0;
void loop() {
  // put your main code here, to run repeatedly:
  if (time_now < millis())
  {
  time_now = 1000 + millis();
  float lmvalue = analogRead(LM35);
  tempr = (lmvalue * 500)/1023;
  // Serial.println(tempr);
  }
  // if(tempr>50){
  //   digitalWrite(__relay, HIGH);
  // }
  // else if(tempr<45){
  //   digitalWrite(__relay, LOW);
   //}
 // delay(1000);
    // print the string when a newline arrives:
  if (stringComplete) {
    Serial.println(inputString);
    if((inputString[0]=='#')&&(inputString[1]=='L')&&(inputString[2]=='O')&&(inputString[3]=='N')){
      digitalWrite(__relay, HIGH);
    }
    else if((inputString[0]=='#')&&(inputString[1]=='L')&&(inputString[2]=='O')&&(inputString[3]=='F')){
      digitalWrite(__relay, LOW);
    }
    inputString = "";
    stringComplete = false;
  }
}
 