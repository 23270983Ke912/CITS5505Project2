//Created by Xinyu Wang(23531069) 2022 for 5505 project
//9/4/2022 V1.1.4

//the first preloader page by jQuery, but most of the js code are written by js only.
$(window).on('load', function () {
    var preloader_fade = 500;
    function hidePreloader() {
        var preloader = $('.preloaderpage');
        setTimeout(function () {
            preloader.fadeOut(preloader_fade);
        }, 500);
    }
    hidePreloader();

})
// var conceptboxcount = 0;
var exampletext = "";
var exampletextcount = 0;
//after all dom cnetents are loaded.. do...
window.addEventListener("DOMContentLoaded", function () {

    //header div title text rotator
    setInterval('FrontImage()', 2300);

    //sticky navnbar.
    var navbar = document.getElementById("navbartop");
    var sticky = navbar.offsetTop;
    
    //when the window position is higher than the navbar position, change navbar mode to sticky.
    window.onscroll = function () {
        // var check = false;
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky");
            // check = true;
            // console.log(check)
        }
        else {
            navbar.classList.remove("sticky");
            // check = false;
            // console.log(check)
        }
    };
    // document.getElementById("concept").onclick = OpenTab("concept");
    // document.getElementById("history").onclick = OpenTab("history");
    // document.getElementById("myself").onclick = OpenTab("myself");


    //three main tab buttons
    document.getElementById("conceptpagebtn").addEventListener("click", function(){ OpenTab("concept")});
    document.getElementById("historypagebtn").addEventListener("click", function(){ OpenTab("history")});
    document.getElementById("myselfpagebtn").addEventListener("click", function(){ OpenTab("myself")});

    //the first example, colour picker
    document.getElementById("colorpicker").onchange = function () {
        backRGB = this.value;
        document.getElementById("navbartop").style.backgroundColor = backRGB;
    }
    document.getElementById("exampleresetcolour").onclick = function () {
        //reset to default navbar colour.
        document.getElementById("navbartop").style.backgroundColor = "#02294e";
    };

    //the second example, reorder words
    document.getElementById("examplecode").onclick = function () {
        //only allow user to click 3 times. avoid overshoot.
        if (exampletextcount < 3) {
            exampletext += "Code ";
            exampletextcount += 1;
            //everytime when user clicks, check the result.
            CheckResult();
        }
    }
    document.getElementById("exampleon").onclick = function () {
        if (exampletextcount < 3) {
            exampletext += "On ";
            exampletextcount += 1;
            CheckResult();
        }
    };
    document.getElementById("exampledemand").onclick = function () {
        if (exampletextcount < 3) {
            exampletext += "Demand ";
            exampletextcount += 1;
            CheckResult();
        }
    };

    //reset the reorder words div. 
    document.getElementById("exampleresettext").onclick = function () {
        exampletext = "";
        exampletextcount = 0;
        document.getElementById("examplecode").disabled = false;
        document.getElementById("exampleon").disabled = false;
        document.getElementById("exampledemand").disabled = false;
        CheckResult()
    };
    
    //load external scripts
    document.getElementById("exampleload").onclick = function () {
        move("js/dynamic.js");

        //only load once.
        this.disabled = true;

    };

    //refersh the page to enable reload
    document.getElementById("exampleresetload").onclick = function () {
        document.location.reload(true);
    };

    //display details for the selected pros and cons.
    document.getElementById("pro1").onclick = function () {
        RenderContent(this.innerHTML, document.getElementById("pro1d").innerHTML);
    };
    document.getElementById("pro2").onclick = function () {
        RenderContent(this.innerHTML, document.getElementById("pro2d").innerHTML);

    };
    document.getElementById("con1").onclick = function () {
        RenderContent(this.innerHTML, document.getElementById("con1d").innerHTML);

    };
    document.getElementById("con2").onclick = function () {
        RenderContent(this.innerHTML, document.getElementById("con2d").innerHTML);
    };
    //go to summary and reference
    document.getElementById("gotosummary").onclick = function () {
        var summary = document.getElementById("summary");
        summary.style.display = "block";
        summary.classList.add("fadein");
        summary.style.color = "#fff";
        summary.scrollIntoView();
    };

    //go to the end of biography page directly, find any hidden divs and make them unhide.
    document.getElementById("jumptocv").onclick = function () {
        var alldivs = document.getElementsByClassName("myselfpage");
        for (m = 0; m < alldivs.length; m++) {
            console.log(m)
            if (alldivs[m].classList.contains("displaynone")) {
                alldivs[m].classList.remove("displaynone");
            }
        }
        document.getElementById("cvdiv").style.display = "block";
        document.getElementById("navbartop").style.backgroundColor = "#77777741";
        document.getElementById("cvdiv").scrollIntoView();
    };
    //show each div one by one by clicking button.
    document.getElementById("startknowme").onclick = function () {
        document.getElementById("myselfheader1").classList.remove("displaynone");
        document.getElementById("navbartop").style.backgroundColor = "#77777741";
        document.getElementById("myselfheader1").scrollIntoView();
    };
    document.getElementById("startknowme1").onclick = function () {
        document.getElementById("myselfheader2").classList.remove("displaynone");
        document.getElementById("myselfheader2").scrollIntoView();
    };
    document.getElementById("startknowme2").onclick = function () {
        document.getElementById("myselfheader3").classList.remove("displaynone");
        document.getElementById("myselfheader3").scrollIntoView();
    };
    document.getElementById("startknowme3").onclick = function () {
        document.getElementById("myselfheader4").classList.remove("displaynone");
        document.getElementById("myselfheader4").scrollIntoView();
    };
    document.getElementById("startknowme4").onclick = function () {
        document.getElementById("myselfheader5").classList.remove("displaynone");
        document.getElementById("myselfheader5").scrollIntoView();
    };
    document.getElementById("startknowme5").onclick = function () {
        document.getElementById("myselfheader6").classList.remove("displaynone");
        document.getElementById("myselfheader6").scrollIntoView();
    };
    document.getElementById("startknowme6").onclick = function () {
        document.getElementById("myselfheader7").classList.remove("displaynone");
        document.getElementById("myselfheader7").scrollIntoView();
    };
    document.getElementById("startknowme7").onclick = function () {
        document.getElementById("myselfheader8").classList.remove("displaynone");
        document.getElementById("myselfheader8").scrollIntoView();
    };
    document.getElementById("startknowme8").onclick = function () {
        document.getElementById("cvdiv").style.display = "block";
        document.getElementById("cvdiv").scrollIntoView();
    };

    $("#historybtn").click(function () {

        //hide the clicked button
        $("#historyheader").hide(400);

        //for styling purpose.
        document.getElementsByClassName("tabs")[1].style.minHeight = "200vh";
        document.getElementById("anchor").scrollIntoView();
        //ajax call for data
        $.ajax({
            url: "data/history_content.json",
            datatype: "json",
            type: "get",
            cache: "false",
            success: function (data) {

                //check if it is a odd div.
                var index = 0;
                $.each(data, function () {
                    $.each(this, function () {
                        //console.log(this.content);

                        //for each item in json file, create a separate div
                        var contentdiv = document.createElement("div");

                        //add some classes for styling
                        contentdiv.classList.add("historydiv");
                        contentdiv.classList.add("fadein");

                        //filter the timeline divs by tags
                        contentdiv.classList.add(this.tag);

                        // for every second divs, put it on the right
                        if (index % 2 != 0) {
                            contentdiv.classList.add("right");
                        }

                        //create elements for item content
                        var yearp = document.createElement("h1");
                        var titlep = document.createElement("h1");
                        var textp = document.createElement("p");
                        textp.classList.add("w3-border-top")
                        yearp.innerHTML = this.year;
                        titlep.innerHTML = this.title;
                        textp.innerHTML = this.content;

                        //append created elements to the separate div
                        contentdiv.appendChild(yearp);
                        contentdiv.appendChild(titlep);
                        contentdiv.appendChild(textp);

                        //if this item has an img to display
                        if (this.image != "") {
                            var imagediv = document.createElement("div");
                            var picture = new Image();

                        //to meet html5 standard, all img src must not contain spaces, so this is to use regxp to remove spaces from the file name.
                            var titlenospace = this.title.replace(/\s/g, '');
                            picture.src = this.image + titlenospace + ".jpg";

                        // and also for standard, add alts for each img.
                            picture.alt = this.title;
                            var sourcep = document.createElement("p");
                            sourcep.innerHTML = this.source;
                            imagediv.appendChild(picture);
                            imagediv.appendChild(sourcep);
                            imagediv.classList.add("imagediv");

                            //append it to the separate div
                            contentdiv.appendChild(imagediv);
                        }
                        //append every cerated element to the page.
                        document.getElementById("historycontent").appendChild(contentdiv);
                        //console.log(index);

                        //go to next item
                        index += 1;
                    });
                });
            },

            //on error, do this function. (especially when loading data locally)
            error: function () {ErrorFunction()}
        });
    });
}, false);


