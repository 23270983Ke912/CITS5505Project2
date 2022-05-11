//Created by Xinyu Wang(23531069) 2022 for 5505 project
//9/4/2022 V1.1.4

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
window.addEventListener("DOMContentLoaded", function () {
    var navbar = document.getElementById("navbartop");
    var sticky = navbar.offsetTop;

    // var conceptbox = document.getElementsByClassName("concepttitle")[2];
    // var conceptboxposition = conceptbox.offsetTop;
    // var conceptboxnext = document.getElementsByClassName("conceptcontent")[conceptboxcount+1];
    // var conceptboxposition = conceptbox.offsetTop;
    // var conceptboxnextposition = conceptboxnext.offsetTop;

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

        // if (window.pageYOffset >= conceptboxposition){
        //     conceptbox.classList.add("sticky");
        // }

    };
    // var navbarbtns = document.getElementsByClassName("navebarbtn");
    // for (var i = 0; i < navbarbtns.length; i++) {
    //     navbarbtns[i].onclick = openTab(navbarbtns[i].id);
    // }

    // document.getElementById("concept").onclick = openTab("concept");
    // document.getElementById("history").onclick = openTab("history");
    // document.getElementById("myself").onclick = openTab("myself");

    document.getElementById("conceptpagebtn").addEventListener("click", function(){ openTab("concept")});
    document.getElementById("historypagebtn").addEventListener("click", function(){ openTab("history")});
    document.getElementById("myselfpagebtn").addEventListener("click", function(){ openTab("myself")});


    document.getElementById("colorpicker").onchange = function () {
        backRGB = this.value;
        document.getElementById("navbartop").style.backgroundColor = backRGB;
    }
    document.getElementById("exampleresetcolour").onclick = function () {
        document.getElementById("navbartop").style.backgroundColor = "#02294e";
    };


    document.getElementById("examplecode").onclick = function () {
        if (exampletextcount < 3) {
            exampletext += "Code ";
            exampletextcount += 1;
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
    document.getElementById("exampleresettext").onclick = function () {
        exampletext = "";
        exampletextcount = 0;
        document.getElementById("examplecode").disabled = false;
        document.getElementById("exampleon").disabled = false;
        document.getElementById("exampledemand").disabled = false;
        CheckResult()
    };
    document.getElementById("exampleload").onclick = function () {
        move("js/dynamic.js");
        this.disabled = true;
        if (document.getElementById("myBar").width >= 100) {
        }
    };
    document.getElementById("exampleresetload").onclick = function () {
        document.location.reload(true);
    };

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
    document.getElementById("gotosummary").onclick = function () {
        var summary = document.getElementById("summary");
        summary.style.display = "block";
        summary.classList.add("fadein");
        summary.style.color = "#fff";
        summary.scrollIntoView();
    };

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
}, false);



function RenderContent(title, content) {
    document.getElementById("condiv").style.display = "block";
    var contitle = document.getElementById("contitle");
    var context = document.getElementById("context");
    if (contitle.classList.contains("fadein") && context.classList.contains("fadein")) {
        contitle.classList.remove("fadein");
        context.classList.remove("fadein");
        context.addEventListener("animationend", function () {
            contitle.classList.add("fadein");
            context.classList.add("fadein");
            contitle.innerHTML = title;
            context.innerHTML = content;
            context.style.color = "#fff";
        });
    } else {
        contitle.classList.add("fadein");
        context.classList.add("fadein");
        context.style.color = "#fff";
        contitle.innerHTML = title;
        context.innerHTML = content;
    }
    contitle.scrollIntoView();
}

function CheckResult() {
    var exampleresult = document.getElementById("exampleresult");
    exampleresult.innerHTML = exampletext;
    exampleresult.classList.add("w3-border-red");
    exampleresult.classList.add("w3-border-bottom");
    if (exampletext.localeCompare("Code On Demand ") == 0) {
        exampleresult.classList.remove("w3-border-red");
        exampleresult.classList.add("w3-border-green");
    }
    if (exampletextcount >= 3) {
        document.getElementById("examplecode").disabled = true;
        document.getElementById("exampleon").disabled = true;
        document.getElementById("exampledemand").disabled = true;
    }
    // console.log(exampletextcount);
}

class ScriptLoader {

    constructor(script) {
        this.script = script;
        this.scriptElement = document.createElement('script');
        this.head = document.querySelector('head');
    }

    load() {
        return new Promise((resolve, reject) => {
            this.scriptElement.src = this.script;
            this.scriptElement.onload = e => resolve(e);
            this.scriptElement.onerror = e => reject(e);
            this.head.appendChild(this.scriptElement);
        })
    }

}



function move(filename) { // style and loading animation from w3 school https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_progressbar_labels_js4
    const loader = new ScriptLoader('dynamic.js');

    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
            document.getElementById("myP").className = "w3-text-green w3-animate-opacity";
            document.getElementById("myP").innerHTML = "Successfully loaded " + filename + "! ";
            const loader = new ScriptLoader(filename);
            loader.load().then(e => console.log(e)).catch(e => console.error(e));
        } else {
            width += 1;
            elem.style.width = width + '%';
            var num = width * 0.9;
            num = num.toFixed(0)
            document.getElementById("demo").innerHTML = num;
        }
    }

}


