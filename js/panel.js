/*
function processImage(){
    step = 5;
    img = new Image();
    img.src = "brand2.png";
    img.onload = function() {
        var c = document.createElement('canvas'), d, img = this;
        if(!this.canvas) {
            this.canvas = $('<canvas />')[0];
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
        width = Math.floor(this.canvas.width)-1;
        height =Math.floor(this.canvas.height)-1;

        var counter = 0;
        var invValue;
        var filter = 0;
        
        var downPos = 0;
        var upPos = height;
        var rightPos = 0;
        var leftPos = width;
        var value = 0;
        var invValue = 0;
        var valueT = 0;
        yg = 0;
        xg = 0;

        var xx = 0;
        var y = 0;
        var counterPix = 0;
        var pix = 0;

        var totalArea = 0;
        var area = 0;

        var limit = Math.floor((width+1)/step)*Math.floor((height+1)/step);

        var startTime = new Date(), outputDiv = document.getElementById('outputTime');

        for (var x = 0; x <= width; x = x+step) {
            for (var y = 0; y <= height; y= y+step) {
                pixelData = this.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                invValue = Math.floor((pixelData[0] * 299 + pixelData[1] * 587 + pixelData[2] * 114) / 2550);
                value = 100 - invValue;
                counter++;

                if (value > filter && pixelData[3] > 0) {
                    counterPix++;
                    yg = yg + (y * value);
                    xg = xg + (x * value);
                    valueT = valueT + value;

                    if (downPos <= y) {
                        downPos = y;
                    }
                    if (upPos >= y) {
                        upPos = y;
                    }
                    if (leftPos >= x) {
                        leftPos = x;
                    }
                    if (rightPos <= x) {
                        rightPos = x;
                    }

                    totalArea = totalArea + ((pixelData[0]+1)*(pixelData[1]+1)*(pixelData[2]+1)*(pixelData[3]+1));
                }
                if(counter >= limit){
                    ygFinal =  Math.floor(yg / valueT);
                    if(!ygFinal>0){ygFinal=Math.floor(height/2)};
                    xgFinal =  Math.floor(xg / valueT);
                    if(!xgFinal>0){xgFinal=Math.floor(width/2)};
                    var tempFullArea = ((width+1)/step)*((height+1)/step)*256;
                    area = Math.floor(totalArea*10000/tempFullArea)/100;
                    rightPos = rightPos+step;
                    downPos = downPos + step;
                    $('#output').html('xg: '+ xgFinal+'    yg: '+ygFinal+'<br><br>downPos: '+ downPos+'    upPos: '+upPos+'    leftPos: '+ leftPos+'    rightPos: '+rightPos+'<br><br>counter: '+ counter+'    counterPix: '+counterPix+'<br><br>Area:'+area+'%');
                    $('#xg').width(xgFinal);
                    if(xgFinal>36 && ygFinal>36){
                        $('#xg').html('<div><span>xg</span></div>');
                        $('#yg').html('<div><span>yg</span></div>');
                    }
                    $('#yg').height(ygFinal);
                    $('#left').width(leftPos);
                    $('#right').width(rightPos);
                    $('#top').height(upPos-1);
                    $('#bottom').height(downPos);
                    outputDiv.innerHTML = "ms since the start: " + (new Date() - startTime);
                }
            }
        }
    }
}
*/
var imgSrc;

var imageData = [];

function uploadImage(){
    imgSrc = null;
    $("#uploadImage").on("change", function(){
        // Get a reference to the fileList
        var files = !!this.files ? this.files : [];
     
        // If no files were selected, or no FileReader support, return
        if (!files.length || !window.FileReader) return;
     
        // Only proceed if the selected file is an image
        if (/^image/.test( files[0].type)){
     
            // Create a new instance of the FileReader
            var reader = new FileReader();
     
            // Read the local file as a DataURL
            reader.readAsDataURL(files[0]);
     
            // When loaded, set image data as background of div
            reader.onloadend = function(){
                //$("#uploadPreview").attr("src", this.result);
                imgSrc = this.result;
                generate(imgSrc);
            };
     
        }
     
    });
}

