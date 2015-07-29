(function($) {

  var min_w = 300;
  var vid_w_orig;
  var vid_h_orig;
  function heroresize() {
    var ww = $(window).width();
    var bh = $(document).height();
    var wh = $(window).height();
    var hh = $('header').innerHeight();
    featureHeight = wh - hh;
    $('#hero').css({'height': wh + 'px'});
    var scale_h = $(window).width() / vid_w_orig;
    var scale_v = $(window).height() / vid_h_orig;
    var scale = scale_h > scale_v ? scale_h : scale_v;
    if (scale * vid_w_orig < min_w) {
      scale = min_w / vid_w_orig;
    }
    ;
    $('.video #video-bg video').width(scale * vid_w_orig);
    $('.video #video-bg video').height(scale * vid_h_orig);
    var video_width = $('.video #video-bg video').width();
    var video_offset = ($('.video #video-bg video').width() - $(window).width()) / 2;
    $('.video #video-bg video').css({'left': '-' + video_offset + 'px'});
    $('.no-video #video-bg img').width(scale * vid_w_orig);
    $('.no-video #video-bg img').height(scale * vid_h_orig);
    var video_width = $('.no-video #video-bg img').width();
    var video_offset = ($('.no-video #video-bg img').width() - $(window).width()) / 2;
    $('.no-video #video-bg img').css({'left': '-' + video_offset + 'px'});
  }

  $(document).ready(function(){
    $('.tablet #video-bg video').remove();
    $('.mobile #video-bg video').remove();

    vid_w_orig = parseInt($('#video-bg video').attr('width'));
    vid_h_orig = parseInt($('#video-bg video').attr('height'));
    heroresize();
    $(window).resize(heroresize);

    $(".countdown").countdown({
      date: "31 july 2015 23:30:00", // add the countdown's end date (i.e. 3 november 2012 12:00:00)
      format: "on" // on (03:07:52) | off (3:7:52) - two_digits set to ON maintains layout consistency
    });
  });

  $(window).load(function() {
    $('.video #video-bg video').append('<source src="/videos/bike.mp4" type="video/mp4"/>');
    $('.video.no-videoh264 #video-bg video').css("display", "none");
  });

})(jQuery);