var i = 0
function FrontImage() {
    var textContent = new Array("Concepts", "History", "Biography");
    $("#jsrotating").text(textContent[i])
    $("#jsrotating").animate({ opacity: 1 }, 300).delay(1600);
    i += 1;
    if (i >= textContent.length) {
        i = 0;
    }
    $("#jsrotating").animate({ opacity: 0 }, 300);
}

$(document).ready(function () {
    setInterval('FrontImage()', 2300);
    $("#historybtn").click(function () {
        $("#historyheader").hide(400);
        document.getElementsByClassName("tabs")[1].style.minHeight = "200vh";
        document.getElementById("anchor").scrollIntoView();
        $.ajax({
            url: "data/history_content.json",
            datatype: "json",
            type: "get",
            cache: "false",
            success: function (data) {
                var index = 0;
                $.each(data, function () {
                    $.each(this, function () {
                        //console.log(this.content);
                        var contentdiv = document.createElement("div");
                        contentdiv.classList.add("historydiv");
                        contentdiv.classList.add("fadein");
                        contentdiv.classList.add(this.tag);
                        if (index % 2 != 0) {
                            contentdiv.classList.add("right");
                        }
                        var yearp = document.createElement("h1");
                        var titlep = document.createElement("h1");
                        var textp = document.createElement("p");
                        textp.classList.add("w3-border-top")
                        yearp.innerHTML = this.year;
                        titlep.innerHTML = this.title;
                        textp.innerHTML = this.content;
                        contentdiv.appendChild(yearp);
                        contentdiv.appendChild(titlep);
                        contentdiv.appendChild(textp);
                        if (this.image != "") {
                            var imagediv = document.createElement("div");
                            var picture = new Image();
                            var titlenospace = this.title.replace(/\s/g, '');
                            picture.src = this.image + titlenospace + ".jpg";
                            picture.alt = this.title;
                            var sourcep = document.createElement("p");
                            sourcep.innerHTML = this.source;
                            imagediv.appendChild(picture);
                            imagediv.appendChild(sourcep);
                            imagediv.classList.add("imagediv");
                            contentdiv.appendChild(imagediv);
                        }
                        document.getElementById("historycontent").appendChild(contentdiv);
                        //console.log(index);
                        index += 1;
                    });
                });
            },
            error: function () {
                var errordiv = document.createElement("div");
                var errortext = document.createElement("h2");
                errortext.style.paddingTop = "100px";
                errortext.style.color = "#fff";
                errortext.innerHTML = "Oh! It seems the data you are trying to load is blocked by CORS policy, but you can try the following solutions:";
                var solution1 = document.createElement("p");
                solution1.innerHTML = "1. You can try to enable Live Server on VS code, and reload the website via that. For more info, please click the following button:";
                var moreinfo = document.createElement("button");
                moreinfo.innerHTML = "More info";
                moreinfo.id = "moreinfo";
                var solutioncontent = document.createElement("div");
                solutioncontent.id = "solutioncontent";
                solutioncontent.style.paddingLeft = "30px";
                solutioncontent.classList.add("displaynone")
                var solutionarray = ["Right click the index.html file, and open by VS code.", "In VS code, go to marketplace, and then search 'Live Server'. Open then first result", "If you have not used it before, click install (Please reopen VS code if necessary.). Otherwise, skip to the next step.", "If you disabled this extension, click enable. (Please reopen VS code if necessary.)", "click 'Go Live' at the bottom right corner of VS code screen.", "The page will be re-loaded via the loopback address (127.0.0.1), if nothing happend, please try to refersh the page."]
                for (n = 1; n < 7; n++) {
                    var errimgdiv = document.createElement("div");
                    var errsteps = document.createElement("p");
                    errsteps.innerHTML = "1." + n + ". " + solutionarray[n - 1];
                    var errimg = document.createElement("img");
                    errimg.classList.add("errimg");
                    errimg.src = "liveserversteps/step" + n + ".jpg";
                    errimgdiv.appendChild(errsteps);
                    errimgdiv.appendChild(errimg);

                    solutioncontent.appendChild(errimgdiv);
                }
                moreinfo.classList.add("explorebtn");
                var solution2 = document.createElement("p");
                solution2.innerHTML = "2. Otherwise, you can try to display data via html only by clicking the following button:";
                var loadhtmldata = document.createElement("button");
                loadhtmldata.id = "loadhtmldata";
                loadhtmldata.classList.add("explorebtn");
                loadhtmldata.innerHTML = "Load Again";
                errordiv.appendChild(errortext);
                errordiv.appendChild(solution1);
                errordiv.appendChild(moreinfo);
                errordiv.appendChild(solutioncontent);
                errordiv.appendChild(solution2);
                errordiv.appendChild(loadhtmldata);
                document.getElementById("errorcontent").appendChild(errordiv);
                document.getElementById("errorcontent").style.paddingBottom = "120px";

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

                console.log("unable to load json data.");
            }
        });
    });
});

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tabs");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    if (tabName == "myself") {
        document.getElementById("navbartop").style.backgroundColor = "#77777741";
    } else {
        document.getElementById("navbartop").style.backgroundColor = "#02294e";
    }
    document.getElementById(tabName).style.display = "block";
}