//for pros and cons divs in concept page
function RenderContent(title, content) {
    document.getElementById("condiv").style.display = "block";
    var contitle = document.getElementById("contitle");
    var context = document.getElementById("context");

    //if the div is shown, and user wants to chance content, remove current fadein class and add it again to re-activate the effect.
    if (contitle.classList.contains("fadein") && context.classList.contains("fadein")) {
        contitle.classList.remove("fadein");
        context.classList.remove("fadein");

        //contents will be reloaded after fadein animation is finished.
        context.addEventListener("animationend", function () {
            contitle.classList.add("fadein");
            context.classList.add("fadein");
            contitle.innerHTML = title;
            context.innerHTML = content;
            context.style.color = "#fff";
        });
    } else {

        //otherwise, load content directly
        contitle.classList.add("fadein");
        context.classList.add("fadein");
        context.style.color = "#fff";
        contitle.innerHTML = title;
        context.innerHTML = content;
    }

    //go to the div
    contitle.scrollIntoView();
}

//for example, re-order words
function CheckResult() {

    //the div show the result
    var exampleresult = document.getElementById("exampleresult");
    exampleresult.innerHTML = exampletext;

    //if the answer is wrong, border is red.
    exampleresult.classList.add("w3-border-red");
    exampleresult.classList.add("w3-border-bottom");
    if (exampletext.localeCompare("Code On Demand ") == 0) {

        //if the answer is correct, border is green
        exampleresult.classList.remove("w3-border-red");
        exampleresult.classList.add("w3-border-green");
    }
    if (exampletextcount >= 3) {

        //to prevent overshoot, disable buttons after user tried 3 times
        document.getElementById("examplecode").disabled = true;
        document.getElementById("exampleon").disabled = true;
        document.getElementById("exampledemand").disabled = true;
    }
    // console.log(exampletextcount);
}

