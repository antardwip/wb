var pageNumber = "0";
var allNewsStorage = {};
var theYear = "";
var uniqueNumber = 0;
var bigImage1 = "";
var BlockNumber = 0;
var increasingNumber = 0;
var theTitle = "";
var theTimestamp = "";
var gap = 0;
var Global = {};
Global.ChosenChannel = "";
var store16items = [];
var loadmore = false;
let startIndex = 0;
var globalBannersStore = {};
var GlobalNewsTitle = '';
let moreButtonYear = 2056;

let banglaNumber = {
        0: "০",
        1: "১",
        2: "২",
        3: "৩",
        4: "৪",
        5: "৫",
        6: "৬",
        7: "৭",
        8: "৮",
        9: "৯",
};

$(document).ready(function () {
        try {
                var socket = io("https://mayapurapp.ap-1.evennode.com");
                console.log("SOCKET1");
                var privateChatWin = null;
                socket.emit('retrieveAllBanners');  //on connection, request top banner information
                socket.emit('retrieveHeadlineNews'); //on connection, request 16 news headlines
                socket.emit('retrieveAllVideos'); //on connection, request video links
                console.log(">>>>>>>>>>>>>>>startIndex = " + startIndex);

                socket.on('16NewsHeadlinesRetrieved', function (dataObject) {
                        console.log("in 16NewsHeadlinesRetrieved   ");
                        var thumbNews = dataObject
                        var getLowestDate = 99999999999999;
                        for (var g in thumbNews) {
                                setupfrontpage(thumbNews[g]); //setup the 16 news headlines one by one.
                                if (thumbNews[g]['_id'] < getLowestDate) {  //get the lowest date to set the year for the more button
                                        getLowestDate = thumbNews[g]['_id'];
                                        console.log('SSSSSgetLowestDate = ', getLowestDate);
                                }
                                var date = new Date(parseInt(getLowestDate));
                                moreButtonYear = date.getFullYear();
                                console.log('SSSSSmoreButtonYear  = ', moreButtonYear);
                        }
                });

                socket.on('allBannersRetrieved', function (allBanners) {
                        console.log("in allBannersRetrieved = " + allBanners);
                        // Get the current date and time in the Indian time zone
                        const nd = new Date().toLocaleString('en-US', {
                                timeZone: 'Asia/Kolkata'
                        });
                        const dateObj = new Date(nd);
                        const nhour = dateObj.getHours();
                        const nmin = dateObj.getMinutes();
                        for (var t in allBanners) {
                                globalBannersStore[allBanners[t]['_id']] = allBanners[t]
                                var timeinmins = nhour * 60 + nmin;
                                ;
                                console.log(">>>>>>>>allBanners[t][skipBanner] = " + allBanners[t]['skipBanner']);

                                if (allBanners[t]['skipBanner'] === false && allBanners[t]['startTime'] <= timeinmins && timeinmins < allBanners[t]['stopTime']) {
                                        var newImageSrc = "https://www.iskconbangla.com/img/_topbanner/" + allBanners[t]['gif'];
                                        //console.log("banner=" + newImageSrc);
                                        var image = new Image();
                                        image.onload = function () {
                                                // console.log(">>>>>>>>>>>>image.src = " + image.src);
                                                $(".head-banner").css("background-image", "url('" + newImageSrc + "')");
                                                console.log('>>>>>>>>>>>>image.src = ' + $(".head-banner").css("background-image"));
                                        };
                                        image.src = newImageSrc;
                                }
                        }
                        //   for (var t in globalBannersStore) {
                        //console.log("t = "+t);
                        //   for (var u in globalBannersStore[t]) {
                        //console.log("u = "+u);
                        //console.log(globalBannersStore[t][u]);
                        //}
                        //}

                })

                socket.on('bannerUpdated', function (bannerObject) { //update globalBannersStore
                        console.log("in bannerUpdated");
                        id = bannerObject['_id'];
                        console.log("id = " + id);
                        for (var s in bannerObject) {
                                if (s !== "_id") {
                                        globalBannersStore[id][s] = bannerObject[s];
                                }
                        }
                        console.log(globalBannersStore[id]);
                });


                socket.on('allVideosRetrieved', function (allVideos) {
                        for (var t in allVideos) {
                                var num = allVideos[t]['_id'].substring(5, allVideos[t]['_id'].length)
                                console.log("allVideosRetrieved" + allVideos[t]['_id'].length);
                                console.log("num = " + num + "t = " + t + "   allVideos[t][title] = " + allVideos[t]['title'] + "  allVideos[t][url] = " + allVideos[t]['url']);
                                //$("#v_link_"+num).text(allVideos[t]['url']);
                                $("#v_link_" + num).attr("src", allVideos[t]['url']);
                                $("#v_name_" + num).html(allVideos[t]['title']);
                        }
                })


                $('.loadmore button').click(function () {
                        socket.emit('get16MoreNewsHeadlines', startIndex, moreButtonYear);
                })

                socket.on('16MoreNewsHeadlinesRetrieved', function (dataObject) {
                        console.log("in loadmore get16MoreNewsHeadlines - startIndex = " + startIndex)
                        var more16Headlines = dataObject;
                        var getLowestDate = 999999999999999;
                        console.log("more16Headlines.length = " + more16Headlines.length);
                        more16Headlines.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));



                        for (var i = more16Headlines.length - 1; i > 0; i--) {
                                if (more16Headlines[i]['block_number'] < 17) {     // remove any headlines from the frontpage (they will be numbered 1 to 16 - all others are numbered 90)
                                        console.log("Deleting: " + more16Headlines[i]);
                                        more16Headlines.splice(i, 1);
                                } else if (more16Headlines[i]['_id'] < getLowestDate) {  //get the lowest date to set the year for the more button
                                        getLowestDate = more16Headlines[i]['_id'];
                                        console.log('SSSSSgetLowestDate = ', getLowestDate);
                                        console.log("getLowestDate = " + getLowestDate);
                                        console.log("more16Headlines.length = " + more16Headlines.length);
                                        var date = new Date(parseInt(getLowestDate));
                                        moreButtonYear = date.getFullYear();
                                }
                        }
                        //                       more16Headlines.sort((a, b) => parseFloat(a.block_number) - parseFloat(b.block_number));
                        var remainder = 16 - more16Headlines.length;


                        for (var g in more16Headlines) {
                                setupfrontpage(more16Headlines[g]); //setup the 16 older news headlines one by one.
                        }
                        startIndex = startIndex + 16;
                        if (remainder > 0) {
                                socket.emit('get16MoreNewsHeadlines', startIndex, moreButtonYear);
                        }
                        console.log('XXXXXXmoreButtonYear  = ', moreButtonYear)
                });



                socket.on('newsArticleRetrieved', function (data) {
                        console.log("in 'newsArticleRetrieved = " + data);
                        var thisid = data['_id'];
                        console.log("thisid = " + thisid);
                        $(".page-YTnews-body-container").css("padding-top", "0");
                        $(".page-YTnews-body-container-holder").css("padding-top", "0");
                        $('.page-YTnews-body').html('');
                        $('.page-news-title').html('');
                        $('.page-news-body').html('');
                        $(".page-news-image").insertAfter(".page-news-title");
                        $(".page-news-image").css("padding-top", "0");
                        $('.page-news-image').html('');
                        $(".iframeholder").html('');
                        //console.log("this.id = " + thisid);
                        $(".container1, .vbgrid-container").css("display", "none");
                        $(".page-news-container").css("display", "block");
                        pageNumber = thisid.substring(10, thisid.length);
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        if (data['full_newstext']) {
                                $('.page-news-body').html(data['full_newstext']);
                        }

                        if (data['footer_ad'] && data['footer_ad'].length > 1) {
                                console.log("data[footer_ad]= " + data['footer_ad']);
                                $(".iframeholder").html('<div style="height: 350px"><iframe width="100%" height="100%" align="center" frameborder="no" scrolling="no" src="https://www.iskconbangla.com/iframe/' + data["footer_ad"] + '" style="vertical-align: center;" allowfullscreen></iframe></div>');
                        } else {
                                $(".iframeholder").html('');
                        }
                        $('.page-news-title').html(GlobalNewsTitle);

                        if (data['image']) {
                                console.log("data[image]= " + data['image']);
                                if (data['image'].length > 4 && !(data['youtube_embed'] && data['youtube_embed'].length > 40)) {
                                        $(".page-news-image").css("padding-top", "28px");

                                        var date = new Date(parseInt(thisid.substring(1, thisid.length)));
                                        theYear = parseInt(date.getFullYear());
                                        var newImage = "";
                                        newImage = "https://www.iskconbangla.com/img/" + theYear + "_news/" + data['image'];
                                        $('.page-news-image').html('<img src="' + newImage + '">')
                                }
                        } else {
                                //console.log("data[NewsImage]= " + data['NewsImage']);//coming from firebase hosting storage
                                var image = "https://www.iskconbangla.com/img/news/" + data['savedNewsImage'];
                                $(".page-news-image").css("padding-top", "28px");
                                $('.page-news-image').html('<img src="' + image + '">')
                        }
                        thisid = thisid.substring(1, thisid.length)
                        console.log("allNewsStorage[thisid][youtube_embed] = " + allNewsStorage[thisid]['youtube_embed']);

                        //if (allNewsStorage[fran]['block_number']) {
                        //      $('.page-news-title').html(allNewsStorage[fran]['savedNewsTitle']);
                        if (allNewsStorage[thisid]['youtube_embed'] && allNewsStorage[thisid]['youtube_embed'].length > 40) {
                                console.log("putting in youtube iframe");
                                $(".page-YTnews-body-container").css("padding-top", "56.25%");
                                $(".page-YTnews-body-container-holder").css("padding-top", "28px");
                                $('.page-YTnews-body').html(allNewsStorage[thisid]['youtube_embed']);
                                $(".page-news-image").insertAfter(".page-news-body");
                        }
                        $(".loadmore").hide()
                });



        } catch (e) {
                //
        }
        var date = new Date();
        theYear = (date.getYear() + 1900).toString();
        //theYear=2022;
        console.log(theYear);
        let latestDoc = null;


        function setupfrontpage(anArray) {
                //console.log("News Stories FromServer");
                var allData = anArray;
                var blockNumber = 'abc';
                var seconds = 1;
                var mins = 1;
                var hrs = 1;
                var days = 1;
                var weeks = 1;
                var fred = "abc";
                //youtube_embed is the optional youtube iframe
                //savedSpareTwo is the optional comment
                //savedSparethree is the footer iframe for the clicked news item only, not the front page, for the related department (aaa, or bbb etc)
                if (allData.hasOwnProperty('date_stamp')) {
                        fred = allData['date_stamp'];
                        allNewsStorage[fred] = {
                                savedNewsTitle: allData['title'],
                                savedNewsImage: allData['image'],
                                date_stamp: allData['date_stamp'],
                                short_text: allData['short_text'],
                                block_number: allData['block_number'],
                                youtube_embed: allData['youtube_embed'],
                                savedSpareThree: allData['footer_id'],
                                category: allData['category']
                        }; //savedNewsTextEntire:allData['savedNewsTextEntire']
                }
                blockNumber = allData['block_number'];
                //console.log("fred = "+fred);
                //Title and footer are common to all block designs, so we add them to all.
                if (allNewsStorage[fred]['savedNewsTitle']) {
                        $('#g' + blockNumber + ' .title').html(allNewsStorage[fred]['savedNewsTitle']); //should fill #g1 to #g24 news slots
                        theTitle = allNewsStorage[fred]["savedNewsTitle"];
                }

                var startTime = allNewsStorage[fred]['date_stamp'];
                const engToBdNum = (str) => {
                        for (var x in banglaNumber) {
                                str = str.replace(new RegExp(x, "g"), banglaNumber[x]);
                        }
                        return str;
                };
                const d = new Date();
                let endTime = d.valueOf();
                var timeDiff = endTime - startTime; //in ms
                // strip the ms
                timeDiff /= 1000;
                seconds = Math.floor(timeDiff);
                mins = Math.floor(seconds / 60);
                hrs = Math.floor(mins / 60);
                days = Math.floor(hrs / 24);
                weeks = Math.floor(days / 7);
                if (!days < 1) {
                        var date = new Date(parseInt(startTime));
                        const monthNames = [" জানুয়ারী ", " ফেব্রুয়ারী ", " মার্চ ", " এপ্রিল ", " মে ", " জুন ", " জুলাই ", " আগস্ট ", " সেপ্টেম্বর ", " অক্টোবর ", " নভেম্বর ", " ডিসেম্বর "];
                        //   console.log("The current month is " + monthNames[date.getMonth()]);
                        function convertbangla(dateblah) {
                                var value = "";
                                for (var i = 0; i <= dateblah.length - 1; i++) {
                                        value = value + banglaNumber[dateblah.charAt(i)];
                                }
                                return value;
                        }
                        var datex = date.getDate().toString();
                        var year = (date.getYear() + 1900).toString();
                        //console.log("value abc = " + convertbangla(date));
                        $('#g' + blockNumber + ' .text-footer').text(convertbangla(datex) + monthNames[date.getMonth()] + convertbangla(year));
                        theTimestamp = convertbangla(datex) + monthNames[date.getMonth()] + convertbangla(year);
                        //      $('#g' + blockNumber + ' .text-footer').text(banglaNumber[date.getDate()] +monthNames[date.getMonth()] +convertbangla(year));
                } else if (hrs > 1) {
                        hrs = engToBdNum(hrs.toString());
                        $('#g' + blockNumber + ' .text-footer').text(hrs + " ঘণ্টা আগে");
                        theTimestamp = hrs + " ঘণ্টা আগে"
                } else if (hrs === 1) {
                        $('#g' + blockNumber + ' .text-footer').text("১ ঘণ্টা আগে");
                        theTimestamp = "১ ঘণ্টা আগে"
                } else {
                        mins = engToBdNum(mins.toString());
                        $('#g' + blockNumber + ' .text-footer').text(mins + " মিনিট আগে");
                        theTimestamp = mins + " মিনিট আগে"
                }

                //show image
                var date = new Date(parseInt(allNewsStorage[fred]['date_stamp']));
                theYear = parseInt(date.getFullYear());
                var newImage = "";
                newImage = "https://www.iskconbangla.com/img/" + theYear + "_news_sm/" + allNewsStorage[fred]['savedNewsImage'];
                // if(blockNumber==2 && short_text=='#' ){
                //      $("#g2").html('<div class="bigPicture">'+ newImage+'</div>');
                // }else

                if (blockNumber >= 1 && blockNumber <= 8) {
                        $('#g' + blockNumber + " .news-body-container-holder").css("display", "block");
                        $('#g' + blockNumber + " .news-click").attr("id", fred);
                        //console.log("blockNumber = " + blockNumber);

                        //if it is not youtube and there is no image, or news text starts with "&") then SHOW NEWS TEXT ONLY AND NO PICTURE
                        if (allNewsStorage[fred]['short_text'] && allNewsStorage[fred]['short_text'].charAt(0) === "&") {

                                if (allNewsStorage[fred]['short_text'].charAt(0) === "&") {
                                        $('#g' + blockNumber + '  .news-body-text').html(allNewsStorage[fred]['short_text'].substring(1, allNewsStorage[fred]['short_text'].length));
                                } else {
                                        $('#g' + blockNumber + '  .news-body-text').text(allNewsStorage[fred]['short_text']);
                                }
                                //if it has an image, show image and title, but no text.
                        } else {
                                //if you are in the main news spot...Hmmmm....
                                if (blockNumber !== "2") {
                                        $('#g' + blockNumber + ' .news-image-container').html('<img src="' + newImage + '">')
                                } else {
                                        $('#g2 .bigPicture').html('<img src="' + newImage + '">')
                                }
                        }
                        //if it has a youtube iFrame, show youtube logo on picture
                        if (allNewsStorage[fred]['youtube_embed'] && allNewsStorage[fred]['youtube_embed'].length > 40) {
                                //console.log("show youtube button");
                                $('#g' + blockNumber + ' .news-image-container').append('<img src="img/ytbutton.png" style="position: absolute; left:10px; bottom: 15px;width: 43px; height: 33px">')
                                //$('#g'+blockNumber+' .news-body').html(allNewsStorage[fred]['youtube_embed']);
                        }
                }
                if (blockNumber >= 5 && blockNumber <= 16) { //5,6,7 and 8 have both large and small displays as according to the page width, they can be either.
                        $('#g' + blockNumber + " .news-click").attr("id", fred);
                        $('#g' + blockNumber + ' .little-news-image-container').html('<img src="' + newImage + '">') //displays image
                        //if it has a youtube iFrame, show youtube logo on picture
                        if (allNewsStorage[fred]['youtube_embed'] && allNewsStorage[fred]['youtube_embed'].length > 40) {
                                //console.log("show youtube button");
                                $('#g' + blockNumber + ' .little-news-image-container').append('<img src="img/ytbutton.png">')
                        }
                }
                if (blockNumber > 16) {
                        $(".grid-container").append('<div class="grid-box ' + fred + '"><div class="left-holder little-left-holder"><div class="title little-news-title">' + theTitle + '</div><div class="comment news-comment" style="display: none"></div><div class="text news-body-text" style="display: none"></div><div class="text-footer little-news-footer">' + theTimestamp + '</div></div><div class="little-news-image-container"><div class="little-news-image-flexy"><div class="little-news-image"></div></div></div><div class="news-click" id="' + fred + '"></div></div>');
                        $('.' + fred + ' .little-news-image-container').html('<img src="' + newImage + '">') //displays image
                        //if it has a youtube iFrame, show youtube logo on picture
                        if (allNewsStorage[fred]['youtube_embed'] && allNewsStorage[fred]['youtube_embed'].length > 40) {
                                //console.log("show youtube button");
                                $('.' + fred + ' .little-news-image-container').append('<img src="img/ytbutton.png">')
                        }
                }
                addClick(fred)
                var fileName = bigImage1;
                var imageHolder = new Image();
                imageHolder.onerror = badImage;
                imageHolder.onload = imageLoaded;
                try {
                        imageHolder.src = fileName;
                } catch (err) {
                        console.log("image loading error");
                }

                function imageLoaded(event) {
                        $('#g1 .bigPicture').html('<img src="' + imageHolder.src + '">')
                        var maxHeight = $(".bigPicture").height();
                        var heightMax = maxHeight - $("#g1 .news-title").height();
                        var maxH = heightMax + "px"
                        $("#g1 .news-body-text").css("max-height", maxH);
                        //blocks 5,6,7 and eight change style according to whether the number of rows is 4 (all are styled like 1-4), rows are 3 (7 and 8 are styled like 9 and above), rows are 2 or 1 (5,6,7 and 8 are styled like 9 and above)
                        if (window.matchMedia("screen and (min-width: 1240px)").matches) { //four columns
                                heightMax = maxHeight - $("#g3 .news-body").height() - $("#g3 .news-title").height();
                                maxH = heightMax + "px";
                                $("#g3 .news-body-text").css("max-height", maxH);

                                heightMax = maxHeight - $("#g4 .news-body").height() - $("#g4 .news-title").height();
                                maxH = heightMax + "px";
                                $("#g4 .news-body-text").css("max-height", maxH);
                                $("#g5 grid-large-version,#g6 grid-large-version,#g7 grid-large-version,#g8 grid-large-version").css("display", "block");
                                $("#g5 grid-small-version,#g6 grid-small-version,#g7 grid-small-version,#g8 grid-small-version").css("display", "none");
                                $("#g5 .news-body-text, #g6 .news-body-text,#g7 .news-body-text, #g8 .news-body-text").css("max-height", "120px");
                        } else if (window.matchMedia("screen and (min-width: 860px)").matches) { //three columns
                                heightMax = maxHeight - $("#g3 .news-body").height() - $("#g3 .news-title").height();
                                maxH = heightMax + "px";
                                $("#g3 .news-body-text").css("max-height", maxH);
                                $("#g5 grid-large-version,#g6 grid-large-version").css("display", "block");
                                $("#g5 grid-small-version,#g6 grid-small-version").css("display", "none");
                                $("#g5 .news-body-text, #g6 .news-body-text").css("max-height", "120px");
                                $("#g7 grid-large-version,#g8 grid-large-version").css("display", "none");
                                $("#g7 grid-small-version,#g8 grid-small-version").css("display", "block");
                        } else if (window.matchMedia("screen and (min-width: 624px)").matches) { //two columns
                                for (i = 5; i < 9; i++) {
                                        $("#g" + i + " grid-large-version").css("display", "none");
                                        $("#g" + i + " grid-small-version").css("display", "block");
                                        $("#g" + i + " .news-body-text").css("max-height", "120px");
                                }
                        }
                }

                function badImage(event) {
                        console.log("Big Image not loaded");
                }
                increasingNumber++;
        }

        $(window).resize(function () { //sets the heights of newsItem contents to fill the varying space as the window resizes. The top line takes its height from the (varying) big picture height and differs from the rest.
                console.log("RESIZING");
                var maxHeight = $(".bigPicture").height();
                var heightMax = maxHeight - $("#g1 .news-title").height();
                var maxH = heightMax + "px"
                $("#g1 .news-body-text").css("max-height", maxH);
                //blocks 5,6,7 and 8 change style according to whether the number of rows is 4 (all eight are styled like 1-4), rows are 3 (7 and 8 are styled like 9 and above), rows are 2 or 1 (5,6,7 and 8 are styled like 9 and above)

                if (window.matchMedia("screen and (min-width: 1240px)").matches) { //four columns
                        heightMax = maxHeight - $("#g3 .news-body").height() - $("#g3 .news-title").height();
                        maxH = heightMax + "px";
                        $("#g3 .news-body-text").css("max-height", maxH);

                        heightMax = maxHeight - $("#g4 .news-body").height() - $("#g4 .news-title").height();
                        maxH = heightMax + "px";
                        $("#g4 .news-body-text").css("max-height", maxH);
                        $("#g5 .grid-large-version,#g6 .grid-large-version,#g7 .grid-large-version,#g8 .grid-large-version").css("display", "block");
                        $("#g5 .grid-small-version,#g6 .grid-small-version,#g7 .grid-small-version,#g8 .grid-small-version").css("display", "none");
                        //$("#g5 .news-body-text, #g6 .news-body-text,#g7 .news-body-text, #g8 .news-body-text").css("max-height","120px");
                } else if (window.matchMedia("screen and (min-width: 860px)").matches) { //three columns
                        heightMax = maxHeight - $("#g3 .news-body").height() - $("#g3 .news-title").height();
                        maxH = heightMax + "px";
                        $("#g3 .news-body-text").css("max-height", maxH);
                        $("#g5 .grid-large-version,#g6 .grid-large-version").css("display", "block");
                        $("#g5 .grid-small-version,#g6 .grid-small-version").css("display", "none");
                        //$("#g5 .news-body-text, #g6 .news-body-text").css("max-height","120px");
                        $("#g7 .grid-large-version,#g8 .grid-large-version").css("display", "none");
                        $("#g7 .grid-small-version,#g8 .grid-small-version").css("display", "block");
                } else if (window.matchMedia("screen and (min-width: 624px)").matches) { //two columns
                        for (i = 5; i < 9; i++) {
                                $("#g" + i + " .grid-large-version").css("display", "none");
                                $("#g" + i + " .grid-small-version").css("display", "block");
                                //$("#g"+i+" .news-body-text").css("max-height","120px");
                        }
                }
        })



        setTimeout(function () { //leave time to load thumbnails
                $(window).trigger("resize");
        }, 8000);

        //set the date for the top of the page
        var todayBangla = "";
        const engToBdNum = (str) => {
                for (var x in banglaNumber) {
                        str = str.replace(new RegExp(x, "g"), banglaNumber[x]);
                }
                return str;
        };
        const d = new Date();
        var today = d.toUTCString()
        var monthBangla = "";
        today = today.substring(0, today.indexOf("202") + 4);
        if (today.indexOf("Mon") !== -1) {
                todayBangla = "সোমবার, ";
        } else if (today.indexOf("Tue") !== -1) {
                todayBangla = " মঙ্গলবার, ";
        } else if (today.indexOf("Wed") !== -1) {
                todayBangla = " বুধবার, ";
        } else if (today.indexOf("Thu") !== -1) {
                todayBangla = " বৃহস্পতিবার, ";
        } else if (today.indexOf("Fri") !== -1) {
                todayBangla = "শুক্রবার, ";
        } else if (today.indexOf("Sat") !== -1) {
                todayBangla = "শনিবার, ";
        } else if (today.indexOf("Sun") !== -1) {
                todayBangla = "রবিবার, ";
        }
        if (today.indexOf("Jan") !== -1) {
                monthBangla = " জানুয়ারী ";
        } else if (today.indexOf("Feb") !== -1) {
                monthBangla = " ফেব্রুয়ারী ";
        } else if (today.indexOf("Mar") !== -1) {
                monthBangla = " মার্চ ";
        } else if (today.indexOf("Apr") !== -1) {
                monthBangla = " এপ্রিল ";
        } else if (today.indexOf("May") !== -1) {
                monthBangla = " মে ";
        } else if (today.indexOf("Jun") !== -1) {
                monthBangla = " জুন ";
        } else if (today.indexOf("Jul") !== -1) {
                monthBangla = " জুলাই ";
        } else if (today.indexOf("Aug") !== -1) {
                monthBangla = " আগস্ট ";
        } else if (today.indexOf("Sep") !== -1) {
                monthBangla = " সেপ্টেম্বর ";
        } else if (today.indexOf("Oct") !== -1) {
                monthBangla = " অক্টোবর ";
        } else if (today.indexOf("Nov") !== -1) {
                monthBangla = " নভেম্বর ";
        } else if (today.indexOf("Dec") !== -1) {
                monthBangla = " ডিসেম্বর ";
        }
        year = today.substring(today.length - 4, today.length);
        year = engToBdNum(year.toString());
        dateth = today.substring(5, today.length - 9);
        dateth = engToBdNum(dateth.toString());
        $(".todaydate").text(todayBangla + dateth + monthBangla + year);

        $('.hamburger,.close-dropdown').click(function () {
                console.log("hello");
                if ($('.hamburger-container').css('display') === 'none') {
                        $('.hamburger-container').css('display', 'block');
                } else {
                        $('.hamburger-container').css('display', 'none');
                }
        });

        //return to main news page
        $('.return').click(function () {
                $('.page-YTnews-body').html('');
                $(".page-news-container").css("display", "none");
                $(".container1, .vbgrid-container").css("display", "grid");
                $(".loadmore").show()
                document.body.scrollTop = document.documentElement.scrollTop = 0;
        })

        function addClick(thisid) {
                $('#' + thisid).click(function () {

                        var thisid = "A" + this.id;
                        console.log("clicked #" + thisid);

                        var thisItemYear = new Date(parseInt(this.id));
                        theYear = thisItemYear.getFullYear();

                        console.log("::::::::::::::::::::::::::::theYear = " + theYear);

                        GlobalNewsTitle = $('#' + this.id).parent().find('.news-title').html();
                        console.log("--------------------------------------GlobalNewsTitle = " + GlobalNewsTitle);

                        // async function getDoc(thisid) {
                        socket.emit('retrieveNewsArticle', thisid);  // request individual news article
                });

        };

        //return to main news page
        $('.grid-box,.bigbox,.sub_smallbox').hover(
                function () {
                        console.log("inhover");
                        $(this).find(".news-title,.bb_txt,.title").css({
                                "color": "#0573e6",
                                "transition": "0.1s"
                        });
                        $(this).find(".bb_txt").css({
                                "color": "#36d606",
                                "transition": "0.1s"
                        });
                        $(this).find('.news-image-container img').css({
                                "-ms-transform": "scale(0.2)",
                                "-webkit-transform": "scale(0.2)",
                                "transform": "scale(1.05)",
                                "overflow": "hidden",
                                "transition": "0.1s"
                        });
                        $(this).find(".news-body-text").css('color', 'black');
                        $(this).find(".little-news-title").css({
                                "color": "#0573e6",
                                "transition": "0.5s"
                        });
                        $(this).find('.little-news-image-container img,.bigboxpic,.little-news-img-container').css({
                                "-ms-transform": "scale(1.2)",
                                "-webkit-transform": "scale(1.2)",
                                "transform": "scale(1.2)",
                                "overflow": "hidden",
                                "transition": "0.5s"
                        });
                        $(this).find('.bigPicture img').css({
                                "-ms-transform": "scale(1.2)",
                                "-webkit-transform": "scale(1.2)",
                                "transform": "scale(1.2)",
                                "overflow": "hidden",
                                "transition": "0.5s"
                        });
                        $(this).find(".text-footer").css({
                                "color": "black",
                                "transition": "0.5s"
                        });

                },
                function () {
                        $(this).find(".news-title,.bb_txt").css('color', 'black');
                        $(this).find(".bb_txt").css('color', '#ffffff');
                        $(this).find('.news-image-container img').css({
                                "-ms-transform": "scale(1.0)",
                                "-webkit-transform": "scale(1.0)",
                                "transform": "scale(1.0)"
                        });
                        $(this).find(".news-body-text").css('color', 'grey');
                        $(this).find(".little-news-title").css('color', 'black');
                        $(this).find('.little-news-image-container img,.bigboxpic,.little-news-img-container').css({
                                "-ms-transform": "scale(1.0)",
                                "-webkit-transform": "scale(1.0)",
                                "transform": "scale(1.0)"
                        });
                        $(this).find('.bigPicture img').css({
                                "-ms-transform": "scale(1.0)",
                                "-webkit-transform": "scale(1.0)",
                                "transform": "scale(1.0)"
                        });
                        $(this).find(".text-footer").css({
                                "color": "grey",
                                "transition": "0.5s"
                        });
                }
        )
        $('.bigpic').hover(
                function () {
                        console.log("inhover");
                        $(this).css({
                                "-ms-transform": "scale(0.2)",
                                "-webkit-transform": "scale(0.2)",
                                "transform": "scale(1.05)",
                                "overflow": "hidden",
                                "transition": "0.1s"
                        });

                },
                function () {

                        $(this).css({
                                "-ms-transform": "scale(1.0)",
                                "-webkit-transform": "scale(1.0)",
                                "transform": "scale(1.0)"
                        });

                }
        )

        function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                        pageLanguage: 'en'
                }, 'google_translate_element');
        }

        var scrollTop = window.pageYOffset
        window.onscroll = function () {
                myScroll()
        };

        function myScroll() {
                scrollTop = window.pageYOffset
                if (scrollTop > 113) {
                        $(".subnav").css("box-shadow", "0px 2px 6px #BBB");
                } else {
                        $(".subnav").css("box-shadow", "none");
                }
        }

        setInterval(checkBanner, 60000);

        function checkBanner() {
                // Get the current date and time in the Indian time zone
                const nd = new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Kolkata'
                });
                const dateObj = new Date(nd);
                const nhour = dateObj.getHours();
                const nmin = dateObj.getMinutes();
                var timeinmins = nhour * 60 + nmin;

                for (var t in globalBannersStore) {
                        if (globalBannersStore[t]['startTime'] <= timeinmins && timeinmins < globalBannersStore[t]['stopTime']) {
                                var newImageSrc = "https://www.iskconbangla.com/img/_topbanner/" + globalBannersStore[t]['gif'];
                                console.log("banner=" + newImageSrc);
                                var image = new Image();
                                image.onload = function () {
                                        console.log(">>>>>>>>>>>>image.src = " + image.src);
                                        $(".head-banner").css("background-image", "url('" + newImageSrc + "')");
                                };
                                image.src = newImageSrc;
                                return;
                        }
                }
        }


});

