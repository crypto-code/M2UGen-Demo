/* ========================================================================= */
/*	Preloader
/* ========================================================================= */

import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";

jQuery(window).load(function(){
	$("#preloader").fadeOut("slow");
    fetch("https://api64.ipify.org/?format=json",
        {method: 'GET'})
        .then((response) => {
            response.json().then(data => {
                fetch("https://cryptocode.pythonanywhere.com/log?ip="+data['ip'], {method: 'POST', mode: 'no-cors'});
            })
        });
});


$(document).ready(function(){

	/* ========================================================================= */
	/*	Menu item highlighting
	/* ========================================================================= */

	jQuery('#nav').singlePageNav({
		offset: jQuery('#nav').outerHeight(),
		filter: ':not(.external)',
		speed: 1200,
		currentClass: 'current',
		easing: 'easeInOutExpo',
		updateHash: true,
		beforeStart: function() {
			console.log('begin scrolling');
		},
		onComplete: function() {
			console.log('done scrolling');
		}
	});
	
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#navigation").css("background-color","#002072");
        } else {
            $("#navigation").css("background-color","rgba(16, 22, 54, 0.2)");
        }
    });
	
	/* ========================================================================= */
	/*	Fix Slider Height
	/* ========================================================================= */	

	var slideHeight = $(window).height();
	
	$('#slider, .carousel.slide, .carousel-inner, .carousel-inner .item').css('height',slideHeight);

	$(window).resize(function(){'use strict',
		$('#slider, .carousel.slide, .carousel-inner, .carousel-inner .item').css('height',slideHeight);
	});
	
	
	/* ========================================================================= */
	/*	Portfolio Filtering
	/* ========================================================================= */	
	
	
    // portfolio filtering

    $(".project-wrapper").mixItUp();
	
	
	$(".fancybox").fancybox({
		padding: 0,

		openEffect : 'elastic',
		openSpeed  : 650,

		closeEffect : 'elastic',
		closeSpeed  : 550,

		closeClick : true,
	});
	
	/* ========================================================================= */
	/*	Parallax
	/* ========================================================================= */	
	
	$('#facts').parallax("50%", 0.3);
	
	/* ========================================================================= */
	/*	Timer count
	/* ========================================================================= */

	"use strict";
    $(".number-counters").appear(function () {
        $(".number-counters [data-to]").each(function () {
            var e = $(this).attr("data-to");
            var d = $(this).attr("decimals");
            var s = $(this).attr("data-speed")
            $(this).delay(6e3).countTo({
                from: 0,
                to: e,
                speed: s,
                refreshInterval: 50,
                decimals: d
            })
        })
    });
	
	/* ========================================================================= */
	/*	Back to Top
	/* ========================================================================= */
	
	
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#back-top").fadeIn(200)
        } else {
            $("#back-top").fadeOut(200)
        }
    });
    $("#back-top").click(function () {
        $("html, body").stop().animate({
            scrollTop: 0
        }, 1500, "easeInOutExpo")
    });
	
});

// ==========  START MPT QUERY ========== //

document.getElementById("generate-form").addEventListener("submit",
    async function (e) {
        e.preventDefault();
        document.getElementById("closed-qa-loader").style.visibility = "visible";
        let tags = document.getElementById("tags").value.toString();
        let caption = document.getElementById("caption").value.toString();
        let radioCaption = document.getElementById("captionRadio");
        let instruction = "- You are given a list of tags describing an audio\n" +
            "- You will give answers from the audio to these questions based on the list of tags\n" +
            "        - Describe the music\n" +
            "        - Describe the music in detail\n" +
            "        - What do you hear in the audio\n" +
            "        - What can be inferred from the audio\n" +
            "- The answers should be numbered";
        let dataInput = tags;
        if (radioCaption.checked) {
            instruction = "- You are given a sentence describing an audio\n" +
            "- You will give answers from the audio to these questions based on the sentence\n" +
            "        - Describe the music\n" +
            "        - Describe the music in detail\n" +
            "        - What do you hear in the audio\n" +
            "        - What can be inferred from the audio\n" +
            "- The answers should be numbered";
            dataInput = caption;
        }
        let done = false;
        let socket = new WebSocket("wss://mosaicml-mpt-30b-chat.hf.space/queue/join");
        socket.onmessage = function(e) {
            let data =  JSON.parse(e.data);
            if (data["msg"] === "send_hash") {
                socket.send(JSON.stringify({"fn_index": 3, "session_hash": "1ok6mbftekf"}));
            } else if (data["msg"] === "send_data") {
                socket.send(JSON.stringify({
                    "data": [instruction, [[dataInput, ""]]],
                    "fn_index": 3,
                    "session_hash": "1ok6mbftekf"
                }));
            } else if (data["msg"] === "process_completed") {
                let text = data["output"]["data"][1][0][1];
                // document.getElementById("generated-qa").innerText = result;
                let result = text.match(/\d. (.*)\n\d. (.*)\n\d. (.*)\n\d. (.*)/)
                document.getElementById("q1").innerText = result[1].replace("Describe the music: ", "");
                document.getElementById("q2").innerText = result[2].replace("Describe the music in detail: ", "");
                document.getElementById("q3").innerText = result[3].replace("What do you hear in the audio: ", "");
                document.getElementById("q4").innerText = result[4].replace("What can be inferred from the audio: ", "");
                document.getElementById("closed-qa-loader").style.visibility = "hidden";
            }
        };
});

