'use strict';
/* The dots that connect on the screen
 * -----------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      9th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Entanglement
 * @codepen:   https://codepen.io/niitettehtsuru/pen/bGEjoPK
 * @license:   GNU General Public License v3.0 
 */
class Dot
{
    constructor(parent,data)
    {     
        this.id = ~~this.getRandomNumber(1,1000000);
        this.parent = parent; //the circle within which this dot is contained
        this.xPrevParent = parent.xCoord;//former x-coordinate of parent 
        this.yPrevParent = parent.yCoord;//former y-coordinate of parent 
        this.xCoord = data.xCoord;//x-coordinate of the center of the dot
        this.yCoord = data.yCoord;//y-coordinate of the center of the dot  
        this.radius = data.radius;
        this.color = data.color; 
        this.unitDistance = 1;//distance moved per animation frame 
        this.speed = this.getInitialSpeed();
        this.dots = [];//the other dots contained within the parent circle
        this.markedForDeletion = false; 
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
    getInitialSpeed()
    { 
        let x = Math.random() > 0.5? this.unitDistance:-this.unitDistance; 
        let y = Math.random() > 0.5? this.unitDistance:-this.unitDistance; 
        return {x:x,y:y}; 
    } 
    setOtherDots(otherDots)
    {
        let id = this.id;
        this.dots =    
        otherDots.filter(function(otherDot)
        {//Remove this dot from the list of other dots
         //We don't want to compare this dot with itself.
            return otherDot.id !== id; 
        }); 
    }    
    checkCollisionWithWallOfParent() 
    {
        let dy = this.parent.xCoord - this.xCoord; 
        let dx = this.parent.yCoord - this.yCoord; 
        let distance = Math.sqrt(dx*dx + dy*dy); 
        //If this dot touches the parent circle on the circumference, 
        //does not lie completely inside the parent, or is outside of the parent. 
        if (distance + this.radius >= this.parent.radius)
        { 
            //dot is moving downwards to the right
            if(this.speed.x > 0 && this.speed.y > 0)
            {
                this.xCoord -= 4 * this.unitDistance;//back up to the left
                this.yCoord -= 4 * this.unitDistance;//back up to the top 
                this.speed.x = Math.random() > 0.5? this.speed.x: -this.speed.x; 
                this.speed.y = -this.speed.y;  
            }//dot is moving upwards to the right
            else if(this.speed.x > 0 && this.speed.y < 0)
            {
                this.xCoord -= 4 * this.unitDistance;//back up to the left
                this.yCoord += 4 * this.unitDistance;//back up to the bottom
                //move in opposite direction 
                this.speed.x = -this.speed.x; 
                this.speed.y = Math.random() > 0.5? this.speed.y: -this.speed.y;  
            }//dot is moving upwards to the left
            else if(this.speed.x < 0 && this.speed.y < 0)
            {
                this.xCoord += 4 * this.unitDistance;//back up to the right
                this.yCoord += 4 * this.unitDistance;//back up to the bottom
                //move in opposite direction
                this.speed.x = Math.random() > 0.5? this.speed.x: -this.speed.x;  
                this.speed.y = -this.speed.y; 
            }//dot is moving downwards to the left
            else if(this.speed.x < 0 && this.speed.y > 0)
            {
                this.xCoord += 4 * this.unitDistance;//back up to the right
                this.yCoord -= 4 * this.unitDistance;//back up to the top
                //move in opposite direction
                this.speed.x = -this.speed.x;
                this.speed.y = Math.random() > 0.5? this.speed.y: -this.speed.y;  
            }
        }  
        //if this dot has strayed too far from the parent circle
        if (distance > this.radius*2 + this.parent.radius)
        {    
            this.markedForDeletion  = true; 
            return; 
        } 
    }
    update() 
    {  
        //set the position of this dot relative to the moving parent
        let dx = Math.abs(this.xPrevParent - this.parent.xCoord);
        let dy = Math.abs(this.yPrevParent - this.parent.yCoord); 
        if(this.parent.speed.x > 0)//if parent is going right
        {
            this.xCoord+=dx; 
        }
        else if(this.parent.speed.x < 0)//if parent is going left
        {
            this.xCoord-=dx; 
        } 
        if(this.parent.speed.y > 0)//if parent is going down
        {
            this.yCoord+=dy; 
        }
        else if(this.parent.speed.y < 0)//if parent is going up
        {
            this.yCoord-=dy; 
        } 
        this.xPrevParent = this.parent.xCoord;
        this.yPrevParent = this.parent.yCoord;
        //keep the dot moving in its current direction
        this.xCoord += this.speed.x; 
        this.yCoord += this.speed.y;  
        this.checkCollisionWithWallOfParent();     
    } 
    drawLinkToOtherDots()
    {
        let id = this.id; 
        let x = this.xCoord; 
        let y = this.yCoord; 
        this.dots.forEach(function(dot)
        {
            if(id > dot.id && !dot.markedForDeletion)
            {
                let dx = dot.xCoord - x; 
                let dy = dot.yCoord - y; 
                let distance = Math.sqrt(dx*dx + dy*dy); 
                if(distance < 50) 
                {
                    stroke('white'); 
                    strokeWeight(0.7);
                    line(x,y,dot.xCoord,dot.yCoord); 
                } 
            }
        }); 
    }
    draw()//draw the dot 
    { 
        noStroke();
        fill(this.color); 
        ellipse(this.xCoord,this.yCoord,this.radius*2,this.radius*2);  
        fill('black'); 
        ellipse(this.xCoord,this.yCoord,this.radius,this.radius);  
        this.drawLinkToOtherDots(); 
    }
}

 