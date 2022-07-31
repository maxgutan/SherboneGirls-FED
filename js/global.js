function getWindowWidth() {
    return $(window).width();

}
function getWindowHeight() {
    return $(window).height();

}



function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

    var result = {width: 0, height: 0, fScaleToTargetWidth: true};

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    } else {
        fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    } else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}

function RememberOriginalSize(img) {
    if (!img.originalsize) {
        img.originalsize = {width: $(img).actual('width'), height: $(img).actual('height')};
    }
}

function FixImage(fLetterBox, div, img, animation) {
    RememberOriginalSize(img);
    var targetwidth = $(div).width() != 0 ? $(div).width() : $(div).actual('width');
    var targetheight = $(div).width() != 0 ? $(div).height() : $(div).actual('height');

    //console.log(targetwidth + '|' + targetheight);

    var srcwidth = img.originalsize.width;
    var srcheight = img.originalsize.height;

    var result = ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox);

    img.width = result.width;
    img.height = result.height;

    if (animation) {
        $(img).transition({
            "left": result.targetleft,
            "top": result.targettop
        }, 100, function () {
            $(this).parent().transition({
                "opacity": 1
            }, 600);
        });
    } else {
        $(img).css({
            "left": result.targetleft,
            "top": result.targettop
        });
    }
}

function IsImageOk(img) {
    if (!img.complete) {
        return false;
    }

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    return true;
}

function FixImages(fLetterBox, target, animation) {
    var goodToGo = false;
    var len = target.length;
    target.each(function (index, div) {

        $(div).find("img").each(function () {
            var img = $(this).get(0);
            var myInt2 = setInterval(function () {
                if (IsImageOk(img)) {
                    FixImage(fLetterBox, div, img, animation);
                    goodToGo = true;
                    clearInterval(myInt2);
                } else {
                    goodToGo = false;
                }
            }, 100);

        })
    });

    return goodToGo;
}

function resizeMainImg(el, animation) {
    return FixImages(false, el, animation);
}

function addListClasses() {
    $('.secondLvlCss ul li,.secondLvlCss ol li').each(function () {
        if ($(this).index() % 2 == 0) {
            $(this).addClass('odd');
        } else {
            $(this).addClass('even');
        }
    })
}

function addTableClasses() {
    $('.secondLvlCss table tr').each(function () {
        if ($(this).index() % 2 == 0) {
            $(this).addClass('odd');
        } else {
            $(this).addClass('even');
        }
    });
    $('.secondLvlCss table tr th').each(function () {
        if ($(this).index() % 2 == 0) {
            $(this).addClass('odd');
        } else {
            $(this).addClass('even');
        }
    });
}

function specialHref() {
    $('.secondLvlCss a[href$=".pdf"]:not(".downloadBtn")').each(function () {
        if (!$(this).find('>img').length)
            $(this).addClass('filepdf');
    });

    $('.secondLvlCss a[target="_blank"]:not(".downloadBtn, .filepdf")').each(function () {
        if (!$(this).find('>img').length)
            $(this).addClass('external');
    });

    $('.secondLvlCss a[href^="mailto"]:not(".downloadBtn")').each(function () {
        if (!$(this).find('>img').length)
            $(this).addClass('mail');
    });
    /*$('.secondLvlCss a.downloadBtn').each(function(){
        $(this).append('<span />');
    });*/
}

function styleIframe() {
    $('.secondLvlCss iframe').each(function () {
        if (!$(this).hasClass("wufoo-form-container"))
            $(this).wrap('<div class="iframe-holder" />');
    });
}

function styleTables() {
    $('.secondLvlCss table').each(function () {
        $(this).wrap('<div class="table-wrapper"><div class="table-overflow" /></div>');
    });
}

function firstParagraph() {
    $('.secondLvlCss:first > p:first').addClass('introParagraph');
}

function triggerAccordion() {
    var icons = {
        header: "ui-icon-plus",
        activeHeader: "ui-icon-minus"
    };
    $(".accordion").accordion({
        collapsible: true,
        active: false,
        clearStyle: true,
        heightStyle: "content",
        icons: icons,
        header: ">h2",
        autoHeight: false,
        animate: {easing: 'easeInOutQuad', duration: 250},
        beforeActivate: function (event, ui) {
            /*console.log($(ui.newHeader).length + '|' + $(ui.oldPanel).length);
             //$(ui.newHeader).parent().toggleClass('open');

             if($(ui.newHeader).length) $(ui.newHeader).parent().addClass('open');
             if($(ui.oldPanel).length) $(ui.oldPanel).parent().removeClass('open');*/
        }
    });

    if (location.hash.length) {
        try {
            var hash = location.hash;
            $(".secondLvlCss .accordion .accordion-content a[href='" + hash + "']").parents(".accordion").find(".accordion-title").click();
            $('html, body').animate({
                scrollTop: ($(".secondLvlCss .accordion .accordion-content a[href='" + hash + "']").parents(".accordion").offset().top - 50) + 'px'
            }, 'fast');
        } catch (e) {

        }
    }
}

function styleContentImages() {
    $('.secondLvlCss p img').each(function () {
        var getSide = $(this).css('float');
        $(this).parents('p').addClass('specialBlock side-' + getSide);
        $(this).parents('p').contents().eq(1).wrap('<span />');
    });
}

function random(option) {
    //return a random number up to the option number
    return Math.floor(Math.random() * option)
}

function checkDevice() {
    var ua = navigator.userAgent.toLowerCase();
    isAndroid = ua.indexOf("android") > -1 ? true : false; //&& ua.indexOf("mobile");
    if (isAndroid) {
        // Do something!
        // Redirect to Android-site?
        isAndroid = true;
    }
}

$.fn.textWidth = function () {
    var html_org = $(this).html();
    var html_calc = '<i class="text-width">' + html_org + '</i>';
    $('body').append(html_calc);
    var width = $('body').find('>i:last').actual('width') + 180;
    $('body > i:last').remove();
    return width;
};


function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemOffset = 0;
    var transitionTime = Modernizr.touch ? 0 : 800;

    if (elem.attr('data-offset') != undefined) {
        elemOffset = elem.attr('data-offset');
    }
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    if (elemOffset != 0) { // custom offset is updated based on scrolling direction
        if (docViewTop - elemTop >= 0) {
            // scrolling up from bottom
            elemTop = $(elem).offset().top + elemOffset;
        } else {
            // scrolling down from top
            elemBottom = elemTop + $(elem).height() - elemOffset
        }
    }

    if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
        // once an element is visible exchange the classes
        //$(elem).removeClass('notViewed').addClass('viewed');
        var direction = $(elem).attr('data-position');

        $(elem).removeClass('notViewed');


        switch (direction) {

            case 'bottom' :
                $(elem).transition({
                    '-webkit-transform': 'translateY(0)',
                    'transform': 'translateY(0)',
                    'opacity': 1
                }, transitionTime, function () {
                    $(elem).addClass('viewed');
                });
                break;
        }


        var animElemsLeft = $('.animBlock.notViewed').length;
        if (animElemsLeft == 0) {
            // with no animated elements left debind the scroll event
            //$(window).off('scroll');
        }
    }
}

function fitVideo(object) {
    //video needs to report to its parent holder and not window
    var $target = object.parent();
    var naturalHeight = ($target.width() * object.height()) / object.width();
    if (naturalHeight >= $target.height()) {
        object.css({
            'height': 'auto',
            'width': $target.width(),
            'top': (-(object.height() - $target.height()) / 2),
            'left': 0
        });
        object.css('top', -(object.height() - $target.height()) / 2);
    } else {
        object.css({'height': $target.height(), 'width': 'auto', 'top': 0});
        object.css('left', -(object.width() - $target.width()) / 2);
    }
}

