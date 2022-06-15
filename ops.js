var Webflow = Webflow || [];
Webflow.push(function () {
    $(document).ready(function () {
        //
        // 1. STARTUP: Slide in menu
        //

        //
        //Hide all menu on load
        //
        $('.menu-top').hide();
        $('.menu-bottom').hide();
        $('.expansion-2').hide();
        $('.expansion-3').hide();
        $('#menuLinkCopyAlert').hide();
        $('.alert-popup').hide();
        $('#reader-tipping-menu').hide();

        //Ensure that refresh will reset the chapter to the 1st image
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }

        // Show menu on load
        $('.menu-top').delay(500).slideDown(200);
        $('.menu-bottom').delay(500).slideDown(200);

        function hideMenu() {
            $('.menu-top').slideUp(200);
            $('.menu-bottom').slideUp(200);
            if ($('.expansion-2').is(":visible")) {
                $('.expansion-2').hide();
            }
            if ($('.expansion-3').is(":visible")) {
                $('.expansion-3').hide();
            }
        }

        function showMenu() {
            $('.menu-top').slideDown(200);
            $('.menu-bottom').slideDown(200);
        }

        function hideShowMenu() {
            if ($('.menu-top').is(":visible")) {
                hideMenu();
            } else {
                showMenu();
            }
        }

        // Hide menu on swipe
        $('.manga-slider').on('swipe', function () {
            if ($('.menu-top').is(":visible")) {
                hideMenu();
            }
        });

        // Hide menu on scroll
        var lastScrollTop = 0,
            delta = 5;
        $(window).scroll(function (event) {
            var st = $(this).scrollTop();

            if (Math.abs(lastScrollTop - st) <= delta)
                return;

            if (st > lastScrollTop) {
                // downscroll code
                if ($('.menu-top').is(":visible")) {
                    hideMenu();
                }
            } else {
                // upscroll code
                if ($('.menu-top').not(":visible")) {
                    showMenu();
                }
            }
            lastScrollTop = st;
        });

        //
        // END OF 1. Slide in menu
        //


        //
        // 2. Populate previous/next chapter button, title & chapter no.
        //
        var next_chapter_href = $('#post_list .w--current').parent().next().find('a').attr('href');
        var previous_chapter_href = $('#post_list .w--current').parent().prev().find('a').attr('href');
        var current_chapter_href = $('#post_list .w--current').attr('href');
        var current_chapter_text = $('#post_list .w--current').find('.chapter-title').text();
        var current_title_href = $('#mangaTitleExtract').parent().attr('href');
        var current_title_text = $('#mangaTitleExtract').text();
        var current_chapter_count = $('#post_list .w-dyn-item').length;
        var next_chapter_state = true;
        var previous_chapter_state = true;

        //if last post in list
        if (next_chapter_href == undefined) {
            next_chapter_href = $('#post_list').children().children().first().find('a').attr('href');
            $('#next_button').removeAttr("href"); //optional - remove if you want to loop to beginning
            $('#next_button').addClass('isDisabled');
            next_chapter_state = false;
        }

        //if first post in list
        if (previous_chapter_href == undefined) {
            previous_chapter_href = $('#post_list').children().children().last().find('a').attr('href');
            $('#previous_button').removeAttr("href"); //optional - remove if you want to loop to end
            $('#previous_button').addClass('isDisabled');
            previous_chapter_state = false;
        }

        //apply hrefs to next / previous buttons
        $('#next_button').attr('href', next_chapter_href);
        $('#previous_button').attr('href', previous_chapter_href);
        $('#menuTopMangaTitle').text(current_title_text);
        $('#menuTopMangaChapterNo').text(current_chapter_text);
        $('#menuTopTitleButton').attr('href', current_title_href);
        $('#menuBottomChaptersCount').text('(' + current_chapter_count + ')');
        $('#menuTopShareLink').on('click', function () {
            navigator.clipboard.writeText(current_chapter_href);
            $('#alertShareCopySuccess').show().delay(1000).fadeOut(800);
        });

        //
        // END OF 2. Populate previous/next chapter button
        //

        //
        // 3. Set browsing type
        //
        function resetButton(theButton) {
            if ($(theButton).hasClass('selected')) {
                $(theButton).removeClass('selected');
            }
        }

        function resetButtons() {
            resetButton('#leftToRightButton');
            resetButton('#rightToLeftButton');
            resetButton('#verticalScrollButton');
        }

        // Accepts {"LTR", "RTL", "VER"}
        function setViewButton(viewType) {
            if (viewType == "LTR") {
                resetButtons();
                $('#leftToRightButton').addClass('selected');
                return;
            }

            if (viewType == "RTL") {
                resetButtons();
                $('#rightToLeftButton').addClass('selected');
                return;
            }

            if (viewType == "VER") {
                resetButtons();
                $('#verticalScrollButton').addClass('selected');
                return;
            }

        }

        // Build owl div
        $('.manga-slider .w-dyn-item').each(function () {
            var tempImgSrc = $(this).find('img').attr('src');
            $('#visibleManga').append('<div class="item"><img src="' + tempImgSrc + '" loading="lazy" /></div>');
        });
        //Buttons & comment
        $('#visibleManga').append('<div id="actions-div" class="item manga-actions"></div>');
        $('#mangaActions').children().clone().appendTo('#actions-div');

        // Hide menu on click or touch
        $('#visibleManga .item').on('click', function () {
            if($(this).hasClass('manga-actions')){
                if ($('.menu-top').is(":visible")) {
                    hideMenu();
                }
            }else{
                hideShowMenu();
            }
        });

        //Show tipping menu
        $('#menuBottomActionTip').on('click',function(){
            if ($('.menu-top').is(":visible")) {
                hideMenu();
            }
            $('#reader-tipping-menu').slideDown(200);
        });

        $('#tippingCloseButton').on('click',function(){
            $('#reader-tipping-menu').slideUp(200);
        });

        //if last post in list
        if (next_chapter_state == false) {
            $('#actions-div .next-chapter-button').removeAttr("href"); //optional - remove if you want to loop to beginning
            $('#actions-div .next-chapter-button').addClass('isDisabledButton');
        } else {
            $('#actions-div .next-chapter-button').attr('href', next_chapter_href);
        }

        //Set facebook comments plugin
        $('#actions-div .action-comments').addClass('fb-comments').attr('data-href', window.location.href).attr('data-width', $('#visibleManga').width()).attr('numposts', '3');

        //Delete all used fields #mangaActions, #ImgCollection1, #ImgCollection2, #ImgCollection3 & #ImgCollection4
        $('#mangaActions').remove();
        $('#ImgCollection1').remove();
        $('#ImgCollection2').remove();
        $('#ImgCollection3').remove();
        $('#ImgCollection4').remove();

        //Add share action
        $('#menuBottomActionShare').on('click', function () {
            navigator.clipboard.writeText(current_chapter_href);
            $('#alertShareCopySuccess').show().delay(1000).fadeOut(800);
        })

        // Specify owl selector div
        var owlSelector = $("#visibleManga");
        var owlParams = {
            "LTR": {
                items: 1,
                rtl: false,
                lazyLoad: true,
                loop: false
            },
            "RTL": {
                items: 1,
                rtl: true,
                lazyLoad: true,
                loop: false
            }
        }
        var defaultView = "VER";

        //Initialize carousel
        var owl = initCarousel(defaultView);

        // Accepts values {"RTL", "LTR", "VER"}
        function initCarousel(viewType) {

            if (viewType == "LTR") {
                setViewButton("LTR");
                owlSelector = owlSelector.addClass('owl-carousel');
                owl = owlSelector.owlCarousel(owlParams.LTR);
                return;
            }

            if (viewType == "RTL") {
                setViewButton("RTL");
                owlSelector = owlSelector.addClass('owl-carousel');
                owl = owlSelector.owlCarousel(owlParams.RTL);
                return;
            }

            if (viewType == "VER") {
                setViewButton("VER");
                return;
            }

        }
        // Accepts values {"RTL", "LTR", "VER"}
        function refreshCarousel(viewType) {

            if (viewType == "LTR") {
                console.log('LTR selected');
                if ($('.manga-slider-pages').hasClass('owl-carousel')) {
                    owlSelector.trigger('destroy.owl.carousel');
                    owl = owlSelector.owlCarousel(owlParams.LTR);
                    return;
                } else {
                    $('.manga-slider-pages').addClass('owl-carousel');
                    owl = $('.owl-carousel').owlCarousel(owlParams.LTR);
                    return;
                }
            }

            if (viewType == "RTL") {
                console.log('RTL selected');
                if ($('.manga-slider-pages').hasClass('owl-carousel')) {
                    owlSelector.trigger('destroy.owl.carousel');
                    owl = owlSelector.owlCarousel(owlParams.RTL);
                    return;
                } else {
                    $('.manga-slider-pages').addClass('owl-carousel');
                    owl = $('.owl-carousel').owlCarousel(owlParams.RTL);
                    return;
                }
            }

            if (viewType == "VER") {
                if ($('.manga-slider-pages').hasClass('owl-carousel')) {
                    owlSelector.trigger('destroy.owl.carousel');
                    $('.manga-slider-pages').removeClass('owl-carousel');
                    return;
                } else {
                    return;
                }
            }
        }

        // Add button click function
        $('#verticalScrollButton').click(function () {
            setViewButton("VER");
            refreshCarousel("VER");
        });
        $('#leftToRightButton').click(function () {
            setViewButton("LTR");
            refreshCarousel("LTR");
        });
        $('#rightToLeftButton').click(function () {
            setViewButton("RTL");
            refreshCarousel("RTL");
        });

        //
        // END OF 3. Set browsing type
        //

        //
        // 4. Show expansion 2 & 3
        //
        $('#menuBottomSettingsButton').click(function () {

            if ($('.expansion-3').is(":visible")) {
                $('.expansion-3').slideUp(200);
            }

            if ($('.expansion-2').is(":visible")) {
                $('.expansion-2').slideUp(200);
            } else {
                $('.expansion-2').slideDown(200);
            }

        });

        $('#menuBottomChaptersButton').click(function () {

            if ($('.expansion-2').is(":visible")) {
                $('.expansion-2').slideUp(200);
            }

            if ($('.expansion-3').is(":visible")) {
                $('.expansion-3').slideUp(200);
            } else {
                $('.expansion-3').slideDown(200);
            }

        });

        //
        // END OF 4. Show expansion 2 & 3
        //
    });
});