# db-meter

https://takispig.github.io/db-meter/<br><br>
Simple Webinterface to estimate the noise level in Decibels.  
Values are not precise, but mainly represent differencies in noise levels in a short period of time.

![Website](/demo.png)

## Algorithm
In this project I tried to get the noise level for different frequencies, take the average out of them, and then again take the average of all such values within the time intervall of a specific refresh_rate (in msec). Afterwards I applied the formula $20*log10(noiseValue)$ to get a number indication near to Decibel, and added the offset value.  

## Offset & Refresh Rate
To cope with the environmental noises and different microphone sensitivities, I have set an adjustable offset value, which just increases or increases the dBs. As default, the value of 30 has been chosen, as it yields the best results (at least for me).  
Furthermore, the refresh rate for the dBs is adjustable too (default 1 sec).  

## Technnical Details
For the Webinterface has been used HTML5, CSS and JavaScript. The code for the Decibel estimation has been written in JavaScript with Web Audio API, and more specific with the AudioContext Interface.
