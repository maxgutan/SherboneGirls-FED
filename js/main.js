$(document).ready(function () {

    $(".btn-menu").click(function () {
        $('body').toggleClass('menu-open');
    });

    $('.btn-contact').click(function () {
        $('ul').toggle('slow');

    });

    $(".scroll-btn").on('click', function () {
        if (getWindowWidth() > 992) {
            $('#wrapper').animate({
                scrollLeft: getWindowWidth()
            }, 4000);
        } else {
            $('html,body').animate({
                scrollTop: getWindowHeight()
            }, 4000);

        }

    });

    $('.admissions-item').click(function () {
        $(this).toggleClass('active');
        $('.admissions-slideout-holder').toggleClass('open');

    });



   







    /* $('.navigation_holder  .main-nav .has-sub > span, .navigation_holder  .main-nav .has-sub > a').click(function (e) {
         e.preventDefault();
         e.stopImmediatePropagation();
         var elTitle = $(this).parent().find('>a').text(),
             elMenu = $(this).parent().find('>ul').html(),
             el = $(this).parent();

         el.parent().find('.has-sub').removeClass('active');
         el.addClass('active');

         if ($('.navigation_holder').hasClass('lvl-3-active')) {
             $('.stage-lvl3  span.back-top').trigger('click');
         }

         $('.stage-lvl2 .back-top').html('back');
         $('.stage-lvl2 ul.main-menu').html(elMenu);

         $('.navigation_holder').addClass('lvl-2-active');

         $('.stage-lvl2').transition({
             'opacity':1,
             'visibility':'visible'
         },800);
     });


    /* $('body').on('click', '.stage-lvl2 .main-menu .has-sub > span, .stage-lvl2 .main-menu .has-sub > a', function (e) {
         e.preventDefault();
         e.stopImmediatePropagation();
         var elTitle = $(this).parent().find('>a').text(),
             elMenu = $(this).parent().find('>ul').html(),
             el = $(this).parent();

         el.parent().find('has-sub').removeClass('active');
         el.addClass('active');


         $('.stage-lvl3 .back-top').html('back');
         $('.stage-lvl3 ul.main-menu').html(elMenu);

         $('.menu-wrapper').addClass('lvl-3-active');

         /*$('.stage-lvl3').transition({
             'opacity':1,
             'visibility':'visible'
         },800);*/
    /*  });

    /*  $('body').on('click', '.stage-lvl2  span.back-top', function () {
          if ($('.menu-wrapper').hasClass('lvl-3-active')) {
              $('.stage-lvl3  span.back-top').trigger('click');
          }

          $('.menu-wrapper').removeClass('lvl-2-active');
          $('.stage-lvl2 h3').html('');
          $('.stage-lvl2 ul.main-menu').html('');

          /*$('.stage-lvl2').transition({
             'opacity':0,
             'visibility':'hidden'
         },400, function () {

         });*/
    /* });
    /* $('body').on('click', '.stage-lvl3  span.back-top', function () {
         $('.menu-wrapper').removeClass('lvl-3-active');
         $('.stage-lvl3 h3').html('');
         $('.stage-lvl3 ul.main-menu').html('');
     });


     $(".menu-stage.stage-lvl1").click(function (e) {
         if (e.target != this) return; // only continue if the target itself has been clicked
         // this section only processes if the .nav > li itself is clicked.
         $('.stage-lvl3  span.back-top').trigger('click');
         $('.stage-lvl2  span.back-top').trigger('click');
     }); */


});
