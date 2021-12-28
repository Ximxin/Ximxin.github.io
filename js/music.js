let number = 0;
let Lyric = null;
let BasePath = "music/";
let musicName = [
    BasePath + "Jar Of Love.mp3",
    BasePath + "That Girl.mp3",
    BasePath + "把孤独当做晚餐.mp3",
    BasePath + "你不是真正的快乐.mp3",
    BasePath + "心安理得.mp3"
];
let musicLyric = [
    BasePath + "Jar Of Love.lrc",
    BasePath + "That Girl.lrc",
    BasePath + "把孤独当做晚餐.lrc",
    BasePath + "你不是真正的快乐.lrc",
    BasePath + "心安理得.lrc"
];
/**
 * @return {number}
 */
let getSec = function (sourceDate){
    return Math.floor(sourceDate % 60);
};
let getMin = function (sourceDate) {
    return Math.floor(sourceDate / 60);
};
let getLyric = () => $.ajax({url:musicLyric[number].replace(/ /g, '%20'), async:false}).responseText;
let next = true;
let flag = 0;
let sourceCurTime;
let sourceAllTime;
let loadMusicTimeAndLyric = function () {
    sourceCurTime = $("#music")[0].currentTime;
    sourceAllTime = $("#music")[0].duration;
    let curTime = null;
    let allTime = null;
    if(getMin(sourceCurTime) < 10){
        if(getSec(sourceCurTime) < 10)
            curTime = '0' + getMin(sourceCurTime) + ':0' + getSec(sourceCurTime);
        else
            curTime = '0' + getMin(sourceCurTime) + ':' + getSec(sourceCurTime);
    }else {
        if(getSec(sourceCurTime) < 10)
            curTime = getMin(sourceCurTime) + ':0' + getSec(sourceCurTime);
        else
            curTime = getMin(sourceCurTime) + ':' + getSec(sourceCurTime);
    }
    if(getMin(sourceAllTime) < 10){
        if(getSec(sourceAllTime) < 10)
            allTime = '0' + getMin(sourceAllTime) + ':0' + getSec(sourceAllTime);
        else
            allTime = '0' + getMin(sourceAllTime) + ':' + getSec(sourceAllTime);
    }else {
        if(getSec(sourceAllTime) < 10)
            allTime = getMin(sourceAllTime) + ':0' + getSec(sourceAllTime);
        else
            allTime = getMin(sourceAllTime) + ':' + getSec(sourceAllTime);
    }
    $("#music-date").text(curTime + " / " + allTime);
    if(Lyric != null){
        for (let i = 0; i < Lyric.length; i++){
            if(parseFloat(sourceCurTime) >= parseFloat(Lyric[i]['sec'])){
                if (next) {
                    if(i === flag){
                        $(".top-music-lyric1").text(Lyric[i]['lyric']);
                        $(".top-music-lyric1").addClass("lyric-color");
                        $(".top-music-lyric2").removeClass("lyric-color");
                        if(Lyric.length > i + 1)
                            $(".top-music-lyric2").text(Lyric[i+1]['lyric']);
                        flag++;
                        next = false;
                    }
                }else {
                    if(i === flag){
                        $(".top-music-lyric2").text(Lyric[i]['lyric']);
                        $(".top-music-lyric2").addClass("lyric-color");
                        $(".top-music-lyric1").removeClass("lyric-color");
                        if(Lyric.length > i + 1)
                            $(".top-music-lyric1").text(Lyric[i+1]['lyric']);
                        flag++;
                        next = true;
                    }
                }
            }
        }
    } else {
        $(".top-music-lyric1").text("暂未找到歌词...");
        $(".top-music-lyric2").text("");
    }
};
let loadMusicTitleAndMusic = function () {
    let title = getLyric().match(/\[ti:.*\]/g);
    $(".music-title").text(title[0].split(':')[1].split(']')[0]);
    $("#music").attr("src", musicName[number]);
};
let parseLyric = function () {
    let result = [];
    let lyric = getLyric().match(/\[[0-9]{2}:[0-9]{2}\.[0-9]{2}\].*/g);
    for (let i = 0; i < lyric.length; i++){
        let sec = parseFloat(lyric[i].split("]")[0].split('[')[1].split(':')[0]) * 60 +
            parseFloat(lyric[i].split("]")[0].split('[')[1].split(':')[1]);
        let lyr = lyric[i].split(']')[1];
        result.push({"sec": sec, "lyric": lyr})
    }
    Lyric = result;
};
$("#music")[0].addEventListener("timeupdate", loadMusicTimeAndLyric);
$("#music")[0].addEventListener("pause", function () {
    $("#icon-music").removeClass("play-music");
});
$("#music")[0].addEventListener("play", function () {
    $("#icon-music").addClass("play-music");
});
$("#music")[0].addEventListener("ended", function () {
    nextMusic();
});
let playMusic = function () {
    parseLyric();
    $("#music")[0].play();
};
let nextMusic = function(){
    flag = 0;
    pauseMusic();
    if (number < musicName.length - 1)
        number++;
    else
        number = 0;
    loadMusicTitleAndMusic();
    playMusic();
};
$("#next-music").click(nextMusic);
let pauseMusic = function () {
    $("#music")[0].pause();
};
$("#icon-music").click(function () {
    if ($("#music")[0].paused) {
        playMusic();
    }else {
        pauseMusic();
    }
});
loadMusicTitleAndMusic();
