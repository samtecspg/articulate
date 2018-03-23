

$(document).ready(function(){

  var nav_h = $( 'header .nav-links' ).outerHeight();
  var $nav_height = $('header div nav');

  $(window).on('resize',function() {
    var win = $(this);
    if (win.width() <= 599 ) {
      nav_h = $( 'header .nav-links' ).outerHeight();
    }

  });

  $('#nav-icon').click(function(){
    $(this).toggleClass('open');

    if ( $(this).hasClass('open') ) {
      $('header div nav').css('height', nav_h);
    } else {
      $nav_height.css('height', '');
    }

  });

  /**
 * Issue: When users click on an anchor link that scrolls them up/down the page,
 * the top of the section/heading they're going to is covered by a fixed header.
 *
 * This can be fixed on a case-by-case basis in CSS, but there are many gotchas!
 * In particular, if you add a pseudoelement offset above the anchor target, it might
 * make the text above the target unselectable (b/c it covers the text up)
 *
 * This JS solution simply scrolls the user up right after they click on the anchor,
 * just enough to compensate for the fixed header. It also compensates for the initial
 * page load of a url with an anchor already in it (listen for first scroll).
 */
!function (window)
{
	'use strict';

	// Update this function so it returns the height of your fixed headers
	function fixedHeaderOffset()
	{
		var width = window.innerWidth;

		if ( width < 525 ) {
			return 120;
		}
		else if ( width < 1024 ) {
			return 88;
		}
		else {
			return 40;
		}
	}

	// Run on first scroll (in case the user loaded a page with a hash in the url)
	window.addEventListener('scroll', onScroll);
	function onScroll()
	{
		window.removeEventListener('scroll', onScroll);
		scrollUpToCompensateForFixedHeader();
	}

	// Run on hash change (user clicked on anchor link)
	if ( 'onhashchange' in window ) {
		window.addEventListener('hashchange', scrollUpToCompensateForFixedHeader);
	}

	function scrollUpToCompensateForFixedHeader()
	{
		var hash,
			target,
			offset;

		// Get hash, e.g. #mathematics
		hash = window.location.hash;
		if ( hash.length < 2 ) { return; }

		// Get :target, e.g. <h2 id="mathematics">...</h2>
		target = document.getElementById( hash.slice(1) );
		if ( target === null ) { return; }

		// Get distance of :target from top of viewport. If it's near zero, we assume
		// that the user was just scrolled to the :target.
		if ( target.getBoundingClientRect().top < 2 ) {
			window.scrollBy(0, -fixedHeaderOffset());
		}
	}

}(window);


  var $nav_open = $( '#sidenav .nav-container > nav' ).outerHeight();

  $(function(){
      $('#sidenav .dropdown-btn').on('click',function(event){

        event.preventDefault();
        $(this).toggleClass('nav-open');

        if ( $(this).hasClass('nav-open') ) {
          $('#sidenav .nav-container').css('height', $nav_open);
        } else {
          $('#sidenav .nav-container').css('height', '');
        }

      });

  });


});
