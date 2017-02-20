var imgSrc;
var imageData = [];
var filter = 70;
var chromeApp = false;
var storage;

function hideAnalysisData(){
    $("#xg").css('display','none');
    $("#yg").css('display','none');
    $("#left").css('display','none');
    $("#right").css('display','none');
    $("#top").css('display','none');
    $("#bottom").css('display','none');
    $("#area").css('display','none');
    $("#cg").css('display','none');
}
function showAnalysisData(){
    $("#left").fadeIn(200);
    $("#right").fadeIn(200);
    $("#top").fadeIn(200);
    $("#bottom").fadeIn(200);
    setTimeout(function(){
        $("#area").fadeIn(200);
    },200);
    setTimeout(function(){
        $("#xg").fadeIn(200);
        $("#yg").fadeIn(200);
        $("#cg").fadeIn(200);
    },400);
}

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
    if(rest===0)
        return true;
    else
        return false;
}


function generate(imgSrc){

    hideAnalysisData();

    var done = false;

    imageData = [];
    img = new Image();
    if(imgSrc === null || imgSrc === undefined){
        img.src = $('#previewImg').attr('src');
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

        var valueFilter;
        if(!filter){
            valueFilter = 5;
        }
        else{
            valueFilter = 105 - filter;
        }
        step = 1;
        var a = width*height;
        if(a>95000){
            step = 2;
        }
        if(a>1300000){
            step = 3;
        }
        if(a>2600000){
            step = 5;
        }
        if(a>5400000){
            step = 8;
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
        var yy = 0;
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

                if (value > valueFilter && alpha > 0) {
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
                    showAnalysisData();

                    ygFinal =  Math.floor(yg / valueT);
                    if(!ygFinal){ygFinal=Math.floor(height/2);}
                    xgFinal =  Math.floor(xg / valueT);
                    if(!xgFinal){xgFinal=Math.floor(width/2);}
                    var tempFullArea = ((width+1)/step)*((height+1)/step);
                    area = Math.floor(totalArea*10000/tempFullArea)/100;
                    rightPos = rightPos+step;
                    if((rightPos+(2*step))>=width){
                        rightPos=width;
                    }
                    downPos = downPos + step;
                    if((downPos+(2*step))>=height){
                        downPos=height;
                    }
                    $('#output').html('xg: '+ xgFinal+'   yg: '+ygFinal+'<br><br>downPos: '+ downPos+'   upPos: '+upPos+'<br><br>leftPos: '+ leftPos+'   rightPos: '+rightPos+'<br><br>counter: '+ counter+'   counterPix: '+counterPix+'<br><br>Area:'+area+'%');

                    $('#previewImg').attr("src",imgSrc);

                    var scale = 1.0;
                    var winW = $('.container').width();
                    if(width > winW){
                        scale = winW/width;
                        $('#previewImg').width(width*scale);
                    }
                    $('#xg').width(xgFinal*scale);
                    if(xgFinal>36 && ygFinal>36){
                        $('#xg').html('<div><span>xg</span></div>');
                        $('#yg').html('<div><span>yg</span></div>');
                    }
                    $('#yg').height(ygFinal*scale);
                    $('#cg').css('left',(xgFinal*scale)-12);
                    $('#cg').css('top',(ygFinal*scale)-12);
                    var tempLeft = leftPos*scale-1;
                    if(tempLeft<0){tempLeft =0}
                    $('#left').width(tempLeft);
                    $('#right').width(rightPos*scale);
                    $('#top').height(upPos*scale-1);
                    var tempBottom = downPos*scale-1;
                    if(tempBottom<0){tempBottom =0}
                    $('#bottom').height(tempBottom);
                    $('#area').height((downPos*scale)-(upPos*scale));
                    $('#area').width((rightPos*scale)-(leftPos*scale));
                    $('#area').css('top',upPos*scale);
                    $('#area').css('left',leftPos*scale);
                    //outputDiv.innerHTML = "ms since the start: " + (new Date() - startTime);
                    
                    var centerColor = this.canvas.getContext('2d').getImageData(xgFinal, ygFinal, 1, 1).data;
                    centerColor = tinycolor({r:centerColor[0], g:centerColor[1], b:centerColor[2]}).toRgb();
                    var gs = tinycolor(centerColor).greyscale().toRgb();
                    ccRgb = tinycolor(centerColor).toRgb();
                    if(Math.abs(ccRgb.r - gs.r) > 3 && Math.abs(ccRgb.g - gs.g) > 3 && Math.abs(ccRgb.b - gs.b) > 3){
                        centerColorInv = tinycolor(tinycolor(centerColor).spin(180)).toHsl();
                        centerColorInv.s = 95;
                        var centerColorInvHex = tinycolor(centerColorInv).toHexString();
                        $('#xg').css('border-right-color',centerColorInvHex);
                        $('#yg').css('border-bottom-color',centerColorInvHex);
                        $('#left').css('border-right-color',centerColorInvHex);
                        $('#right').css('border-right-color',centerColorInvHex);
                        $('#top').css('border-bottom-color',centerColorInvHex);
                        $('#bottom').css('border-bottom-color',centerColorInvHex);
                        var cgColor = tinycolor(centerColorInv).darken().toHexString();
                        var cgBG = `"data:image/svg+xml;charset=UTF-8, %3Csvg fill='%23`+cgColor.substring(1)+`' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E' %3Cpath d='M12,2 C6.5,2 2,6.5 2,12 C2,17.5 6.5,22 12,22 C17.5,22 22,17.5 22,12 C22,6.5 17.5,2 12,2 Z M12,20 L12,12 L4,12 C4,7.6 7.6,4 12,4 L12,12 L20,12 C20,16.4 16.4,20 12,20 Z'/%3E' %3Cpath d='M0 0h24v24H0z' fill='none'/%3E'%3C/svg%3E"`;
                        $('#cg').css("background-image","url("+cgBG+")");
                        var areaBG = centerColorInv;
                        areaBG.l = 95;
                        areaBG = tinycolor(areaBG).toHexString();
                        $('#area').css('background-color',areaBG);
                    }
                    done = true;

                    return false;
                }
                if(counter == 2000){
                    var etas = getEta(2000,startTime,a,step);
                    var tr = etas[1];
                }
                if(counter>2000 && multiple(counter, 2000) ){
                    var etas = getEta(counter,startTime,a,step);
                    var tr = etas[1];
                    //console.log('Time remaining '+ tr + 'ms');

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

var showValTimeOut;
function showVal(newVal){
    clearTimeout(showValTimeOut);
    showValTimeOut = setTimeout(function(){
        generate();
        newVal = Number(newVal);
        if(chromeApp){
            storage.set({'filter':newVal});
        }
        else{
            localStorage.setItem("filter",newVal);
        }
    }, 1000);
}

$(document).ready(function(){
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(isChrome){
        if(chrome.storage !== undefined){
            storage = chrome.storage.local;
            chromeApp = true;
        }
    }
    var step;
    var pixelData;
    var width = 0;
    var height = 0;
    var yg = 0;
    var xg = 0;
    var xgFinal = 0;
    var ygFinal = 0;

    uploadImage();
    hideAnalysisData();
    if(chromeApp){
        storage.get('filter',function(result){
            filter = result.filter;
            console.log('filter',filter);
            if(!filter){filter = 70;}
            $("#filter input[type=range]").val(filter);
            showVal(filter);
        });
    }
    else{
        if(localStorage){
            filter = localStorage.getItem("filter");
        }
        if(!filter){filter = 70;}
        $("#filter input[type=range]").val(filter);
        showVal(filter);
    }

    $('#range').on('change', function(){
        filter = $(this).val();
        showVal(filter);
    });
});