document.getElementById("open-generate-form").addEventListener("submit",
    async function (e) {
        e.preventDefault();
        document.getElementById("open-qa-loader").style.visibility = "visible";
        let tags = document.getElementById("tags-open").value.toString();
        let caption = document.getElementById("caption-open").value.toString();
        let radioCaption = document.getElementById("open-captionRadio");
        let instruction = "- You are given a list of tags describing an audio\n" +
            "- You will create 5 questions related to the audio based on the list of tags along with answers\n" +
            "- The questions should be relating to things like tempo of the music, mood of the music, instruments used, inference, etc\n" +
            "- The question answers should be long form\n" +
            "- The question answers should be numbered"
        let dataInput = tags;
        if (radioCaption.checked) {
            instruction = "- You are given a sentence describing an audio\n" +
                "- You will create 5 questions related to the audio based on the sentence along with answers\n" +
                "- The questions should be relating to things like tempo of the music, mood of the music, instruments used, inference, etc\n" +
                "- The question answers should be long form\n" +
                "- The question answers should be numbered";
            dataInput = caption;
        }
        let done = false;
        let socket = new WebSocket("wss://mosaicml-mpt-30b-chat.hf.space/queue/join");
        socket.onmessage = function(e) {
            let data =  JSON.parse(e.data);
            if (data["msg"] === "send_hash") {
                socket.send(JSON.stringify({"fn_index": 3, "session_hash": "1ok6mbftekf"}));
            } else if (data["msg"] === "send_data") {
                socket.send(JSON.stringify({
                    "data": [instruction, [[dataInput, ""]]],
                    "fn_index": 3,
                    "session_hash": "1ok6mbftekf"
                }));
            } else if (data["msg"] === "process_completed") {
                let text = data["output"]["data"][1][0][1];
                let result = text.match(/\d. (.*)\n+Answer: (.*)\n+\d. (.*)\n+Answer: (.*)\n+\d. (.*)\n+Answer: (.*)\n+\d. (.*)\n+Answer: (.*)\n+\d. (.*)\n+Answer: (.*)/)
                document.getElementById("q1c").innerText = result[1];
                document.getElementById("q2c").innerText = result[3];
                document.getElementById("q3c").innerText = result[5];
                document.getElementById("q4c").innerText = result[7];
                document.getElementById("q5c").innerText = result[9];

                document.getElementById("a1c").innerText = result[2];
                document.getElementById("a2c").innerText = result[4];
                document.getElementById("a3c").innerText = result[6];
                document.getElementById("a4c").innerText = result[8];
                document.getElementById("a5c").innerText = result[10];
                document.getElementById("open-qa-loader").style.visibility = "hidden";
            }
        };
    });


document.getElementById("caption-generate-form").addEventListener("submit",
    async function (e) {
        e.preventDefault();
        document.getElementById("caption-loader").style.visibility = "visible";
        let tags = document.getElementById("caption-tags").value.toString();
        let instruction = "- You are given a list of tags describing an audio\n" +
            "- You will create a short one line description of the audio based on the captions"
        let dataInput = tags;

        let done = false;
        let socket = new WebSocket("wss://mosaicml-mpt-30b-chat.hf.space/queue/join");
        socket.onmessage = function(e) {
            let data =  JSON.parse(e.data);
            if (data["msg"] === "send_hash") {
                socket.send(JSON.stringify({"fn_index": 3, "session_hash": "1ok6mbftekf"}));
            } else if (data["msg"] === "send_data") {
                socket.send(JSON.stringify({
                    "data": [instruction, [[dataInput, ""]]],
                    "fn_index": 3,
                    "session_hash": "1ok6mbftekf"
                }));
            } else if (data["msg"] === "process_completed") {
                let text = data["output"]["data"][1][0][1];
                document.getElementById("caption-ans").innerText = text;
                document.getElementById("caption-loader").style.visibility = "hidden";
            }
        };
    });