//created a class for loading js.
class ScriptLoader {
    constructor(script) {

        //it contains script, its element, and head
        this.script = script;
        this.scriptElement = document.createElement('script');
        this.head = document.querySelector('head');
    }

    //when it loads
    load() {
        //create new Promise object with script details.
        return new Promise((resolve, reject) => {
            this.scriptElement.src = this.script;

            //try and catch if problems happen
            this.scriptElement.onload = e => resolve(e);
            this.scriptElement.onerror = e => reject(e);
            //put script to the head div
            this.head.appendChild(this.scriptElement);
        })
    }

}


//bar loading animation
function move(filename) { // style and loading animation from w3 school https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_progressbar_labels_js4
    var elem = document.getElementById("myBar");
    var width = 0;

    // each frame takes.. 10ms to finish
    var id = setInterval(frame, 10);
    function frame() {
        
        //when finish loading
        if (width >= 100) {
            clearInterval(id);
            document.getElementById("myP").className = "w3-text-green w3-animate-opacity";
            document.getElementById("myP").innerHTML = "Successfully loaded " + filename + "! ";

            //call load function to load the script
            const loader = new ScriptLoader(filename);
            loader.load().then(e => console.log(e)).catch(e => console.error(e));
        } else {

            //when under going, for each frame, width add 1, and generate the progress.
            width += 1;
            elem.style.width = width + '%';
            var num = width * 0.9;
            num = num.toFixed(0)
            document.getElementById("demo").innerHTML = num;
        }
    }

}

