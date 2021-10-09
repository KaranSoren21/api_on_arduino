const express=require("express");
const socket=require("socket.io");
// App setup
const PORT = 8080;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);
// johnny-five setup
var five = require("johnny-five");
var board = new five.Board({ port: "COM4" });
var myLed, myPin,myLed2,myPin2,myLed3,myPin3,myPin4,myLed4,motor,myPin5,servo,myPin6;

board.on("ready",function(){
        console.log("Board ready");
        
        //pin no.13 setup for green led
        myLed=new five.Led(13);
        console.log("GREEN LED instance created");
        myPin=new five.Pin(13);
        console.log("Digital pin created at 13");
        
        //pin no.12 setup for red led
        myLed2=new five.Led(12);
        console.log("RED LED instance created");
        myPin2=new five.Pin(12);
        console.log("Digital pin created at 12");

        //pin no.8 setup for yellow led
        myLed3=new five.Led(8);
        console.log("YELLOW LED instance created");
        myPin3=new five.Pin(8);
        console.log("Digital pin created at 8");

        //pin no.7 setup for blue led
        myLed4=new five.Led(7);
        console.log("YELLOW LED instance created");
        myPin4=new five.Pin(7);
        console.log("Digital pin created at 7");

        //pin no.3 setup for fan motor
        console.log("Digital Pin created at 3.");
        myPin5=new five.Pin(3);
        motor =new five.Motor(3);
        console.log("Motor instance created");
       
        //pin no.10 setup for servo motor
        console.log("Digital Pin created at pin no. 10.");
        myPin6=new five.Pin(10);
        console.log("Servo instance created at pin no. 10.");
        servo = new five.Servo.Continuous(10);
        
        //initializing the lcd
        var lcd = new five.LCD({ pins: [11, 9, 6, 5, 4, 2] });

        //i2c configuration
        var write = (message) => {
          this.i2cWrite(0x08, Array.from(message, c => c.charCodeAt(0)));
        };
        this.i2cConfig();
        this.repl.inject({ write });
        console.log("Master and Slave boards configuration is initiated");
        
        //i2c configuration for temp
        var write_temp = (message) => {
          this.i2cWrite(0x08, Array.from(message, c => c.charCodeAt(0)));
        };
        this.i2cConfig();
        this.repl.inject({ write_temp });
        console.log("Master and Slave boards configuration is initiated for temperature");

        //i2c configuration for second slave
        
        var write_vault = (message) => {
          this.i2cWrite(0x08, Array.from(message, c => c.charCodeAt(0)));
        };
        this.i2cConfig();
        this.repl.inject({ write_vault });
        console.log("Master and Slave boards configuration is initiated for vault");
        
        var button = new five.Button("A0");

        var button_1 = new five.Button("A1");

        //initialize socket once board is ready
        io.on("connection", function (socket) {
           console.log("New connection id:"+socket.id);
           io.sockets.emit('c_msg','Connected');
           io.sockets.emit('con_id',socket.id);
       
        //sending green led state upon new connection
        myPin.query(function(state){
          var led_state=state.state;
          console.log("Broadcasting Pin 13 state:"+state.state);
          socket.emit("led-state", led_state);
        });

        //sending red led state upon new connection
        myPin2.query(function(state){
          var led_state2=state.state;
          console.log("Broadcasting Pin 12 state:"+state.state);
          socket.emit("led-state2", led_state2);
        });

        //sending yellow led state upon new connection
        myPin3.query(function(state){
          var led_state3=state.state;
          console.log("Broadcasting Pin 8 state:"+state.state);
          socket.emit("led-state3", led_state3);
        });  

        //sending yellow led state upon new connection
        myPin4.query(function(state){
          var led_state4=state.state;
          console.log("Broadcasting Pin 7 state:"+state.state);
          socket.emit("led-state4", led_state4);
        });
        

        //sending motor state upon new connection
        myPin5.query(function(state){
          var fan_state=state.state;
          console.log("Broadcasting Pin 3 state:"+state.state);
          socket.emit("fan-state", fan_state);
        });
          
        //sending servo state upon new connection
        myPin6.query(function(state){
          var servo_state=state.state;
          console.log("Broadcasting Pin 10 state:"+state.state);
          socket.emit("servo--state", servo_state);
        });

        // client msg processing
        socket.on("client-msg", function(msg){
        lcd.clear().print(msg);
        console.log("Message received msg:"+msg);
        });

        // Turning OFF Locker processing
        socket.on("client-msg1", function(msg){
  
        //lcd.clear().print(msg);
        //console.log("Message received msg:"+msg);
        write_vault(msg);
        });
        

        //setup for TH02 sensor
        var temp = new five.Thermometer({
          controller: "TH02",
        });
        //temperature function
        temp.on("change", ()=>{
            const {celsius, fahrenheit, kelvin} = temp;
            console.clear();
            console.log("Temp in Celsius " + celsius);
            io.sockets.emit('temperature', celsius);
            lcd.clear().print('temperature in Cel:'+ celsius);
            write_temp(celsius+"*C");
        });

        var hygro = new five.Hygrometer({
          controller: "TH02",
        });
        //temperature function
        hygro.on("change", function(){
          console.clear();
          console.log("Relative Humidity " + this.relativeHumidity);
          io.sockets.emit('hygrometer',this.relativeHumidity);
          lcd.clear().print('relative humidity:'+ this.relativeHumidity);
          write(this.relativeHumidity+"%RH");
        });
        
        button.on("release", function() {

            lcd.clear().print('Enter the 4 Digit Password');
            write_vault("HIGH");
         
        }); 
        
        button_1.on("release", function() {
       
           write_vault("LOW");
        
        }); 

       // lcd.clear().print('University of Hyderabad');
        //green led toggle function
        socket.on("led-toggle", function(state){
        //jhonny-five code here
          if(state){
            myLed.on();
            lcd.clear().print("Green LED ON");
            write("Green Led On");
          }
          else {
            myLed.off();
            lcd.clear().print("Green LED OFF");
            write("Green Led OFF");
          }
          console.log("GREEN LED "+state);
          myPin.query(function(state){
            console.log("Pin 13 state:"+state.state); 
            socket.broadcast.emit("led-state", state.state);
            socket.emit("led-state",state.state);                         
          });
        });         
          
        // Red led toggle function
        socket.on("led-toggle2", function(state){
        //jhonny-five code here
          if(state){
            myLed2.on();
            lcd.clear().print("Red LED ON");
            write("Red Led On");
          } 
          else {
            myLed2.off();
            lcd.clear().print("Red LED OFF");
            write("Red Led OFF");
          } 
          console.log("RED LED "+state);
          myPin2.query(function(state){
            console.log("Pin 12 state:"+state.state);
            socket.broadcast.emit("led-state2", state.state);
            socket.emit("led-state2",state.state);
          });
        });

        // Yellow led toggle function
        socket.on("led-toggle3", function(state){
        //jhonny-five code here
          if(state){
            myLed3.on();
            lcd.clear().print("Yellow LED ON");
            write("Yellow LED ON");          
          }
          else{ 
            myLed3.off();
            lcd.clear().print("Yellow LED OFF");
            write("Yellow LED OFF");
          }
          console.log("YELLOW LED "+state);
          myPin3.query(function(state){
            console.log("Pin 8 state:"+state.state); 
            socket.broadcast.emit("led-state3", state.state);
            socket.emit("led-state3",state.state);
          });
        });

          // Blue led toggle function
        socket.on("led-toggle4", function(state){
          //jhonny-five code here
          if(state){
            myLed4.on();
            lcd.clear().print("Blue LED ON");
            write("Blue LED ON");
          }
          else{  
            myLed4.off();
            lcd.clear().print("Blue LED OFF");
            write("Blue LED OFF");
          }
          console.log("Blue LED "+state);
          myPin4.query(function(state){
            console.log("Pin 7 state:"+state.state); 
            socket.broadcast.emit("led-state4", state.state);
            socket.emit("led-state4",state.state);
          });
        }); 
        
        // Fan toggle function
        socket.on("fan-toggle5", function(state){
          //jhonny-five code here
          if(state) { 
            motor.forward(120);
            lcd.clear().print("Fan ON");
            write("FAN ON");
          } 
          else
          {  
            motor.stop();
            lcd.clear().print("Fan OFF");
            write("Fan OFF"); 
          }             
          console.log("FAN "+state);
          myPin5.query(function(state){
            console.log("Pin 3 state:"+state.state); 
            socket.broadcast.emit("fan-state", state.state);
            socket.emit("fan-state",state.state);
          });
        });     
          
        socket.on("servo-toggle", function(state){
          //jhonny-five code here
          if(state)
          {
            //servo lock
            servo.to(180);
            lcd.clear().print("Door Close");                   
            console.log("Servo state : Lock");
            write("Door Close");
          }
          else
          {
            //servo unlock
            servo.stop(); 
            lcd.clear().print("Door Open");       
            console.log("Servo state : unlock");
            write("Door Open");
          }
          console.log("Servo "+state);
          myPin6.query(function(state){
            console.log("Pin 10 state:"+state.state); 
            socket.broadcast.emit("servo--state", state.state);
            socket.emit("servo--state",state.state);
          });
        });                         
      }); 
});