var $window = $(window);
var instances = [];


$.fn.moveIt = function () {

    $(this).each(function () {
        instances.push(new moveItItem($(this)));
    });


    window.onscroll = function () {
        var scrollTop = $window.scrollLeft();
        instances.forEach(function (inst) {
            inst.update(scrollTop);
        });
    }
}

var moveItItem = function (el) {
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed'));
};

moveItItem.prototype.update = function (scrollTop) {
    var pos = scrollTop / this.speed;
    this.el.css('-webkit-transform', 'translate3d(' + pos + 'px,0,0)');
    this.el.css('transform', 'translate3d(' + pos + 'px,0,0)');
};


$.fn.moveItHorizontal = function () {

    $(this).each(function () {
        instances.push(new moveItItemHorizontal($(this)));
    });


    window.onscroll = function () {
        var scrollTop = $window.scrollLeft();
        instances.forEach(function (inst) {
            inst.update(scrollTop);
        });
    }
}

var moveItItemHorizontal = function (el) {
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed'));
};

moveItItemHorizontal.prototype.update = function (scrollTop) {
    var pos = scrollTop / this.speed;
    this.el.css({
        'transform': 'translate(' + pos + 'px, -50%)'
    });
};


var initDesktopImg,
    landscapeSlider,
    landscapeSliderOptions = {
        auto: true,
        speed: 800,
        pause: typeof autoScrollDelay == "undefined" ? 4600 : autoScrollDelay,
        pager: false,
        controls: false,
        //useCss:true,
        mode: 'fade',
        onSliderLoad: function (currentIndex) {
            resizeMainImg($('.background-holder .img-bg'), false);
            //$('.background-slider .img-bg').eq(currentIndex).addClass('current pt-page-fadeUp');
            setTimeout(function () {
                if (!$('.background-holder.complete').length) {
                    setTimeout(function () {
                        $('.background-slider').transition({
                            'opacity': 1
                        }, 600, function () {
                            $('.background-holder').addClass('complete');
                            //if (!Modernizr.touch) $('[data-scroll-speed]').moveIt();
                            $('.alert-holder').addClass('open');
                            $('.landing-holder .txt-holder').addClass('animated');
                            //$('.background-slider .img-bg').eq(currentIndex).removeClass('pt-page-fadeUp');
                        });
                    }, 100);
                }
            }, 100);
        }/*,
        onSlideBefore: function ($slideElement, oldIndex, newIndex) {
            $('.background-slider .img-bg').eq(oldIndex).addClass('pt-page-scaleDownUp');
            $('.background-slider .img-bg').eq(newIndex).addClass('current pt-page-scaleUp pt-page-delay300');
        },
        onSlideAfter: function ($slideElement, oldIndex, newIndex) {
            setTimeout(function () {
                $('.background-slider .img-bg').eq(oldIndex).removeClass('current pt-page-scaleDownUp');
                $('.background-slider .img-bg').eq(newIndex).removeClass('pt-page-scaleUp pt-page-delay300');
            },100);

        }*/
    },
    landscapeSliderOptionsContent = {
        auto: $('.background-slider .img-bg').length > 1 ? true : false,
        speed: 400,
        pause: 4600,
        pager: false,
        controls: $('.background-slider .img-bg').length > 1 ? true : false,
        mode: 'fade',
        nextText: '<span>Next</span>',
        prevText: '<span>Prev</span>',
        onSliderLoad: function (currentIndex) {


            resizeMainImg($('.background-slider .img-bg'), false);

            if (!$('.background-holder').hasClass('complete')) {
                setTimeout(function () {
                    $('.background-slider').transition({
                        'opacity': 1
                    }, 1200, function () {
                        $('.background-holder').addClass('complete');
                    });
                }, 100);

            }
        }
    };


var imagesArray = [
    ['/Images/img/bg/landing-bg.jpg', '/Images/img/bg/bg-img1-mobile.jpg'],
    ['/Images/img/bg/bg-img2.jpg', '/Images/img/bg/bg-img2-mobile.jpg'],
    ['/Images/img/bg/bg-img3.jpg', '/Images/img/bg/bg-img3-mobile.jpg'],
    ['/Images/img/bg/bg-img4.jpg', '/Images/img/bg/bg-img4-mobile.jpg'],
    ['/Images/img/bg/bg-img5.jpg', '/Images/img/bg/bg-img5-mobile.jpg']
];
/*
* img
img-mobile
tag-text
heading text
info heading
info text
* */
var homepageRotatorImagesArray = [
    {
        'desktopImage': './Images/stages/stage-dsk-1.png',
        'mobileImage': './Images/stages/stage-mob-1.png',
        'triggerButton': 'a story of spirituality',
        'infoTitle': 'Spirituality',
        'url': '#some-Spirituality',
        'contentImg': './Images/stages/stage-dsk-1.png',
        'description': ' <p>Spirituality - Sherborne girls understand Christian values, they value reflection and well-being in themselves and others.</p>' +
            '<p>We aim to develop opportunities for leadership and management of the highest calibre that is highly effective, professional, collaborative and supportive for both our staff and our pupils. We will achieve this for our staff with excellent pastoral support, investment in professional development, opportunities for management, leadership and promotion in conjunction with a collaborative, aspirational and highly respectful work environment.</p>'
    },
    {
        'desktopImage': './Images/stages/stage-dsk-2.png',
        'mobileImage': './Images/stages/stage-mob-2.png',
        'triggerButton': 'a story of Curiousity',
        'infoTitle': 'Curious',
        'url': '#some-Curious',
        'contentImg': './Images/stages/stage-dsk-2.png',
        'description': ' <p>Curious - Sherborne girls understand Christian values, they value reflection and well-being in themselves and others.</p>' +
            '<p>We aim to develop opportunities for leadership and management of the highest calibre that is highly effective, professional, collaborative and supportive for both our staff and our pupils. We will achieve this for our staff with excellent pastoral support, investment in professional development, opportunities for management, leadership and promotion in conjunction with a collaborative, aspirational and highly respectful work environment.</p>'
    },
    {
        'desktopImage': './Images/stages/stage-dsk-3.png',
        'mobileImage': './Images/stages/stage-mob-3.png',
        'triggerButton': 'a story of Adaptability',
        'infoTitle': 'Adaptable',
        'url': '#some-Adaptable',
        'contentImg': './Images/stages/stage-dsk-1.png',
        'description': ' <p>Adaptable - Sherborne girls understand Christian values, they value reflection and well-being in themselves and others.</p>' +
            '<p>We aim to develop opportunities for leadership and management of the highest calibre that is highly effective, professional, collaborative and supportive for both our staff and our pupils. We will achieve this for our staff with excellent pastoral support, investment in professional development, opportunities for management, leadership and promotion in conjunction with a collaborative, aspirational and highly respectful work environment.</p>'
    },
    {
        'desktopImage': './Images/stages/stage-dsk-4.png',
        'mobileImage': './Images/stages/stage-mob-4.png',
        'triggerButton': 'a story of Compassion',
        'infoTitle': 'Compassionate',
        'url': '#some-Compassionate',
        'contentImg': './Images/stages/stage-dsk-1.png',
        'description': ' <p>Compassionate - Sherborne girls understand Christian values, they value reflection and well-being in themselves and others.</p>' +
            '<p>We aim to develop opportunities for leadership and management of the highest calibre that is highly effective, professional, collaborative and supportive for both our staff and our pupils. We will achieve this for our staff with excellent pastoral support, investment in professional development, opportunities for management, leadership and promotion in conjunction with a collaborative, aspirational and highly respectful work environment.</p>'
    },
    {
        'desktopImage': './Images/stages/stage-dsk-1.png',
        'mobileImage': './Images/stages/stage-mob-1.png',
        'triggerButton': 'a story of Courage',
        'infoTitle': 'Courageous',
        'url': '#some-Courageous',
        'contentImg': './Images/stages/stage-dsk-1.png',
        'description': ' <p>Courageous - Sherborne girls understand Christian values, they value reflection and well-being in themselves and others.</p>' +
            '<p>We aim to develop opportunities for leadership and management of the highest calibre that is highly effective, professional, collaborative and supportive for both our staff and our pupils. We will achieve this for our staff with excellent pastoral support, investment in professional development, opportunities for management, leadership and promotion in conjunction with a collaborative, aspirational and highly respectful work environment.</p>'
    },

];