var getEta = function (t,startTime,a,step){
    var partialTime = new Date();
    var difTime =  partialTime - startTime;
    var eta = (a/step/step)*(partialTime-startTime)/t;
    var timeRem = Math.floor(eta-difTime);
    return([eta,timeRem]);
};
function multiple(value, multiple)
{
    rest = value % multiple;
    if(rest==0)
        return true;
    else
        return false;
}
function generate(imgSrc){
    var done = false;
    
    imageData = [];
    img = new Image();
    if(imgSrc == null || imgSrc == undefined){
        img.src = "brand.png";
    }
    else{
       img.src =  imgSrc;
    }
    img.onload = function() {
        var c = document.createElement('canvas'), d, img = this;
        if(!this.canvas) {
            this.canvas = $('<canvas />')[0];
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
        width = Math.floor(this.canvas.width)-1;
        height =Math.floor(this.canvas.height)-1;

        var filter = 5;
        step = 1;
        var a = width*height;
        if(a>66000){
            step = 2;
        }
        if(a>95000){
            step = 3;
        }
        if(a>1300000){
            step = 5;
        }
        if(a>2600000){
            step = 8;
        }
        if(a>5400000){
            step = 13;
        }

        var counter = 0;
        
        var downPos = 0;
        var upPos = height;
        var rightPos = 0;
        var leftPos = width;
        var value = 0;
        var invValue = 0;
        var valueT = 0;
        yg = 0;
        xg = 0;

        var xx = 0;
        var y = 0;
        var counterPix = 0;
        var pix = 0;

        var totalArea = 0;
        var area = 0;

        var limit = Math.floor((width+1)/step)*Math.floor((height+1)/step);

        var startTime = new Date(), outputDiv = document.getElementById('outputTime');

        pixelData = null;

        for (var x = 0; x <= width; x = x+step) {
            //console.time('test')
            for (var y = 0; y <= height; y= y+step) {
                pixelData = this.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
                invValue = Math.floor((pixelData[0] * 299 + pixelData[1] * 587 + pixelData[2] * 114)/2550);
                value = 100 - invValue;
                var alpha = pixelData[3];
                value = Math.floor(value* alpha / 255);
                counter++;
                imageData[counter] = value;

                if (value > filter && alpha > 0) {
                    counterPix++;

                    yg = yg + (y * value);
                    xg = xg + (x * value);
                    valueT = valueT + value;

                    if (downPos <= y && downPos<=height) {
                        downPos = y;
                    }
                    if (upPos >= y) {
                        upPos = y;
                    }
                    if (leftPos >= x) {
                        leftPos = x;
                    }
                    if (rightPos <= x && rightPos<=width) {
                        rightPos = x;
                    }

                    totalArea = totalArea + (alpha/255);
                }
                if(counter >= limit){
                    ygFinal =  Math.floor(yg / valueT);
                    if(!ygFinal>0){ygFinal=Math.floor(height/2)};
                    xgFinal =  Math.floor(xg / valueT);
                    if(!xgFinal>0){xgFinal=Math.floor(width/2)};
                    var tempFullArea = ((width+1)/step)*((height+1)/step);
                    area = Math.floor(totalArea*10000/tempFullArea)/100;
                    rightPos = rightPos+step;
                    if((rightPos+(2*step))>=width){
                        rightPos=width
                    }
                    downPos = downPos + step;
                    if((downPos+(2*step))>=height){
                        downPos=height
                    }
                    $('#output').html('xg: '+ xgFinal+'   yg: '+ygFinal+'<br><br>downPos: '+ downPos+'   upPos: '+upPos+'<br><br>leftPos: '+ leftPos+'   rightPos: '+rightPos+'<br><br>counter: '+ counter+'   counterPix: '+counterPix+'<br><br>Area:'+area+'%');
        
                    //  console.log(imageData);
                
                    $('#previewImg').attr("src",imgSrc);

                    var scale = 1.0;
                    var winW = $(window).width();
                    if(width > winW){
                        scale = 0.95*winW/width;
                        console.log('scale: '+scale);
                        $('#previewImg').width(width*scale);
                    }
                    $('#xg').width(xgFinal*scale);
                    if(xgFinal>36 && ygFinal>36){
                        $('#xg').html('<div><span>xg</span></div>');
                        $('#yg').html('<div><span>yg</span></div>');
                    }
                    $('#yg').height(ygFinal*scale);
                    var tempLeft = leftPos*scale-1;
                    if(tempLeft<0){tempLeft =0};
                    $('#left').width(tempLeft);
                    $('#right').width(rightPos*scale);
                    $('#top').height(upPos*scale-1);
                    var tempBottom = downPos*scale-1;
                    if(tempBottom<0){tempBottom =0};
                    $('#bottom').height(tempBottom);
                    outputDiv.innerHTML = "ms since the start: " + (new Date() - startTime);

                    done = true;
                    console.log('done');

                    return false;
                }
                if(counter == 2000){
                    var etas = getEta(2000,startTime,a,step);
                    var tr = etas[1];
                }
                if(counter>2000 && multiple(counter, 2000) ){
                    var etas = getEta(counter,startTime,a,step);
                    var tr = etas[1];
                    console.log('Time remaining '+ tr + 'ms');

                }
            }
            //console.timeEnd('test');
        }
    };
}

function areaMomentOfInertia (){   
    var amoi = 0;
    $('#areaMomentOfInertiaPre').html('areaMomentOfInertia: '+amoi+xgFinal);
}

function showVal(newVal){
  document.getElementById("valBox").innerHTML=newVal;
}

$(document).ready(function(){
    var step;
    var pixelData;
    var width = 0;
    var height = 0;
    var yg = 0;
    var xg = 0;
    var xgFinal = 0;
    var ygFinal = 0;

    generate();
    uploadImage(); 
    //$('#areaMomentOfInertia').click(areaMomentOfInertia);

});

/* TODO

Área superficial
Posición del Centro de gravedad (centroide): X(cg) y Y(cg)
Momento de Inercia respecto al eje X (Ixx). También llamado segundo momento de área.
Momento de Inercia respecto al eje Y (Iyy)
Producto de Inercia (Pxy)
Momento Polar de Inercia (Jo)
Radio de giro respecto al eje X (Kx)
Radio de giro respecto al eje Y (Ky)
Momento de área respecto al eje X (Mx). También llamado primer momento de área.
Momento de área respecto al eje Y (My).
Respecto a los ejes X'Y', actualmente se calcula:

Momento de Inercia respecto al eje Xc (I'xx)
Momento de Inercia respecto al eje Y' (I'yy)
Producto de Inercia respecto a los ejes X'Y'
Momento Polar de Inercia respecto a los ejes X'Y' (Jo)
Radio de giro respecto al eje X' (Kx')
Radio de giro respecto al eje Y' (Ky')

*/
