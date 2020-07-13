'use strict'; 
/*  A circle containing connected dots
 * -----------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      9th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Entanglement
 * @codepen:   https://codepen.io/niitettehtsuru/pen/bGEjoPK
 * @license:   GNU General Public License v3.0 
 */
class Circle
{
    constructor(data)
    {          
        this.id = ~~this.getRandomNumber(1,1000000); 
        this.screenHeight = data.screenHeight;  
        this.screenWidth = data.screenWidth;     
        this.xCoord = data.xCoord;//x-coordinate of the center of the circle  
        this.yCoord = data.yCoord;//y-coordinate of the center of the circle  
        this.radius = data.radius;
        this.color = data.color; 
        this.linkDistance = data.linkDistance;
        this.unitDistance = data.unitDistance;//distance moved per animation frame at start
        this.unitDistanceMax = 4;
        this.speed = this.getInitialSpeed();
        this.circles = [];//all the other circles on the screen 
        //create dots to be contained within the circle
        this.dots = this.createDots(~~this.getRandomNumber(3, 8));
        for(let i = 0; i < this.dots.length; i++)
        {   //make each dot aware of all the other dots within the circle
            this.dots[i].setOtherDots(this.dots); 
        }
    } 
    createDots(numOfDots)
    {
        let dots = [];  
        let dotRadius = this.radius/12;
        for(let i = 0; i < numOfDots; i++)
        {
            let x,y;  
            //find a dot that lies completely within this circle
            while(true)
            { 
                //set a square around the center and find an arbitrary point within that square
                x = ~~this.getRandomNumber(this.xCoord-this.radius+1,this.xCoord+this.radius-1);
                y = ~~this.getRandomNumber(this.yCoord-this.radius+1,this.yCoord+this.radius-1); 
                //if the arbitrary point is within the circle
                if(this.dotIsWithinThisCircle({x:x,y:y,r:dotRadius}))
                {
                    break;//we've found a dot
                }
            }     
            let data = 
            {
                xCoord:x,
                yCoord:y, 
                radius:dotRadius,
                color:this.color
            }; 
            dots.push(new Dot(this,data));  
        } 
        return dots; 
    }
    //check if dot lies completely within this circle or not
    dotIsWithinThisCircle(dot) 
    { 
        let dy = this.xCoord - dot.x; 
        let dx = this.yCoord - dot.y; 
        //distance between the center of this circle and the center of the dot
        let distance = Math.sqrt(dx*dx + dy*dy); 
        //The dot lies completely inside this circle without touching each other at a point of circumference
        if (distance + dot.r < this.radius)
        {   
            return true; 
        }
        return false;  
    }  
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
    setOtherCircles(otherCircles)
    {
        let id = this.id; 
        this.circles = 
        otherCircles.filter(function(othercircle)
        {   //Remove this circle from the list of other circles
            //We don't want to compare this circle with itself.
            return othercircle.id !== id; 
        });   
    }
    getInitialSpeed()//set speed at start 
    { 
        let x = Math.random() > 0.5? this.unitDistance:-this.unitDistance; 
        let y = Math.random() > 0.5? this.unitDistance:-this.unitDistance; 
        return {x:x,y:y}; 
    } 
    hitsLeftWall() 
    {
        if(this.xCoord < this.radius)
        {
            return true; 
        }
        return false; 
    }
    hitsRightWall() 
    {
        if(this.xCoord + this.radius > this.screenWidth)
        {
            return true; 
        }
        return false; 
    }
    hitsTopWall() 
    {
        if(this.yCoord < this.radius)
        {
            return true; 
        }
        return false; 
    }
    hitsBottomWall() 
    {
        if(this.yCoord + this.radius > this.screenHeight)
        {
            return true; 
        }
        return false; 
    }
    checkWallCollision() 
    {
        if(this.hitsRightWall())
        {
            this.xCoord = this.screenWidth - this.radius -2;//back off from the right wall 
            this.speed.x = -this.speed.x;//move left
            //flip a coin to move either up or down
            this.speed.y = Math.random() > 0.5? this.speed.y: -this.speed.y;
        }
        else if ( this.hitsLeftWall())
        {
            this.xCoord = this.radius +2;//back off from the left wall 
            this.speed.x = -this.speed.x;//move right
            //flip a coin to move either up or down
            this.speed.y = Math.random() > 0.5? this.speed.y: -this.speed.y; 
        }
        else if (this.hitsTopWall())
        {
            this.yCoord =  this.radius + 2;//back off from the top wall 
            this.speed.y = -this.speed.y;//move up
            //flip a coin to move either right or left
            this.speed.x = Math.random() > 0.5? this.speed.x: -this.speed.x; 
        }
        else if (this.hitsBottomWall())
        {
            this.yCoord = this.screenHeight - this.radius -2;//back off from the bottom wall 
            this.speed.y = -this.speed.y;//move down
            //flip a coin to move either right or left
            this.speed.x = Math.random() > 0.5? this.speed.x: -this.speed.x; 
        }
    } 
    getDistanceBetweenCircles(circle1,circle2) 
    {
        let dx = circle1.xCoord - circle2.xCoord; 
        let dy = circle1.yCoord - circle2.yCoord; 
        let distance = Math.sqrt(dx * dx + dy*dy);//distance between circle centers
        return distance; 
    }
    checkProximityWithOtherCircles()
    {  
        for(let i = 0; i < this.circles.length; i++) 
        {   //so that only one line is drawn(by the circle with the higher id)
            if(this.id > this.circles[i].id)
            { 
                let distance = this.getDistanceBetweenCircles(this,this.circles[i]); 
                if(distance <= this.linkDistance)//if circles are within link distance
                {   
                    //draw a dashed line to link the two circles
                    strokeWeight(0.7);  
                    let delta = 5;   
                    this.linedash(this.dots[0].xCoord,this.dots[0].yCoord,this.circles[i].dots[0].xCoord,this.circles[i].dots[0].yCoord, delta);   
                } 
            }
        }
    }
    /**
    * Draws a dashed line
    * source:https://github.com/processing/p5.js/issues/3336
    * @param  {number} x1 the x-coordinate of the first point
    * @param  {number} y1 the y-coordinate of the first point
    * @param  {number} x2 the x-coordinate of the second point
    * @param  {number} y2 the y-coordinate of the second point 
    * @param  {number} delta the length of (and between) 2 dashes/points
    * @param  {String} style '-' for a dashline, '.'for dots, 'o'for bigger dots (rounds)
    */
    linedash(x1, y1, x2, y2, delta, style = '-') 
    {
        //delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
        let distance = dist(x1,y1,x2,y2);
        let dashNumber = distance/delta;
        let xDelta = (x2-x1)/dashNumber;
        let yDelta = (y2-y1)/dashNumber;
 
        for (let i = 0; i < dashNumber; i+= 2)  
        {
            let xi1 = i*xDelta + x1;
            let yi1 = i*yDelta + y1;
            let xi2 = (i+1)*xDelta + x1;
            let yi2 = (i+1)*yDelta + y1;

            if (style === '-') 
            { 
                line(xi1, yi1, xi2, yi2); 
            }
            else if (style === '.') 
            { 
                point(xi1, yi1);  
            }
            else if (style === 'o') 
            { 
                ellipse(xi1, yi1, delta/2); 
            }
          }
    }
    update() 
    {   
        //randomly change the angle of movement in the current direction 
        this.speed.x += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        this.speed.y += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        //put a cap on the maximum speed that this circle can go
        if(Math.abs(this.speed.x)>this.unitDistanceMax)
        {
            this.speed.x = this.speed.x > 0? this.unitDistanceMax:-this.unitDistanceMax; 
        }
        if(Math.abs(this.speed.y)>this.unitDistanceMax)
        {
            this.speed.y = this.speed.y > 0? this.unitDistanceMax:-this.unitDistanceMax; 
        } 
        //keep the circle moving in its current direction
        this.xCoord += this.speed.x; 
        this.yCoord += this.speed.y;  
        this.checkWallCollision(); 
        this.checkProximityWithOtherCircles(); 
       //update dots within the circle
        for(let i = 0; i < this.dots.length; i++)
        {   //if dot has strayed too far from the circle
            if(this.dots[i].markedForDeletion)
            {   
                this.dots.splice(i,1);//get rid of that dot 
                this.dots.push(this.createDots(1)[0]);//create a new dot in its place
                //make the new dot aware of all the other dots in this circle
                this.dots[this.dots.length-1].setOtherDots(this.dots);
                break; 
            }  
            this.dots[i].update();  
        } 
    } 
    draw()//draw all the dots contained within this circle
    {     
        this.dots.forEach(function(dot)
        {
            dot.draw(); 
        }); 
    }
}