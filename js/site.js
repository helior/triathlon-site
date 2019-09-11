// Metrics
var Metrics = {
  totalRaised: 1000,
  donationGoal: 10000,
  survivalCount: 13820,
  totalInflicted: 15780,
  deathRatebyDisease: 58,
};
// Metrics (dynamic)
Metrics.donationTotal = Math.floor(Metrics.totalRaised * 100 / Metrics.donationGoal);
Metrics.survivalRate = Math.ceil(Metrics.survivalCount / Metrics.totalInflicted * 100);

// Quotes
var quotes = [
  "That is Salvation. To give of love inside.<br>To keep love of life, no matter what, and to give to others. <br>Generously.<br><br>— Sylvia Plath",
  "If you want to save the children, you gotta give me your monies. <br><br>— Helior",
  "Give, but give until it hurts. <br><br>— Mother Teresa",
  "It's easier to take than to give. <br>It's nobler to give than to take. <br>The thrill of taking lasts a day. <br>The thrill of giving lasts a lifetime. <br><br>— John F. Marques",
  "What we spend, we lose. <br>What we keep will be left for others. <br>What we give away will be ours forever. <br><br>— David McGee",
  "Every man must decide whether he will walk in the light of creative altruism or in the darkness of destructive selfishness. <br><br>- Martin Luther King Jr.",
  "You and your fancy lives.. You should use some of that money to give back to humanity. You'll get a tax deduction, too! <br><br>- Abraham Lincoln"
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
    // Used for tracking play count during a page visit.
    var playCount = 0;

    // Remove video if we're on non-deskop browsers.
    $('.tablet #video-bg video').remove();
    $('.mobile #video-bg video').remove();

    vid_w_orig = parseInt($('#video-bg video').attr('width'));
    vid_h_orig = parseInt($('#video-bg video').attr('height'));

    heroresize();
    $(window).resize(heroresize);

    // Randomize hero quote.
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    $('.hero-blockquote').html(quote);


    // Set coundown.
    $(".countdown").countdown({
      date: "15 september 2019 7:00:00", // add the countdown's end date (i.e. 3 november 2012 12:00:00)
      format: "on" // on (03:07:52) | off (3:7:52) - two_digits set to ON maintains layout consistency
    }, function() {
      // $('.countdown').remove();
    });

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
    $('.metric-value-donation-goal').text('$' + (Metrics.donationGoal).toLocaleString('en'));

    $('.circle-graph').easyPieChart({
      scaleColor: false,
      lineWidth: 8,
      lineCap: 'round',
      barColor: '#FD777F',
      trackColor: '#525252' ,
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

    mixpanel.track('page visit', {
      'orientation': devicejs.landscape() ? 'landscape' : 'portrait',
      'quote': quote,
      'totalRaised': Metrics.totalRaised,
      'donationGoal': Metrics.donationGoal,
      'isDesktop': devicejs.desktop()
    });

    var videoEl = document.getElementById('triathlon-video');
    videoEl.onended = function (e) {
      this.play();
      playCount++;
      mixpanel.track('videoEnded', {
        'playCount': playCount
      });
    }

    mixpanel.track_links('.donation-link', 'Clicked donation link', function(el) {
      return {
        'context': el.rel
      };
    });
  });

  $(window).load(function() {
    $('.desktop.video #video-bg video').append('<source src="http://donate.helior.info/videos/triathlon.webm" type="video/webm"><source src="http://donate.helior.info/videos/triathlon.mp4" type="video/mp4"><source src="http://donate.helior.info/videos/triathlon.ogv" type="video/ogg">');
    $('.desktop.video.no-videoh264 #video-bg video').css("display", "none");
    // todo: Mixpanel no-videoh264
  });

})(jQuery);
