// Metrics
var Metrics = {
  totalRaised: 250,
  donationGoal: 800,
  survivalCount: 13820,
  totalInflicted: 15780
};
// Metrics (dynamic)
Metrics.donationTotal = Math.floor(Metrics.totalRaised * 100 / Metrics.donationGoal);

// Source: http://stackoverflow.com/a/2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

(function($) {

  var quotes = [
    "That is Salvation. To give of love inside.<br>To keep love of life, no matter what, and to give to others. Generously.<br>— Sylvia Plath",
    "There is another way."
  ];

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
    // Remove video if we're on non-deskop browsers.
    $('.tablet #video-bg video').remove();
    $('.mobile #video-bg video').remove();
    // todo: Mixpanel non-deskop

    vid_w_orig = parseInt($('#video-bg video').attr('width'));
    vid_h_orig = parseInt($('#video-bg video').attr('height'));
    heroresize();
    $(window).resize(heroresize);

    // Randomize hero quote.
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    // todo: Mixpanel quote
    $('.hero-blockquote').html(quote);


    // Set coundown.
    $(".countdown").countdown({
      date: "19 september 2015 23:30:00", // add the countdown's end date (i.e. 3 november 2012 12:00:00)
      format: "on" // on (03:07:52) | off (3:7:52) - two_digits set to ON maintains layout consistency
    }, function() {console.log('finished')});

    $('.metric-total-raised').data('percent', Metrics.donationTotal);
    $('.metric-value-donation-percent').text(Metrics.donationTotal + '%');
    $('.metric-value-donation-goal').text('$' + Metrics.donationGoal);
    $('.metric-survival-rate').data('percent', Math.ceil(Metrics.survivalCount / Metrics.totalInflicted * 100));
    $('.circle-graph').easyPieChart({
      scaleColor: false,
      lineWidth: 4,
      lineCap: 'round',
      barColor: '#a378aa',
      trackColor: '#e7b8ef' ,
      size: 150,
      animate: 1500,
      onStep: function(values) {
        // Calculate current percent of animation completion.
        var calcPercent = Math.ceil(values[0] * 100 / this.percentage);

        // Metric: Total Raised
        if (this.el.classList.contains('metric-total-raised')) {
          // Animate totalRaised.
          $('b', this.el).text(numberWithCommas(Math.ceil(Metrics.totalRaised * calcPercent / 100)));
        }

        // Metric: Survival Rate
        else if (this.el.classList.contains('metric-survival-rate')) {
          // Animate survivalRate
          $('b', this.el).text(Math.ceil(values[0]));
        }
      }
    });

  });

  $(window).load(function() {
    $('.desktop.video #video-bg video').append('<source src="videos/bike.mp4" type="video/mp4">');
    $('.desktop.video.no-videoh264 #video-bg video').css("display", "none");
    // todo: Mixpanel no-videoh264
  });

})(jQuery);
