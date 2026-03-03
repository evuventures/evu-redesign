export default class Matrix{
    constructor(){

        this.createRects()
        this.createMatrix()
        
    }
    createRects(){

        this.canvas = document.querySelector('.header-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.w = this.canvas.width = document.body.offsetWidth;
        this.h = this.canvas.height = document.body.offsetHeight;
        const cols = Math.floor(this.w / 20) + 1;
        this.yPosition = Array(cols).fill(0);

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.w, this.h);


    }
    createMatrix(){
        this.ctx.fillStyle = '#0001';
        this.ctx.fillRect(0, 0,this.w, this.h);
        
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '34pt monospace';
        
        this.yPosition.forEach((y, index) => {
            const charSets = [
            '2254547948',               // binary
            '@#$%^&*+=',        // special
            ];
            const chars = charSets[index % charSets.length]; // rotate sets
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = index * 50;
            this.ctx.fillText(text, x, y);
            if (y > 10 + Math.random() * 10000) this.yPosition[index] = 0;
            else this.yPosition[index] = y + 15;
        });
    }
}