'use strict';
/* Sets everything up
 * ------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      9th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Entanglement
 * @codepen:   https://codepen.io/niitettehtsuru/pen/bGEjoPK
 * @license:   GNU General Public License v3.0 
 */ 
let 
circles = [], 
numOfCircles = getRandomNumber(3, 15) ,  
backgroundColor = 0;//black  
function getBrowserWindowSize()//get the width and height of the browser window 
{
    let win = window,
    doc = document,
    offset = 20, 
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    browserWindowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;  
    return {width:browserWindowWidth-offset,height:browserWindowHeight-offset}; 
} 
/**
* Returns a random number between min (inclusive) and max (exclusive)
* @param  {number} min The lesser of the two numbers. 
* @param  {number} max The greater of the two numbers.  
* @return {number} A random number between min (inclusive) and max (exclusive)
*/
function getRandomNumber(min, max) 
{
    return Math.random() * (max - min) + min;
}
function onWindowResize()//called every time the window gets resized
{   
    numOfCircles = getRandomNumber(3, 15);
    let browserWindowSize = getBrowserWindowSize();  
    resizeCanvas(browserWindowSize.width,browserWindowSize.height);  
    circles = createCircles(browserWindowSize);  
    circles.forEach(function(circle)
    {
        circle.setOtherCircles(circles); 
    }); 
} 
function createCircles(screenSize)
{  
    let 
    circs = [],  
    screenWidth = screenSize.width,  
    screenHeight = screenSize.height,
    radius = 50; 
    for(let i = 0; i < numOfCircles; i++)
    {      
        let data = 
        {     
            //set the starting coordinates of the circle 
            xCoord: ~~getRandomNumber(radius,screenWidth-radius),
            yCoord: ~~getRandomNumber(radius,screenHeight-radius),
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            radius: radius,
            unitDistance:~~getRandomNumber(1,5),//starting distance(in pixels) moved per animation frame 
            linkDistance: 200,
            color:getRandomColor()
        };
        circs.push(new Circle(data));   
    }     
    return circs;  
}   
function getRandomColor() 
{
    let colors = ['yellow','cyan','silver','white','magenta','olive','orange','lime','purple']; 
    return colors[~~getRandomNumber(0,colors.length)];  
}
function setup() 
{
    let browserWindowSize = getBrowserWindowSize();  
    createCanvas(browserWindowSize.width,browserWindowSize.height); 
    circles = createCircles(browserWindowSize);  
    circles.forEach(function(circle)
    {
        circle.setOtherCircles(circles); 
    }); 
    document.addEventListener('click',(event)=>//when user clicks on the canvas,
    {    
        onWindowResize();
    });
    window.addEventListener('resize',onWindowResize);  
    background(backgroundColor);   
} 
function draw() 
{     
    smooth(); 
    background(backgroundColor); 
    circles.forEach(function(circle)
    {
        circle.update(); 
        circle.draw(); 
    });   
}