// popdown player function start

$(document).ready(function () {
        $("#flips").click(function () {
                $("#player").slideToggle(1000);
                if ($("#player").css("display") !== "none") {
                        player.stop();
                }

        });
});


// bangla clock start here

function updateTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();

        var bHours = toBanglaDigits(hours);
        var bMinutes = toBanglaDigits(minutes);
        var bSeconds = toBanglaDigits(seconds);

        var banglaTimeUnit = getBanglaTimeUnit(hours);

        var time = bHours + "ঃ" + bMinutes + "ঃ" + bSeconds;

        document.getElementById("clock").innerHTML = time;
        document.getElementById("kal").innerHTML = banglaTimeUnit;
}





function toBanglaDigits(num) {
        var digits = String(num).split("");
        var banglaDigits = "";

        for (var i = 0; i < digits.length; i++) {
                banglaDigits += getBanglaDigit(digits[i]);
        }

        return banglaDigits;
}

function getBanglaDigit(digit) {
        var banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        return banglaDigits[digit];
}

function getBanglaTimeUnit(hours) {
        var banglaTimeUnits = ["ভোর", "সকাল", "দুপুর", "বিকেল", "সন্ধ্যা", "রাত্রি"];

        if (hours >= 3 && hours < 5) {
                return banglaTimeUnits[0];
        } else if (hours >= 5 && hours < 12) {
                return banglaTimeUnits[1];
        } else if (hours >= 12 && hours < 15) {
                return banglaTimeUnits[2];
        } else if (hours >= 15 && hours < 18) {
                return banglaTimeUnits[3];
        } else if (hours >= 18 && hours < 19) {
                return banglaTimeUnits[4];
        } else {
                return banglaTimeUnits[5];
        }
}

setInterval(updateTime, 1000);