function getUnique(count) {
    // Make a copy of the array
    var tmp = homepageRotatorImagesArray.slice(homepageRotatorImagesArray);
    var ret = [];

    for (var i = 0; i < count; i++) {
        var index = Math.floor(Math.random() * tmp.length);
        var removed = tmp.splice(index, 1);
        // Since we are only removing one element
        ret.push(removed[0]);
    }
    return ret;
}

function checkAlertLocal() {
    if ($("#alertExpiryDateUTC").length) {
        var expiryDate = moment.utc($("#alertExpiryDateUTC").val()).toDate();
        var currentDate = new Date();

        if (moment(currentDate).isBefore(moment(expiryDate))) {
            return true;
        }
    } else {
        return true;
    }
}

function checkNoticeLocal() {
    if ($("#noticeExpiryDateUTC").length) {
        var expiryDate = moment.utc($("#noticeExpiryDateUTC").val()).toDate();
        var currentDate = new Date();

        if (moment(currentDate).isBefore(moment(expiryDate))) {
            return true;
        }
    } else {
        return true;
    }
}

var topPosition = 0;

var hpRender = {
    init: function () {
        var self = this;

        self.getRandom(); //good
        self.setupMenu(); //good
        self.initAdminissions();
        self.initNews();
        self.initScrolls(); //to review
        self.initVideo(); //good
        self.initMisc();

        if (($('.notification-alert').length && checkAlertLocal()) || ($('.notification-notice').length && checkNoticeLocal())) self.initAlert();
    },
    initOnLoad: function () {
        var that = this;
        setTimeout(that.initMedia, 100);

        $('body').removeClass('__loading');


        setTimeout(function () {
            //trigger alert
            if ($('.notification-alert').length && checkAlertLocal() && !getCookie('show_alert')) {
                $('body').addClass('_alertOpen');
                setCookie('show_alert', '1', 999);
            } else {
                if ($('.notification-notice').length && checkNoticeLocal() && !getCookie('show_notice')) {
                    $('body').addClass('_noticeOpen');
                    setCookie('show_notice', '1', 999);
                }
            }
        }, 2200);

    },

    initOnResize: function () {
        var that = this;
        that.initSliderImgs();

        if (!Modernizr.touch) {
            that.applyParallaxFix();
        }
    },

    applyParallaxFix: function () {
        return;

        if (getWindowWidth() > 991) {
            $('.landing-adventure .background-holder .img-holder').css('left', -$('.landing-adventure').offset().left / 4);
            $('.landing-space .background-holder .img-holder').css('left', -$('.landing-space').offset().left / 4);
            $('.landing-compassion .background-holder .img-holder').css('left', -$('.landing-compassion').offset().left / 4);
        } else {
            $('.landing-adventure .background-holder .img-holder').css('left', 0);
            $('.landing-space .background-holder .img-holder').css('left', 0);
            $('.landing-compassion .background-holder .img-holder').css('left', 0);
        }

    },

    initMisc: function () {
        if (Modernizr.touch) {
            $('body').on('click', '.btn-contact span', function () {
                $(this).parent().toggleClass('_show');
            });
        }
    },

    initVideo: function () {
        var $videoObj = $('#video');

        if (window.addEventListener) {
            $videoObj.get(0).addEventListener("timeupdate", function () {
                // if the video is loaded and duration is known
                if (!isNaN(this.duration)) {
                    var percent_complete = this.currentTime / this.duration;
                    $('.video-timelapse span').css('width', percent_complete * 100 + '%');
                }
            });
        }

        $videoObj.bind('webkitendfullscreen', function () {
            $videoObj[0].webkitExitFullScreen();
        });

        $videoObj.get(0).onended = function () {
            $videoObj[0].webkitExitFullScreen();
            $('.video-poster').removeClass('_hide');

            $('.video-controls .ctrl.play').addClass('pause');
            $('.video-timelapse span').css('width', 0);

            $videoObj.get(0).load();
            $videoObj.get(0).pause();

            $('html, body').animate({
                scrollLeft: getWindowWidth() * 1.12
            }, 10);
        };

        $('body')
            .on('click', '.video-poster, .video-controls .ctrl.play', function () {
                $('.video-poster').addClass('_hide');
                if ($('.video-controls .ctrl.play').hasClass('pause')) {
                    $videoObj.get(0).play();
                } else {
                    $videoObj.get(0).pause();
                }

                $('.video-controls .ctrl.play').toggleClass('pause');
            })
            .on('click', '.video-controls .ctrl.sound', function () {
                if ($(this).hasClass('mute')) {
                    $videoObj.prop('muted', true);
                } else {
                    $videoObj.prop('muted', false);
                }

                $(this).toggleClass('mute');
            })
            .on('click', '.video-controls .ctrl.screen', function () {

                if ($videoObj[0].requestFullscreen) {
                    $videoObj[0].requestFullscreen();
                } else if ($videoObj[0].webkitRequestFullscreen) { /* Safari */
                    $videoObj[0].webkitRequestFullscreen();
                } else if ($videoObj[0].msRequestFullscreen) { /* IE11 */
                    $videoObj[0].msRequestFullscreen();
                }
            })
            .on('click', '.video-controls .ctrl-play-mobile', function () {
                //$('.video-poster').addClass('_hide');
                //$(this).addClass('_hide');
                $videoObj.get(0).play();
            });


    },

    initAlert: function () {

        $('body').on('click', '.trigger-alert', function (e) {
            e.stopImmediatePropagation();

            $('body').toggleClass('_alertOpen').removeClass('_noticeOpen');
        });

        $('body').on('click', '.notification-alert .close-btn, .trigger-alert', function (e) {
            e.stopImmediatePropagation();

            $('body').toggleClass('_alertOpen').removeClass('_noticeOpen');
        });

        $('body').on('click', '.trigger-notification', function (e) {
            e.stopImmediatePropagation();
            $('body').toggleClass('_noticeOpen').removeClass('_alertOpen');
        });

        $('body').on('click', '.notification-notice .close-btn, .trigger-notification', function (e) {
            e.stopImmediatePropagation();

            $('body').toggleClass('_noticeOpen').removeClass('_alertOpen');
        });

        $(document).click(function (event) {
            $target = $(event.target);
            if ((!$target.closest('.notification-holder').length && $('body').hasClass("_alertOpen")) ||
                (!$target.closest('.notification-holder').length && $('body').hasClass("_noticeOpen"))) {
                $('body').removeClass('_alertOpen _noticeOpen');
            }
        });

        if (getWindowWidth() < 992 && $('.notice-holder').length && checkNoticeLocal()) {
            $('body').addClass('_noticeOpen');
        }

    },

    updateSlideoutContent: function (ind) {

        var title = $('[data-admission="' + ind + '"] .txt-holder h3').text() + ' <span>' + $('[data-admission="' + ind + '"] .txt-holder p').text() + '</span>';

        $('.admission-slideout-holder .slideout-header h2').html(title);

        $('[data-content="' + ind + '"]').show().siblings().hide();
    },

    stopInlineVideo: function () {
        if ($('.entry-content .video-wrap._play').length) {
            var $videoObj = $('.entry-content .video-wrap._play').find('video');
            $('.entry-content .video-wrap').removeClass('_play');

            $videoObj.get(0).load();
            $videoObj.get(0).pause();

        }
    },

    playInlineVideo: function (videoEl) {
        var $videoObj = $(videoEl),
            $videoParent = $videoObj.parent();

        $videoObj.get(0).onended = function () {

            $videoParent.removeClass('_play');

            $videoObj.get(0).load();
            $videoObj.get(0).pause();
        };

        if ($videoParent.hasClass('_play')) {
            $videoObj.get(0).play();
        } else {
            $videoObj.get(0).pause();
        }

    },

    initAdminissions: function () {
        var self = this,
            timeOffset = getWindowWidth() > 992 ? 320 : 200;

        topPosition = 0;

        $('body')
            .on('click', '.admission-item', function () {
                var localThis = this;

                $(localThis).addClass('_active').siblings().removeClass('_active');

                self.updateSlideoutContent($(localThis).attr('data-admission'));


                setTimeout(function () {
                    if (getWindowWidth() > 991) {
                        $('html, body').animate({
                            scrollLeft: $(localThis).offset().left
                        }, 320, function () {
                            $('body')
                                .addClass('_admission-slideout-open')
                                .off('wheel');
                        });
                    } else {
                        topPosition = $(localThis).offset().top;

                        $('html, body').animate({
                            scrollTop: topPosition
                        }, 260, function () {
                            $('body')
                                .addClass('_admission-slideout-open');
                        });
                    }
                }, timeOffset);
            })
            .on('click', '.admission-slideout-holder .slideout-header .close-btn', function () {

                $('body').removeClass('_admission-slideout-open');
                $('.admission-item').removeClass('_active');

                if (getWindowWidth() > 991) {
                    self.stopInlineVideo();


                    $('html, body').animate({
                        scrollLeft: $('.admission-holder').offset().left
                    }, 320);

                    initSkel();
                } else {

                    $('html, body').animate({
                        scrollTop: topPosition - 54
                    }, 10);
                }

            })
            /*.on('click','._admission-slideout-open .slideout-overlay', function (e) {
                e.stopPropagation();

                $('body').removeClass('_admission-slideout-open');
                $('.admission-item').removeClass('_active');

                if (getWindowWidth() > 991) {
                    self.stopInlineVideo();
                    initSkel();
                } else {

                    $('html, body').animate({
                        scrollTop: topPosition - 54
                    }, 10);
                }
            })*/
            .on('click', '.entry-content .whole-link', function (e) {
                e.preventDefault();

                $(this).parent().toggleClass('_play');

                self.playInlineVideo($(this).parent().find('video'));

            });
    },

    initNews: function () {
        var self = this,
            timeOffset = getWindowWidth() > 992 ? 320 : 200;

        $('body')
            .on('click', '.news-item', function () {
                var localThis = this;

                $(localThis).addClass('_active').siblings().removeClass('_active');

                //self.updateSlideoutContent($(localThis).attr('data-admission'));

                setTimeout(function () {
                    if (getWindowWidth() > 991) {
                        $('html, body').animate({
                            scrollLeft: $(localThis).offset().left
                        }, 320, function () {
                            $('body')
                                .addClass('_news-slideout-open')
                                .off('wheel');
                        });
                    } else {
                        topPosition = $(localThis).offset().top;

                        $('html, body').animate({
                            scrollTop: topPosition
                        }, 260, function () {
                            $('body')
                                .addClass('_news-slideout-open');
                        });
                    }

                }, timeOffset);

            })
            .on('click', '.news-slideout-holder .slideout-header .close-btn', function () {
                $('body').removeClass('_news-slideout-open');
                $('.news-item').removeClass('_active');

                //self.stopInlineVideo();
                if (getWindowWidth() > 991) {

                    $('html, body').animate({
                        scrollLeft: $('.news-holder').offset().left
                    }, 320);

                    initSkel();
                } else {

                    $('html, body').animate({
                        scrollTop: topPosition - 54
                    }, 10);
                }

            })
        /*.on('click', '.slideout-overlay', function (e) {
            e.stopPropagation();

            $('body').removeClass('_news-slideout-open');
            $('.news-item').removeClass('_active');

            //self.stopInlineVideo();
            if (getWindowWidth() > 991) {
                initSkel();
            } else {
                $('html, body').animate({
                    scrollTop: topPosition - 54
                }, 10);
            }

        })*/;
    },

    getRandom: function () {
        var random = getUnique(1),
            self = this;

        $('.js-init').each(function (ind, el) {
            $(el).append(self.generateJsContent(random[ind]));
        });

        self.generateSlideOutContent(random[0]);

        if (!Modernizr.touch) {
            //$('[data-scroll-speed]').moveIt();
            hpRender.applyParallaxFix();
        }

        hpRender.initSliderImgs();
        hpRender.initLandingWidget();
    },

    getSelected: function (el) {
        //update button and bg image
        var self = this,
            item = el[0];

        $('.trigger-button span').text(item.triggerButton);
        $('.background-holder').append(
            "<div class='img-holder _hidden' data-scroll-speed='4' data-image-desktop='" + item.desktopImage + "' data-image-mobile='" + item.mobileImage + "'></div>"
        );

        self.initSliderImgs();

        //scroll back to top on slideOut
        $('.story-slideout-holder .overflow-content').animate({
            scrollTop: 0
        }, 200);

        self.generateSlideOutContent(item);

        setTimeout(function () {
            $('.background-holder .img-holder._hidden').addClass('_show').removeClass('_hidden').siblings().fadeOut();
        }, 320);


    },

    generateJsContent: function (array) {
        var item = array,
            generatedHtml;

        generatedHtml = "<div class='trigger-button'>" +
            "<i></i><span>" + item.triggerButton + "</span>" +
            "</div>" +
            "<div class='background-holder'>" +
            "<div class='img-holder' data-scroll-speed='4' data-image-desktop='" + item.desktopImage + "' data-image-mobile='" + item.mobileImage + "'></div>" +
            "</div>";

        return generatedHtml;
    },

    generateSlideOutRelated: function (skipEl) {
        var relatedHtml = '',
            relatedArray = homepageRotatorImagesArray.filter(function(item) {
                return item.infoTitle != skipEl.infoTitle;
            });

        /*relatedArray.forEach(el => {
            relatedHtml += '<div class="related-card" data-item="' + el.infoTitle + '">\n' +
                '                    <div class="img-holder">\n' +
                '                        <img src="' + el.desktopImage + '" alt="">\n' +
                '                    </div>\n' +
                '                    <div class="txt-holder">\n' +
                '                        <h4>' + el.infoTitle + '</h4>\n' +
                '                    </div>\n' +
                '                </div>';*/

        Array.prototype.slice.call(relatedArray).forEach( function(el) {
            relatedHtml += '<div class="related-card" data-item="' + el.infoTitle + '">\n' +
                '                    <div class="img-holder">\n' +
                '                        <img src="' + el.desktopImage + '" alt="">\n' +
                '                    </div>\n' +
                '                    <div class="txt-holder">\n' +
                '                        <h4>' + el.infoTitle + '</h4>\n' +
                '                    </div>\n' +
                '                </div>';
        });

        return relatedHtml;

        //console.log(skipEl, relatedArray);
    },

    generateSlideOutContent: function (arrEl) {
        var $slideOutContainer = $('.story-slideout-holder'),
            slideOutHeaderText = arrEl.triggerButton,
            slideOutContent = '',
            self = this;

        slideOutContent += '<div class="img-holder"><img data-desktop-src="' + arrEl.desktopImage + '" data-mobile-src="' + arrEl.mobileImage + '" alt=""></div>' +
            '<div class="txt-holder">' +
            arrEl.description +
            '<p><a href="' + arrEl.url + '"><span>read more</span></a></p>' +
            '</div>';

        $slideOutContainer
            .find('.slideout-header h2').text(slideOutHeaderText).end()
            .find('.slideout-content').html(slideOutContent).end()
            .find('.slideout-related .related-holder').html(self.generateSlideOutRelated(arrEl));


        self.initSlideOutImage();


    },

    initSlideOutImage: function () {
        if (getWindowWidth() > 991) {
            $('.slideout-content .img-holder img').attr("src", $('.slideout-content .img-holder img').attr('data-desktop-src'));
        } else {
            $('.slideout-content .img-holder img').attr("src", $('.slideout-content .img-holder img').attr('data-mobile-src'));
        }
    },

    initSliderImgs: function () {
        $('.background-holder .img-holder').each(function (ind, el) {
            if (getWindowWidth() > 991) {
                $(el).css("background-image", "url(" + $(el).attr('data-image-desktop') + ")");
            } else {
                //setTimeout(function() {
                $(el).css("background-image", "url(" + $(el).attr('data-image-mobile') + ")");
                //},10);
            }
        });
    },

    initLandingWidget: function () {
        var self = this,
            scrollOffset = 0;

        $('body')
            .on('click', '.trigger-button', function () {
                scrollOffset = $('html, body').scrollLeft() > 100 ? 400 : 0;
                $('html, body').animate({
                    scrollLeft: 0
                }, scrollOffset, function () {
                    $('body').addClass('_story-slideout-open');
                });
            })
            .on('click', '.story-slideout-holder .slideout-header .close-btn', function () {
                $('body').removeClass('_story-slideout-open');
            })
            .on('click', '.slideout-related .related-card', function () {
                //self.getSelected(homepageRotatorImagesArray.filter(item => item.infoTitle === $(this).attr('data-item')))


                var that = this,
                    selectedItems = homepageRotatorImagesArray.filter(function(item) {
                        return item.infoTitle === $(that).attr('data-item');
                    });

                self.getSelected(selectedItems);
            });

        $('body').on('click', '.overflow-content', function(e) {
            if (e.target !== this)
                return;


            switch (true) {
                case $('body').hasClass('_story-slideout-open'):
                    $('body').removeClass('_story-slideout-open');
                    break;

                case $('body').hasClass('_admission-slideout-open'):
                    $('body').removeClass('_admission-slideout-open');
                    $('.admission-item').removeClass('_active');

                    if (getWindowWidth() > 991) {
                        self.stopInlineVideo();
                        initSkel();
                    } else {
                        $('html, body').animate({
                            scrollTop: topPosition - 54
                        }, 10);
                    }
                    break;

                case $('body').hasClass('_news-slideout-open'):
                    $('body').removeClass('_news-slideout-open');
                    $('.news-item').removeClass('_active');

                    //self.stopInlineVideo();
                    if (getWindowWidth() > 991) {
                        initSkel();
                    } else {
                        $('html, body').animate({
                            scrollTop: topPosition - 54
                        }, 10);
                    }
                    break;

            }
        });

        $('body').on('click','.slideout-overlay', function (e) {
            e.stopPropagation();

            switch (true) {
                case $('body').hasClass('_story-slideout-open'):
                    $('body').removeClass('_story-slideout-open');
                    break;

                case $('body').hasClass('_admission-slideout-open'):
                    $('body').removeClass('_admission-slideout-open');
                    $('.admission-item').removeClass('_active');

                    if (getWindowWidth() > 991) {
                        self.stopInlineVideo();
                        initSkel();
                    } else {
                        $('html, body').animate({
                            scrollTop: topPosition - 54
                        }, 10);
                    }
                    break;

                case $('body').hasClass('_news-slideout-open'):
                    $('body').removeClass('_news-slideout-open');
                    $('.news-item').removeClass('_active');

                    //self.stopInlineVideo();
                    if (getWindowWidth() > 991) {
                        initSkel();
                    } else {
                        $('html, body').animate({
                            scrollTop: topPosition - 54
                        }, 10);
                    }
                    break;

            }
        });
    },

    initScrolls: function () {
        //TODO: refactor if will be needed or delete

        $('.scroll-prompt').click(function () {
            /* if($(this).hasClass('repeat-visit')) {
                 if(getWindowWidth() < 991) {
                     $('html, body').animate({
                         scrollTop:$('.section.stories-holder').offset().top - 50
                     }, 1200);
                 } else {
                     $('html, body').animate({
                         scrollLeft: $('.section.stories-holder').offset().left
                     }, 1200);
                 }
             } else {*/
            if (getWindowWidth() < 991) {
                $('html, body').animate({
                    scrollTop: getWindowHeight() - 50
                }, 1200);
            } else {
                $('html, body').animate({
                    scrollLeft: getWindowWidth()
                }, 1200);
            }
            /*}*/


        });

        var $after = document.querySelector('.landing-holder .text-holder p');


        $after.addEventListener('click', function (e) {
            if (e.offsetX > $after.offsetWidth) {
                //span.className = 'c2';
                $('html, body').animate({
                    scrollLeft: getWindowWidth()
                }, 1200);
            } else {
                // span.className = 'c1';
            }
        });

        $('.back-to-start').click(function () {
            if (getWindowWidth() < 991) {
                $('html, body').animate({
                    scrollTop: -100
                }, 1200);
            } else {
                $('html, body').animate({
                    scrollLeft: -100
                }, 1200);
            }
        });
    },

    setupMenu: function () {
        //2nd lvl
        $('.main-nav > li > ul').each(function () {
            $(this).parent().addClass("has-sub").append('<span />');
        });

        $('.main-nav > li > ul > li > ul').each(function () {
            $(this).parent().addClass("has-sub").append('<span />');
        });

        $('body').on('click', '.main-nav > li > span, .main-nav > li.has-sub > a', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var $menuObj = $(this).parent().find('>ul').clone().addClass('second-level-menu'),
                anchorTxt = $(this).parent().find('>a').text(),
                subMenuHtml = '<div class="sub-menu-header"><span class="back-btn" data-target="1">Back</span><h3 class="current-selection">' + anchorTxt + '</h3></div>';
            //buildObj = '';


            $('.layer2 .vertical-align').html('').append(subMenuHtml).append($menuObj);

            $('.navigation-holder').addClass('lvl-2-active');
        });

        $('body').on('click', '.second-level-menu > li > span, .second-level-menu > li.has-sub > a', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var $menuObj = $(this).parent().find('>ul').clone().addClass('second-level-menu'),
                anchorTxt = $(this).parent().find('>a').text(),
                subMenuHtml = '<div class="sub-menu-header"><span class="back-btn" data-target="2">Back</span><h3 class="current-selection">' + anchorTxt + '</h3></div>';

            //buildObj = '<a class="current-selection" data-target="2" href="#">'+anchorTxt+'</a>';


            $('.layer3 .vertical-align').html('').append(subMenuHtml).append($menuObj);

            $('.navigation-holder').addClass('lvl-3-active');
        });


        $('body').on('click', '.sub-menu-header .back-btn, .back-layer', function (e) {
            e.preventDefault();

            var target = $(this).attr('data-target');

            if (target == 2) {
                $('.navigation-holder').removeClass('lvl-3-active');
                setTimeout(function () {
                    $('.layer3 .vertical-align').html('');
                }, 320);
            } else {
                $('.navigation-holder').removeClass('lvl-2-active');
                setTimeout(function () {
                    $('.layer2 .vertical-align').html('');
                }, 320);
            }

        });

        var posTop,
            timeOffset = getWindowWidth() < 992 ? 200 : 200;

        //trigger menu


        $('.fixed-buttons .btn-menu').click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).toggleClass('close');


            if ($(this).hasClass('close')) {
                posTop = $(window).scrollTop();
                $('.menu-overlay').fadeIn(400, "linear");

                setTimeout(function () {
                    $('body').addClass('menu-open');
                }, timeOffset);

                $(this).find('a > i').text('close');

                //$('.fixed-top').addClass('stuck');


            } else {

                $('body').removeClass('menu-open');
                $(this).find('a > i').text('menu');

                $('html, body').animate({
                    scrollTop: posTop
                }, 0);

                $('.menu-overlay').fadeOut(400, "linear");

            }

        });


        //open menu on active element
        if ($('.main-nav > li > ul > li > a.active').length) {
            //console.log('2nd level menu');

            $('.main-nav > li > ul > li > a.active').parent().parent().parent().find('span').trigger('click');
        }
        if ($('.main-nav > li > ul > li > ul > li > a.active').length) {
            //console.log('3rd level menu');
            //var $level2Menu = $('.main-nav > li > ul > li > ul > li > a.active').parent().parent().parent().addC;
            $('.main-nav > li > ul > li > ul > li > a.active').parent().parent().parent().parent().parent().find('span').trigger('click');
            $('.second-level-menu > li > ul > li > a.active').parent().parent().parent().find('span').trigger('click');

        }
    },

    initMenuNew: function () {
        return;

        var posTop;


        $('.landing-holder .menu-trigger, .fixed-top-bar .menu-trigger').click(function (e) {
            e.stopImmediatePropagation();
            $('.landing-holder .menu-trigger, .fixed-top-bar .menu-trigger').toggleClass('close');
            $('body').toggleClass('menu-open');

            if ($('body').hasClass('menu-open')) {
                posTop = $(window).scrollTop();
                setTimeout(function () {
                    $('body').addClass('fixed');
                }, 400);

            } else {
                $('body').removeClass('fixed');

                $('html, body').animate({
                    scrollTop: posTop
                }, 0);
                setTimeout(function () {

                    $('html, body').animate({
                        scrollTop: posTop - 10
                    }, 0);
                }, 1);


            }
        });

        $('.navigation-holder .menu-trigger').click(function (e) {
            e.stopImmediatePropagation();
            $('body').toggleClass('menu-open');

            if ($('body').hasClass('menu-open')) {
                posTop = $(window).scrollTop();
                setTimeout(function () {
                    $('body').addClass('fixed');
                }, 400);

            } else {
                $('body').removeClass('fixed');

                $('html, body').animate({
                    scrollTop: posTop
                }, 0);
                setTimeout(function () {
                    $('html, body').animate({
                        scrollTop: posTop - 10
                    }, 0);
                }, 1);
            }
        });


        /*open 2nd level menu*/
        $('.menu-holder > .main-menu > li.has-sub > *').click(function () {
            var elTitle = $(this).parent().find('>a').text(),
                elMenu = $(this).parent().find('>ul').html();

            $('.stage-lvl2 h3').html(elTitle);
            $('.stage-lvl2 ul.main-menu').html(elMenu);

            $('.menu-holder').addClass('menu-lvl2');

            $('.menu-holder > .main-menu > li').removeClass('active');
            $(this).parent().addClass('active');

            $('.stage-lvl2').transition({
                'opacity': 1,
                'visibility': 'visible'
            }, 800);
        });

        $('body').on('click', '.stage-lvl2 > .main-menu > li > a', function (e) {
            e.preventDefault();
            var elTitle = $(this).parent().find('>a').text(),
                elMenu = $(this).parent().find('>ul').html();

            $('.stage-lvl3 h3').html(elTitle);
            $('.stage-lvl3 ul.main-menu').html(elMenu);

            $('.menu-holder').addClass('menu-lvl3');

            $('.stage-lvl2 > .main-menu > li').removeClass('active');
            $(this).parent().addClass('active');

            $('.stage-lvl3').transition({
                'opacity': 1,
                'visibility': 'visible'
            }, 800);
        });


        $('body').on('click', '.stage-lvl2 > .close-lvl', function () {
            $('.stage-lvl2').transition({
                'opacity': 0,
                'visibility': 'hidden'
            }, 400, function () {
                $('.stage-lvl2 h3').html('');
                $('.stage-lvl2 ul.main-menu').html('');
                $('.menu-holder').removeClass('menu-lvl2');
                $('.menu-holder > .main-menu > li').removeClass('active');
            });
        });

        $('body').on('click', '.stage-lvl3 > .close-lvl', function () {
            $('.stage-lvl3').transition({
                'opacity': 0,
                'visibility': 'hidden'
            }, 400, function () {
                $('.stage-lvl3 h3').html('');
                $('.stage-lvl3 ul.main-menu').html('');
                $('.menu-holder').removeClass('menu-lvl3');
                $('.stage-lvl2 > .main-menu > li').removeClass('active');
            });
        });


        $('body').on('click', '.stage-lvl2 > span.back-top', function () {
            $('.stage-lvl2').transition({
                'opacity': 0,
                'visibility': 'hidden',
                'left': 0
            }, 400, function () {
                $('.stage-lvl2 h3').html('');
                $('.stage-lvl2 ul.main-menu').html('');
                $('.menu-holder > .main-menu > li').removeClass('active');

            });
        });
        $('body').on('click', '.stage-lvl3 > span.back-top', function () {
            $('.stage-lvl3').transition({
                'opacity': 0,
                'visibility': 'hidden',
                'left': 0
            }, 400, function () {
                $('.stage-lvl3 h3').html('');
                $('.stage-lvl3 ul.main-menu').html('');
                $('.stage-lvl2 > .main-menu > li').removeClass('active');

            });
        });
    },

    initMedia: function () {
        $.HompageMedia.AddMediaItems(hpRender.setupStories, $('.stories-wrapper'));
    },

    setupStories: function () {
        //stories here
        if (!Modernizr.touch) {
            hpRender.applyParallaxFix();
        }
    }
};


