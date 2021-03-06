# API's library for Arduino board Simulator using Javascript
This is my final semester project, designed to teach students or any user on the Johnny-Five library. This project shows how to link the provided Johnny-Five API library with Arduino and its components using a simulator. Students can learn to access Arduino and other devices without touching them with the simulator. Three Arduino boards are used, one as the master and the other two as slaves. A connection is established between the boards using the I2C communication protocol. List of components used with Arduino boards : Resistors of 100 ohms, Compim, three fan-DC, led of yellow, blue, green, red color and three servo motor. I have created a web interface for the Arduino board and its components. With this web interface, I can control the Arduino board and its components under the node js server.
# Setup to run this repository 
* This project runs on Windows only.
* [Proteus Design Suite](https://drive.google.com/file/d/1gbbFzqiOJLbuXTZVpuAQv4Z81nWY2qWh/view?usp=sharing)
* [com0com](https://github.com/KaranSoren21/api_on_arduino/wiki/com0com-setup#com0com-1)
* [Node js](https://nodejs.org/en/)
* [Visual C++ Build Environment](https://github.com/KaranSoren21/api_on_arduino/wiki/Visual-C---Build-Environment)<br>

**The following commands need to run on the command prompt. Copy the address of this project file in which this file is located into the computer system. And paste it as (For Examples) *`cd C:\Users\User_name\ Documents\api_on_arduino`* on the command prompt. Run these following commands under this address.**

* `npm install -g node-gyp`
* `npm config set msvs_version 2019 (depend on versions of Visual Studio)`
* `npm install johnny-five` 
* `npm install socket.io`
* `npm install express`

**Command to run this project on the command prompt. Run this command under this address.**
* `node *file_name.js*. For example: node server.js`

**Run the Simulation Software - Proteus Design Suite**
* ..\proteus_file\main_file.pdsprj

**Open any browser like [Google Chrome](https://www.google.com/intl/en_in/chrome/) or [Microsoft Edge](https://www.microsoft.com/en-us/edge) or [Internet Explorer](https://www.microsoft.com/en-us/download/details.aspx?id=41628) etc.** 
* Type in the URL : `local:8080`

**Command to stop a running project. Run this command under this address**
* `ctrl+c` or `ctrl+d` or `.exit`
# Output of this project 
![Animation1](https://user-images.githubusercontent.com/70742988/136711061-5dc1eaae-5244-415a-b19c-67d0256d98f0.gif)