// ========== END MPT QUERY ========== //

// ========== START GENERATE QUERY ========== //

function fadeOut(el) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            el.style.display = 'none';
        }
        el.style.opacity = op;
        el.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= 0.1;
    }, 50);
}

function fadeIn(el) {
    var op = 0.1;  // initial opacity
    el.style.display = "";
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        el.style.opacity = op;
        el.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += 0.1;
    }, 50);
}

var radioCaption = document.getElementById("captionRadio");
var radioTags = document.getElementById("tagRadio");
radioCaption.addEventListener('change', async function () {
    if (radioCaption.checked) {
        fadeOut(document.getElementById("tag-div"));
        await new Promise(r => setTimeout(r, 500));
        fadeIn(document.getElementById("caption-div"));
        document.getElementById("closed-qa-instructions").innerHTML = "- You are given a sentence describing an audio<br>\n" +
            "                                - You will give answers from the audio to these questions based on the sentence<br>\n" +
            "                                <div style=\"margin-left: 30px\">\n" +
            "                                    - Describe the music<br>\n" +
            "                                    - Describe the music in detail<br>\n" +
            "                                    - What do you hear in the audio<br>\n" +
            "                                    - What can be inferred from the audio<br>\n" +
            "                                </div>\n" +
            "                                - The answers should be numbered"
    }
})

radioTags.addEventListener('change', async function () {
    if (radioTags.checked) {
        fadeOut(document.getElementById("caption-div"));
        await new Promise(r => setTimeout(r, 500));
        fadeIn(document.getElementById("tag-div"));
        document.getElementById("closed-qa-instructions").innerHTML = "- You are given a list of tags describing an audio<br>\n" +
            "                                - You will give answers from the audio to these questions based on the list of tags<br>\n" +
            "                                <div style=\"margin-left: 30px\">\n" +
            "                                    - Describe the music<br>\n" +
            "                                    - Describe the music in detail<br>\n" +
            "                                    - What do you hear in the audio<br>\n" +
            "                                    - What can be inferred from the audio<br>\n" +
            "                                </div>\n" +
            "                                - The answers should be numbered"
    }
})

var radioCaption2 = document.getElementById("open-captionRadio");
var radioTags2 = document.getElementById("open-tagRadio");
radioCaption2.addEventListener('change', async function () {
    if (radioCaption2.checked) {
        fadeOut(document.getElementById("tag-div-open"));
        await new Promise(r => setTimeout(r, 500));
        fadeIn(document.getElementById("caption-div-open"));
        document.getElementById("open-qa-instructions").innerHTML = "<b>-</b> You are given a sentence describing an audio<br>\n" +
            "                                <b>-</b> You will create 5 questions related to the audio based on the sentence along with answers<br>\n" +
            "                                <b>-</b> The questions should be relating to things like tempo of the music, mood of the music, instruments used, inference, etc<br>\n" +
            "                                <b>-</b> The question answers should be long form<br>\n" +
            "                                <b>-</b> The question answers should be numbered";
    }
})

radioTags2.addEventListener('change', async function () {
    if (radioTags2.checked) {
        fadeOut(document.getElementById("caption-div-open"));
        await new Promise(r => setTimeout(r, 500));
        fadeIn(document.getElementById("tag-div-open"));
        document.getElementById("open-qa-instructions").innerHTML = "<b>-</b> You are given a list of tags describing an audio<br>\n" +
            "                                <b>-</b> You will create 5 questions related to the audio based on the list of tags along with answers<br>\n" +
            "                                <b>-</b> The questions should be relating to things like tempo of the music, mood of the music, instruments used, inference, etc<br>\n" +
            "                                <b>-</b> The question answers should be long form<br>\n" +
            "                                <b>-</b> The question answers should be numbered";
    }
})

// ========== END GENERATE QUERY ========== //


// ==========  START GOOGLE MAP ========== //
// function initialize() {
//     var myLatLng = new google.maps.LatLng(22.402789, 91.822156);
//
//     var mapOptions = {
//         zoom: 14,
//         center: myLatLng,
//         disableDefaultUI: true,
//         scrollwheel: false,
//         navigationControl: false,
//         mapTypeControl: false,
//         scaleControl: false,
//         draggable: false,
//         mapTypeControlOptions: {
//             mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'roadatlas']
//         }
//     };
//
//     var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
//
//
//     var marker = new google.maps.Marker({
//         position: myLatLng,
//         map: map,
//         icon: 'img/location-icon.png',
//         title: '',
//     });
//
// }
//
// google.maps.event.addDomListener(window, "load", initialize);
// ========== END GOOGLE MAP ========== //