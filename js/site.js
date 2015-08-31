// Metrics
var Metrics = {
  totalRaised: 1250,
  donationGoal: 800,
  survivalCount: 13820,
  totalInflicted: 15780,
  deathRatebyDisease: 58,
};
// Metrics (dynamic)
Metrics.donationTotal = Math.floor(Metrics.totalRaised * 100 / Metrics.donationGoal);
Metrics.survivalRate = Math.ceil(Metrics.survivalCount / Metrics.totalInflicted * 100);

// Quotes
var quotes = [
  "That is Salvation. To give of love inside.<br>To keep love of life, no matter what, and to give to others. Generously.<br>— Sylvia Plath",
  "There is another way."
];

// Source: http://stackoverflow.com/a/2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

(function($) {
  var devicejs = device.noConflict();
  if (devicejs.desktop()) {
    $('.parallax').parallax();
  }

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

    var $video = $('.video #video-bg video');
    $video.width(scale * vid_w_orig);
    $video.height(scale * vid_h_orig);
    var video_width = $video.width();
    var video_offset = ($video.width() - $(window).width()) / 2;

    var $poster = $('.no-video #video-bg img');
    if ($poster.length) {
      $video.css({'left': '-' + video_offset + 'px'});
      $poster.width(scale * vid_w_orig);
      $poster.height(scale * vid_h_orig);
      var video_width = $poster.width();
      var video_offset = ($poster.width() - $(window).width()) / 2;
      $poster.css({'left': '-' + video_offset + 'px'});
    }

  }

  $(document).ready(function(){
    // Remove video if we're on non-deskop browsers.
    $('.tablet #video-bg video').remove();
    $('.mobile #video-bg video').remove();
    // todo: Mixpanel non-deskop

    vid_w_orig = parseInt($('#video-bg video').attr('width'));
    vid_h_orig = parseInt($('#video-bg video').attr('height'));

    if (devicejs.desktop()) {
      heroresize();
      $(window).resize(heroresize);
    }

    // Randomize hero quote.
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    // todo: Mixpanel quote
    $('.hero-blockquote').html(quote);


    // Set coundown.
    $(".countdown").countdown({
      date: "19 september 2015 23:30:00", // add the countdown's end date (i.e. 3 november 2012 12:00:00)
      format: "on" // on (03:07:52) | off (3:7:52) - two_digits set to ON maintains layout consistency
    }, function() {console.log('finished')});

    window.scrollFireCallback = function() {
      window.setTimeout(function() {$('.metric-treatment-count').data('easyPieChart').update(100);}, 100);
      window.setTimeout(function() {$('.metric-death-rate').data('easyPieChart').update(Metrics.deathRatebyDisease);}, 400);
      window.setTimeout(function() {$('.metric-survival-odds').data('easyPieChart').update(12.5);}, 700);
      window.setTimeout(function() {$('.metric-total-raised').data('easyPieChart').update(Metrics.donationTotal);}, 1000);
    }
    Materialize.scrollFire([
      {selector: '.metrics-strip', offset:350, callback: 'scrollFireCallback()'}
    ]);

    $('.metric-value-donation-percent').text(Metrics.donationTotal + '%');
    $('.metric-value-donation-goal').text('$' + Metrics.donationGoal);

    $('.circle-graph').easyPieChart({
      scaleColor: false,
      lineWidth: 6,
      lineCap: 'round',
      barColor: '#FD777F',
      trackColor: '#9AABA7' ,
      size: 150,
      // animate: 1500,
      animate: {duration: 1000, enabled: true},
      onStep: function(from, to, currentValue) {
        // Calculate current percent of animation completion.
        var calcPercent = Math.ceil(currentValue * 100 / to);

        // Metric: Survival Rate
        if (this.el.classList.contains('metric-treatment-count')) {
          // Animate treatment count
          $('b span', this.el).text(Math.ceil(calcPercent * 40 / 100));
        }

        // Metric: Death Rate
        else if (this.el.classList.contains('metric-death-rate')) {
          // Animate deathRatebyDisease
          $('b span', this.el).text(Math.ceil(currentValue));
        }

        // Metric: Total Raised
        else if (this.el.classList.contains('metric-total-raised')) {
          // Animate totalRaised.
          $('b span', this.el).text(numberWithCommas(Math.ceil(Metrics.totalRaised * calcPercent / 100)));
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