var newsSliderDesktop,
    newsSliderMobile,
    newsSliderDesktopInit = false,
    newsSliderMobileInit = false;

var helpSlider = false,
    nextCarouselInit = false,
    $carouselNext;


var slRender = {
    init: function () {
        let that = this;
        that.initSecondLevelCss();
        that.sectionNav();

        hpRender.initMisc();
        hpRender.setupMenu();
        if ($('#video').length) hpRender.initVideo();
        //that.arrangeElements();
        //that.initPromoSlider();
        that.initWhereNextSliders();
        that.generateStaffForGrid();
        if ($('[data-play-id]').length) that.initModalVideo();
        //that.initButtons();
        if ($('.background-holder').length) that.initLandscapeSlider();

        //if($('.fixtures-holder').length) that.initFixtures();

        //that.specialMargin();
        if ($('.admission-holder').length) admissionsFunctionality.init();

        //setTimeout(slRender.initSecondLvlAnimations, 100);
    },

    initOnLoad: function () {
        //if($('.related-news-holder').length) {
        setTimeout(slRender.initMediaNews, 100);
        //}


    },

    initOnResize: function () {
        var that = this;
        // that.specialMargin();
        //that.arrangeElements();
        if ($('.background-holder').length) that.initLandscapeSlider();
        that.initWhereNextSliders();
        //if($('.related-news-holder').length) that.initNewsSliders();
        //if($('.related-events-holder').length) that.initEventsSliders();
        //if ($('.widget-upcoming-events').length) that.resizeWidgetEvents();
        //that.initWhereNextSliders();
        //if($('.related-news-holder').length) that.initRelatedNews();


        //hpRender.setMenuOnResize();
        //hpRender.initMenu();
    },

    specialMargin: function () {
        var that = this;
        if (getWindowWidth() > 767 && !$("body.media-template").length) {
            //console.log(getWindowWidth() - $('.content-wrapper > .content-holder').offset().left);

            var touchOffset = Modernizr.touch ? 0 : 30,
                marginOffset = parseInt(getWindowWidth() - $('.content-wrapper > .content-holder').offset().left - touchOffset);

            //console.log()
            //console.log(marginOffset);
            if ($('.related-news-holder').length) {
                $('.related-news-holder .stories-wrapper').css('width', marginOffset);
                that.initNewsSliders();
            }
            if ($('.related-events-holder').length) {
                $('.related-events-holder .events-wrapper').css('width', marginOffset);
                that.initEventsSliders();
            }
        } else {
            if ($('.related-news-holder').length) {
                $('.related-news-holder .stories-wrapper').css('width', getWindowWidth());
                that.initNewsSliders();

            }
            if ($('.related-events-holder').length) {
                $('.related-events-holder .events-wrapper').css('width', getWindowWidth());
                that.initEventsSliders();

            }
        }
    },

    initSecondLevelCss: function () {
        addListClasses();
        addTableClasses();
        specialHref();
        firstParagraph();
        triggerAccordion();
        styleContentImages();
        styleIframe();
        styleTables();
        //styleFeaturedImages();
    },

    initPromoSlider: function () {
        $('.promos-slider').bxSlider({
            mode: 'fade',
            controls: false,
            auto: true
        })
    },

    sectionNav: function () {
        if ($('.submenu-nav').length) {
            $('.submenu-nav > ul > li > ul').each(function () {
                $(this).parent().append('<span></span>').addClass('_has-sub');
            });
        }

        $('body').on('click', '.submenu-nav > ul > li', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var $target = $(this);
            //$(this).parents('li').find('>ul').slideDown();

            if ($target.hasClass('active')) {
                $target.toggleClass('active');
                $('.submenu-nav.lvl-3').html('');
            } else {
                $('.submenu-nav > ul > li.active').removeClass('active');
                $target.toggleClass('active');
                $('.submenu-nav.lvl-3').html($target.find('>ul').clone());
            }
        });


        if ($('.submenu-nav > ul > li > ul > li > a.active').length) {
            $('.submenu-nav > ul > li > ul > li > a.active').parent().parent().parent().find('span').trigger('click')
        }

        // Touch devices
        if (Modernizr.touch) {
            $('body').on('click', '.submenu-header', function () {
                $(this).parent().toggleClass('_show');
            });
        }
    },

    initLandscapeSlider: function () {
        //console.log(landscapeSlider)
        if (typeof landscapeSlider != "undefined") {
            resizeMainImg($('.background-holder .img-bg'), false);
        } else {
            landscapeSlider = $('.background-slider').bxSlider(landscapeSliderOptionsContent);
        }
    },

    initMediaNews: function () {
        if ($('.related-events-holder').length) {
            $('body').append('<div class="temp-events" />');
        }

        $.SecondLevel.AddMediaItems($('.stories-slider, .stories-grid'), slRender.setupStories, $('.temp-events'), slRender.setupEvents, $('.fixtures-holder .tabs-container'), slRender.initFixtures);
    },

    setupStories: function () {
        //stories here
//        console.log('got stories')

        $('.related-news-holder.carousel-news').show();
        $('.related-news-holder.grid-news').show();

        $('.related-news-holder.carousel-news .stories-slider').waitForImages(function () {
            slRender.initNewsSliders($('.related-news-holder'));
        });


    },

    initNewsSliders: function (el) {

        function calculateOffset() {
            let offset = getWindowWidth() > 767 ? getWindowWidth() > 992 ? getWindowWidth() > 1600 ? 4 : 3 : 2 : 1;

//            console.log(offset);
            return offset;
        }

        var $parentEl = $(el),
            offset = calculateOffset(),
            countEl = $parentEl.find('.story-item').length,
            $carousel = $parentEl.find('.stories-slider').flickity({
                cellAlign: getWindowWidth() > 767 ? 'left' : 'center',
                contain: true,
                wrapAround: false,
                pageDots: false,
                prevNextButtons: false,
                on: {
                    ready: function () {
                        $parentEl.find('.slider-nav .prev').addClass('disabled');
                        if ($parentEl.find('.story-item').length == 1) {
                            $parentEl.find('.slider-nav').hide();
                        }
                    },
                    change: function (index) {
                        switch (index) {
                            case 0:
                                $parentEl.find('.slider-nav .prev').addClass('disabled');
                                break;

                            case countEl - offset:
                                $parentEl.find('.slider-nav .next').addClass('disabled');
                                break;

                            default:
                                $parentEl.find('.slider-nav .nav').removeClass("disabled");
                                offset = calculateOffset();
                                break;
                        }
                    }
                }
            });


        $parentEl.find('.nav.prev').click(function () {
            $carousel.flickity('previous');
        });

        $parentEl.find('.nav.next').click(function () {
            $carousel.flickity('next');
        });
    },

    setupEvents: function () {
        //stories here
//        console.log('got events');
        if ($('.temp-events .story-item').length) {

            if ($('.related-events-holder').length) {
                $('.related-events-holder .events-items').html($('.temp-events .story-item').slice(0, 2).clone());
                $('.related-events-holder').show();
            }

            /*
            if ($('.widget-upcoming-events').length) {
                $('.widget-upcoming-events .events-holder').html($('.temp-events .story-item').slice(0, 3).clone());

                resizeMainImg($('.widget-upcoming-events .story-item .img-holder'), false);

                $('.widget-upcoming-events').show();

                if (!Modernizr.touch && Modernizr.csstransforms) {

                    $('.widget-upcoming-events .story-item').each(function (ind, el) {
                        setTimeout(function () {
                            if (!$(el).hasClass('animated')) {
                                $(el).waypoint(function () {
                                    $(el).transition({
                                        'opacity': 1,
                                        '-webkit-transform': 'translateY(0)',
                                        'transform': 'translateY(0)'
                                    }, 800, function () {
                                        $(el).addClass('animated');
                                    });
                                }, {
                                    offset: '80%'
                                });
                            }
                        }, ind * 400);
                    });
                }
            }

            if ($('.related-events-holder').length && $('.widget-upcoming-events').length == 0) {
                $('.related-events-holder').show();

                $('.related-events-holder .events-slider').html($('.temp-events').html());

                if ($('.related-events-holder .events-slider .story-item').length < 4) {
                    var counter = $('.related-events-holder .events-slider .story-item').length,
                        repeater = (4 - counter) * (counter + 1);
                    for (var i = 0; i < repeater; i++) {
                        $('.related-events-holder .events-slider').append($('.temp-events').html());
                    }
                }
                $('.related-events-holder .events-slider .story-item:first').addClass('first');


                //$('.related-events-holder .events-slider').append("<div class='story-item' />");


                $('.related-events-holder .events-slider').waitForImages(function () {
                    slRender.initEventsSliders();
                });
            }*/
        }
    },

    resizeWidgetEvents: function () {
        resizeMainImg($('.widget-upcoming-events .story-item .img-holder'), false);
    },

    initEventsSliders: function () {
        return;
        $(".events-slider").carouFredSel({
            width: "100%",
            height: "100%",
            circular: true,
            infinite: true,

            items: {
                visible: "+1"
            },
            scroll: {
                duration: 500,
                items: 1,
                easing: "swing",
                pauseOnHover: true,
                fx: "directscroll"
            },
            align: /*getWindowWidth() > 767 ? "left":*/"left",
            auto: {
                duration: 4000,
                play: false
            },
            prev: {
                button: ".related-events-holder .slider-nav .prev"
            },
            next: {
                button: ".related-events-holder .slider-nav .next"
            },
            swipe: {
                onTouch: true,
                onMouse: true
            },
            onCreate: function () {
                if (!Modernizr.touch && Modernizr.csstransforms) {
                    $('.related-events-holder .events-wrapper').each(function (ind, el) {
                        if (!$(el).hasClass('animated')) {
                            $(el).waypoint(function () {
                                $(el).transition({
                                    'opacity': 1,
                                    '-webkit-transform': 'translateX(0)',
                                    'transform': 'translateX(0)'
                                }, 800, function () {
                                    $(el).addClass('animated');
                                });
                            }, {
                                offset: '80%'
                            });
                        }
                    });
                }
                resizeMainImg($('.events-slider .story-item .img-holder'), false);
                $('.events-slider .story-item .txt-wrap h2').dotdotdot();
                if (!$('.events-wrapper').hasClass('complete')) $('.events-wrapper').addClass('complete');
            }
        });
    },

    initWhereNextSliders: function () {
        function calculateOffset() {
            let offset = getWindowWidth() > 992 ? 2 : 1;

            return offset;
        }

        var $parentEl = $('.where-next-holder'),
            offset = calculateOffset(),
            countEl = $parentEl.find('.widget-item').length,
            carouselOptions = {
                cellAlign: 'left',
                contain: true,
                wrapAround: false,
                pageDots: false,
                freeScroll: false,
                draggable: Modernizr.touch,
                prevNextButtons: false,
                on: {
                    ready: function () {
                        $parentEl.find('.slider-nav .prev').addClass('disabled');
                        if ($parentEl.find('.story-item').length == 1) {
                            $parentEl.find('.slider-nav').hide();
                        }

                        $parentEl.find('.nav.prev').click(function () {
                            $carouselNext.flickity('previous');
                        });

                        $parentEl.find('.nav.next').click(function () {
                            $carouselNext.flickity('next');
                        });

                        nextCarouselInit = true;
                    },
                    change: function (index) {
                        switch (index) {
                            case 0:
                                $parentEl.find('.slider-nav .prev').addClass('disabled');
                                break;

                            case countEl - offset:
                                $parentEl.find('.slider-nav .next').addClass('disabled');
                                break;

                            default:
                                $parentEl.find('.slider-nav .nav').removeClass("disabled");
                                offset = calculateOffset();
                                break;
                        }
                    }
                }
            };


        if (getWindowWidth() < 768) {
            if (nextCarouselInit) {
                $carouselNext.flickity('destroy');
                $parentEl.find('.nav.prev').off('click');
                $parentEl.find('.nav.next').off('click');
                nextCarouselInit = false;
            }

            return;
        }

        if ($('.where-next-holder').length) {
            if (!nextCarouselInit) {
                $carouselNext = $parentEl.find('.widget-slider').flickity(carouselOptions);
            }

        }
    },

    initButtons: function () {
        //mobile clicks
        $('.back-to-start').click(function (e) {
            $('html, body').animate({
                scrollTop: -100
            }, 1200);
        });


        $('.submenu-link').click(function () {
            $('html, body').animate({
                scrollTop: $('.submenu-holder').offset().top - 60
            }, 1200);
        });


    },

    arrangeElements: function () {
        return;
        //console.log('aaa');
        if ($('.sidebar-holder').length) {
            //      console.log(111);
            if (getWindowWidth() > 767) {
                $('.sidebar-holder').insertBefore('.wrap > .content-wrapper > .content-holder');
                $('.sidebar-holder').prepend($('.submenu-holder'));
            } else {
                $('.sidebar-holder').insertAfter('.wrap > .content-wrapper > .content-holder');
                $('.sidebar-holder').append($('.submenu-holder'));
            }
        }
    },

    initSecondLvlAnimations: function () {

        if (!Modernizr.touch && Modernizr.csstransforms) {

            /*$('.widget-related-links .related-link').each(function (ind, el) {
                setTimeout(function () {
                    if (!$(el).hasClass('animated')) {
                        $(el).waypoint(function () {
                            $(el).transition({
                                'opacity': 1,
                                '-webkit-transform': 'translateY(0)',
                                'transform': 'translateY(0)'
                            }, 800, function () {
                                $(el).addClass('animated');
                            });
                        }, {
                            offset: '80%'
                        });
                    }
                }, ind * 400);
            });*/



            $('blockquote').each(function (ind, el) {
                if (!$(el).hasClass('animated')) {
                    $(el).waypoint(function () {
                        $(el).addClass('animated');
                    }, {
                        offset: '80%'
                    });
                }
            });

            /*$('.table-wrapper').each(function (ind, el) {
                if (!$(el).hasClass('animated')) {
                    $(el).waypoint(function () {
                        $(el).addClass('animated');
                    }, {
                        offset: '80%'
                    });
                }
            });*/


        }
    },

    generateStaffForGrid: function () {
        if ($('#PageStaffJson').length > 0 && $('#PageStaffJson').val().length > 2 && $('.staff-holder .staff-grid').length > 0) {
            var allStaff = JSON.parse($('#PageStaffJson').val());

            for (var i = 0; i < allStaff.length; i++) {
                $('.staff-holder .staff-grid').append(sharedGenerateStaff(allStaff[i]))
            }
        }
    },

    initModalVideo: function () {
        var htmlModal = '<div class="modal-wrapper">' +
            '<div class="close-btn"></div>' +
            '<div class="modal-holder"></div>' +
            '</div>';


        $('body').on('click', '.modal-wrapper .close-btn', function () {
            $('.modal-wrapper').transition({
                'opacity': 0
            }, 800, function () {
                $('.modal-wrapper').find('.modal-holder').html('').end().hide();
            });
        });
        $('[data-play-id]').on('click', function (e) {
            e.preventDefault();

            var videoID = $(this).attr('data-play-id'),
                iframeSrc = 'https://www.youtube.com/embed/' + videoID + '?rel=0&amp;showinfo=0',
                iframe = document.createElement('iframe');
            iframe.src = encodeURI(iframeSrc);
            iframe.allow = "autoplay; encrypted-media";

            if (!$(".modal-wrapper").length) $('body').append(htmlModal);

            $('.modal-wrapper .modal-holder').html(iframe);

            $('.modal-wrapper').show().delay(100).transition({
                'opacity': 1
            }, 800);
        });
    },

    initFixtures: function () {

        let $fixturesEl = $('.fixtures-holder'),
            $fixActiveEl,
            $fixContentEl;

        //let's build header
        if ($('#Fixtures .fix-item').length) {
            $fixturesEl.find('.tabs-header ul').append('<li><a href="#Fixtures">Fixtures</a></li>');
        }
        if ($('#Results .fix-item').length) {
            $fixturesEl.find('.tabs-header ul').append('<li><a href="#Results">Results</a></li>');
        }

        $fixActiveEl = $fixturesEl.find('.tabs-header li:first');
        $fixContentEl = $($fixActiveEl.find('a').attr('href'));

        // first time init
        $fixturesEl.show();
        $fixActiveEl.addClass('active');
        $fixContentEl.show();

        $('body').on('click', '.fixtures-holder .tabs-header li a', function (e) {
            e.preventDefault();

            if (!$(this).parent().hasClass('active')) {
                $(this).parent().addClass('active').siblings().removeClass('active');
                $($(this).attr('href')).slideDown(200).siblings('.tab-content').slideUp(200);
            }
        });

    }
}