// text rotator
// i is index value for looping textcontent array
var i = 0
function FrontImage() {
    var textContent = new Array("Concepts", "History", "Biography");

    //used jQuery, because its animate function is powerful.
    $("#jsrotating").text(textContent[i])

    //fade in 
    $("#jsrotating").animate({ opacity: 1 }, 300).delay(1600);
    i += 1;

    //only loop between 0 and 2 (3 items in the loop)
    if (i >= textContent.length) {
        i = 0;
    }

    //fade out
    $("#jsrotating").animate({ opacity: 0 }, 300);
}

//open a specific tab
function OpenTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tabs");

    //hide unselected pages
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    //for styling purpose, change navbar to transparent when in the biography page
    if (tabName == "myself") {
        document.getElementById("navbartop").style.backgroundColor = "#77777741";
    } else {
        document.getElementById("navbartop").style.backgroundColor = "#02294e";
    }

    //display selected pages
    document.getElementById(tabName).style.display = "block";
}

//on ajax error
function ErrorFunction(){

    //create error messages with styling
    var errordiv = document.createElement("div");
    var errortext = document.createElement("h2");
    errortext.style.paddingTop = "100px";
    errortext.style.color = "#fff";
    errortext.innerHTML = "Oh! It seems the data you are trying to load is blocked by CORS policy, but you can try the following solutions:";

    //generate solutions
    var solution1 = document.createElement("p");
    solution1.innerHTML = "1. You can try to enable Live Server on VS code, and reload the website via that. For more info, please click the following button:";
    var moreinfo = document.createElement("button");
    moreinfo.innerHTML = "More info";
    moreinfo.id = "moreinfo";
    var solutioncontent = document.createElement("div");
    solutioncontent.id = "solutioncontent";
    solutioncontent.style.paddingLeft = "30px";
    solutioncontent.classList.add("displaynone")

    //solution1 texts, will be shown together with step images.
    var solutionarray = ["Right click the index.html file, and open by VS code.", "In VS code, go to marketplace, and then search 'Live Server'. Open then first result", "If you have not used it before, click install (Please reopen VS code if necessary.). Otherwise, skip to the next step.", "If you disabled this extension, click enable. (Please reopen VS code if necessary.)", "click 'Go Live' at the bottom right corner of VS code screen.", "The page will be re-loaded via the loopback address (127.0.0.1), if nothing happend, please try to refersh the page."]
    
    //in the for loop, put texts and images together.
    for (n = 1; n < 7; n++) {
        var errimgdiv = document.createElement("div");
        var errsteps = document.createElement("p");
        errsteps.innerHTML = "1." + n + ". " + solutionarray[n - 1];
        var errimg = document.createElement("img");
        errimg.classList.add("errimg");
        errimg.src = "liveserversteps/step" + n + ".jpg";
        errimg.alt = "step" + n;
        errimgdiv.appendChild(errsteps);
        errimgdiv.appendChild(errimg);

        //append every steps to the solution div.
        solutioncontent.appendChild(errimgdiv);
    }
    moreinfo.classList.add("explorebtn");
    var solution2 = document.createElement("p");

    //solution2, display html timeline content.
    solution2.innerHTML = "2. Otherwise, you can try to display data via html only by clicking the following button:";
    var loadhtmldata = document.createElement("button");
    loadhtmldata.id = "loadhtmldata";
    loadhtmldata.classList.add("explorebtn");
    loadhtmldata.innerHTML = "Load Again";

    //append created elements to the page.
    errordiv.appendChild(errortext);
    errordiv.appendChild(solution1);
    errordiv.appendChild(moreinfo);
    errordiv.appendChild(solutioncontent);
    errordiv.appendChild(solution2);
    errordiv.appendChild(loadhtmldata);
    document.getElementById("errorcontent").appendChild(errordiv);
    document.getElementById("errorcontent").style.paddingBottom = "120px";

    //add button functions for moreinfo, and loadhtmldata.
    document.getElementById("moreinfo").addEventListener("click", function (e) {
        this.classList.add("displaynone");
        document.getElementById("solutioncontent").classList.add("fadein");
        document.getElementById("solutioncontent").classList.remove("displaynone");
    });
    document.getElementById("loadhtmldata").addEventListener("click", function (e) {
        $("#solutioncontent").hide(400);
        $("#errorcontent").hide(400);
        document.getElementById("loadhtml").classList.remove("displaynone");

    });

    //output error to the console.
    console.log("unable to load json data.");
}