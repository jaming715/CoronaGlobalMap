function finishedLoading() {
  // $.when($('#loading-icon').fadeOut(700)).done(function() {
  //   $('#root')
  //     .css({visibility: 'visible', opacity: 0.0})
  //     .animate({opacity: 1.0}, 300);
  // });
  $('#loading-icon').hide();
  $('#root').css('visibility', 'visible');
}
