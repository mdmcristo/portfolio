$(document).ready(function () {
    
    // DYNAMIC ADAPTIVE
    (function () {
        "use strict";
        var originalPositions = [];
        var daElements = document.querySelectorAll('[data-da]');
        var daElementsArray = [];
        var daMatchMedia = [];
        //Заполняем массивы
        if (daElements.length > 0) {
            var number = 0;
            for (var index = 0; index < daElements.length; index++) {
                const daElement = daElements[index];
                const daMove = daElement.getAttribute('data-da');
                if (daMove != '') {
                    const daArray = daMove.split(',');
                    const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                    const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                    const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
                    const daDestination = document.querySelector('.' + daArray[0].trim())
                    if (daArray.length > 0 && daDestination) {
                        daElement.setAttribute('data-da-index', number);
                        //Заполняем массив первоначальных позиций
                        originalPositions[number] = {
                            "parent": daElement.parentNode,
                            "index": indexInParent(daElement)
                        };
                        //Заполняем массив элементов 
                        daElementsArray[number] = {
                            "element": daElement,
                            "destination": document.querySelector('.' + daArray[0].trim()),
                            "place": daPlace,
                            "breakpoint": daBreakpoint,
                            "type": daType
                        }
                        number++;
                    }
                }
            }
            dynamicAdaptSort(daElementsArray);

            //Создаем события в точке брейкпоинта
            for (var index = 0; index < daElementsArray.length; index++) {
                const el = daElementsArray[index];
                const daBreakpoint = el.breakpoint;
                const daType = el.type;

                daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
                daMatchMedia[index].addListener(dynamicAdapt);
            }
        }
        //Основная функция
        function dynamicAdapt(e) {
            for (var index = 0; index < daElementsArray.length; index++) {
                const el = daElementsArray[index];
                const daElement = el.element;
                const daDestination = el.destination;
                const daPlace = el.place;
                const daBreakpoint = el.breakpoint;
                const daClassname = "_dynamic_adapt_" + daBreakpoint;

                if (daMatchMedia[index].matches) {
                    //Перебрасываем элементы
                    if (!daElement.classList.contains(daClassname)) {
                        var actualIndex = indexOfElements(daDestination)[daPlace];
                        if (daPlace === 'first') {
                            actualIndex = indexOfElements(daDestination)[0];
                        } else if (daPlace === 'last') {
                            actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                        }
                        daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                        daElement.classList.add(daClassname);
                    }
                } else {
                    //Возвращаем на место
                    if (daElement.classList.contains(daClassname)) {
                        dynamicAdaptBack(daElement);
                        daElement.classList.remove(daClassname);
                    }
                }
            }
            //customAdapt();
        }

        //Вызов основной функции
        dynamicAdapt();

        //Функция возврата на место
        function dynamicAdaptBack(el) {
            const daIndex = el.getAttribute('data-da-index');
            const originalPlace = originalPositions[daIndex];
            const parentPlace = originalPlace['parent'];
            const indexPlace = originalPlace['index'];
            const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
            parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
        }
        //Функция получения индекса внутри родителя
        function indexInParent(el) {
            var children = Array.prototype.slice.call(el.parentNode.children);
            return children.indexOf(el);
        }
        //Функция получения массива индексов элементов внутри родителя 
        function indexOfElements(parent, back) {
            const children = parent.children;
            const childrenArray = [];
            for (var i = 0; i < children.length; i++) {
                const childrenElement = children[i];
                if (back) {
                    childrenArray.push(i);
                } else {
                    //Исключая перенесенный элемент
                    if (childrenElement.getAttribute('data-da') == null) {
                        childrenArray.push(i);
                    }
                }
            }
            return childrenArray;
        }
        //Сортировка объекта
        function dynamicAdaptSort(arr) {
            arr.sort(function (a, b) {
                if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
            });
            arr.sort(function (a, b) {
                if (a.place > b.place) { return 1 } else { return -1 }
            });
        }
        //Дополнительные сценарии адаптации
        function customAdapt() {
            //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        }
    }());

    // =======================================================================================================================

    // SPOLLERS
    $.each($('.spoller.active'), function (index, val) {
        $(this).next().show();
    });
    $('body').on('click', '.spoller', function (event) {
        if ($(this).hasClass('mob') && !isMobile.any()) {
            return false;
        }

        if ($(this).parents('.one').length > 0) {
            $(this).parents('.one').find('.spoller').not($(this)).removeClass('active').next().slideUp(300);
            $(this).parents('.one').find('.spoller').not($(this)).parent().removeClass('active');
        }

        if ($(this).hasClass('closeall') && !$(this).hasClass('active')) {
            $.each($(this).closest('.spollers').find('.spoller'), function (index, val) {
                $(this).removeClass('active');
                $(this).next().slideUp(300);
            });
        }
        $(this).toggleClass('active').next().slideToggle(300, function (index, val) {
            if ($(this).parent().find('.slick-slider').length > 0) {
                $(this).parent().find('.slick-slider').slick('setPosition');
            }
        });
        $(this).parent().toggleClass('active');
        $(this).find('.spoller-btn').toggleClass('active');
        return false;
    });

    // =======================================================================================================================

    // FORMS
    function forms() {
        //RATING
        $('.rating.edit .star').hover(function() {
            var block=$(this).parents('.rating');
            block.find('.rating__activeline').css({width:'0%'});
                var ind=$(this).index()+1;
                var linew=ind/block.find('.star').length*100;
            setrating(block,linew);
        },function() {
                var block=$(this).parents('.rating');
            block.find('.star').removeClass('active');
                var ind=block.find('input').val();
                var linew=ind/block.find('.star').length*100;
            setrating(block,linew);
        });
        $('.rating.edit .star').click(function(event) {
                var block=$(this).parents('.rating');
                var re=$(this).index()+1;
                block.find('input').val(re);
                var linew=re/block.find('.star').length*100;
            setrating(block,linew);
        });
        $.each($('.rating'), function(index, val) {
                var ind=$(this).find('input').val();
                var linew=ind/$(this).parent().find('.star').length*100;
            setrating($(this),linew);
        });
        function setrating(th,val) {
            th.find('.rating__activeline').css({width:val+'%'});
        }

        //CHECK
        $.each($('.check'), function(index, val) {
            if($(this).find('input').prop('checked')==true){
                $(this).addClass('active');
            }
        });
        $('body').off('click','.check',function(event){});
        $('body').on('click','.check',function(event){
            if(!$(this).hasClass('disable')){
                    var target = $(event.target);
                if (!target.is("a")){
                        $(this).toggleClass('active');
                    if($(this).hasClass('active')){
                        $(this).find('input').prop('checked', true);
                    }else{
                        $(this).find('input').prop('checked', false);
                    }
                }
            }
        });
    }
    forms();

    // =======================================================================================================================

    // BURGER
    var toggleMenu = function() {
        $(".menu-mobile__body").toggleClass('active');
    }

    if ($(".icon-menu")) {
        $(".icon-menu").on("click", function (e) {
            e.preventDefault();
            $(".menu-mobile").toggleClass("active");
            $("body").toggleClass("lock");
            toggleMenu();
        });
    }
    
    $(document).on('click', function(e) {
        const target = e.target;
        const its_menu = $(".menu-mobile__body").has(target).length === 0 && !$(".menu-mobile__body").is(target);
        const its_btnMenu = $(".icon-menu").is(target);
        const menu_is_active = $(".menu-mobile__body").hasClass('active');
        if (its_menu && !its_btnMenu && menu_is_active) {
            $(".menu-mobile").toggleClass("active");
            $("body").toggleClass("lock");
            toggleMenu();
        }
    });

    // =======================================================================================================================

    // FILTER MENU
    $(".filter-mobile__buttons-item").on("click", function (e) {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            if (!$(".filter-menu").hasClass('active')) {
                $(".filter-menu").addClass('active');
            }
            // $("body").addClass("lock");
        } else {
            $(this).removeClass('active');
            $(".filter-menu").removeClass('active');
        }
        if ($(this).hasClass('filter-mobile__buttons-item_style') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_style").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_metal') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_metal").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_price') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_price").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_shape') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_shape").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_color') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_color").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_clarity') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_clarity").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_cut') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_cut").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_carat') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_carat").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_price-diamond') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_price-diamond").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_woman') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_woman").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_man') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_man").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        } else if ($(this).hasClass('filter-mobile__buttons-item_wedding-price') && $(this).hasClass('active')) {
            if ($(".filter-menu").hasClass('active')) {
                $(".filter-menu").removeClass('active');
            }
            setTimeout(function() {
                $(".filter-menu__item_wedding-price").addClass('active').siblings().removeClass('active');
                $(".filter-menu").addClass('active');
            }, 200)
        }
    });

    $(document).on('click', function(e) {
        const target = e.target;
        const its_filter_menu = $(".filter-menu").has(target).length === 0 && !$(".filter-menu").is(target);
        const its_filter_menu_close = $(".filter-menu__head-close").is(target);
        const its_filter_menu_active = $(".filter-menu").hasClass('active');
        if ((its_filter_menu && its_filter_menu_active) || its_filter_menu_close) {
            $(".filter-mobile__buttons-item").removeClass("active");
            $(".filter-menu").removeClass("active");
            // $("body").removeClass("lock");
        }
    });
    
    // =======================================================================================================================

    // NICE SELECT
    $('select').niceSelect();

    // =======================================================================================================================

    // BUTTON LIKE
    $('.like').on('click', function(){
        $(this).toggleClass('active');
    });

    // =======================================================================================================================

    // CHAMGE GOOD IMAGES
    if ($(window).innerWidth() >= 580) {
        $(".item-catalog__thumbs-item").mouseenter(function(ev) {
            var el = ev.currentTarget;
            var el_index = $(this).index() + 1;
            // console.log(el_index);
            var elSlide  = $(this).parent().prev().find('.item-catalog__image');
            var elSlide_index;
            $.each($(elSlide),function(i){
                if ($(elSlide[i]).index()+1 == el_index) {
                    // console.log($(elSlide[i]))
                    $(elSlide[i]).addClass('active').siblings().removeClass('active');
                }
            });
        });
    }

    // =======================================================================================================================

    // TABS
    function tabs() {
        $("div.tab__content").hide();
        $("div.tab__container div.tab__content:first-child").show();
        $("ul.tab__nav li:first").addClass("active");
        
        $('ul.tab__nav > li').click(function () {
            if (!($(this).hasClass('active'))) {
                var thisLi = $(this);
                var numLi = thisLi.index();
                thisLi.addClass('active').siblings().removeClass('active');
                thisLi.parent().next().children('div').hide().eq(numLi).show();
            }
        });
    }
    tabs();


    $(window).on('load resize', function () {
        var windowWidth = $(this).innerWidth();
        if (windowWidth < 581) {
            $('.constructor__item_set').addClass('first');
        } else {
            $('.constructor__item_set').removeClass('first');
        }
    });
    // =======================================================================================================================

    // SLIDERS (SWIPER)
    var swiperHeaderstright = null;
    var mediaQuerySize = 1024;
    function strightSliderInit () {
        if (!swiperHeaderstright) {
            swiperHeaderstright = new Swiper('.header__stright', {
                slidesPerView: 1,
                speed: 500,
                loop: true,
                autoplay: {
                    delay: 2000,
                },
                disableOnInteraction: false,
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    320: {
                        slidesPerView: 1,
                    },
                    580: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                }
            });
        }
    }
    function strightSliderDestroy () {
        if (swiperHeaderstright) {
            swiperHeaderstright.destroy();
            swiperHeaderstright = null;
        }
    }
    $(window).on('load resize', function () {
        // Берём текущую ширину экрана
        var windowWidth = $(this).innerWidth();
        // Если ширина экрана меньше или равна mediaQuerySize(1024)
        if (windowWidth < mediaQuerySize) {
            // Инициализировать слайдер если он ещё не был инициализирован
            strightSliderInit();
            $('.nav-header__list-item-link').addClass('spoller');
        } else {
            // Уничтожить слайдер если он был инициализирован
            strightSliderDestroy();
            $('.nav-header__list-item-link').removeClass('spoller');
        }
    });


    var sliderPartner = document.querySelector('.stright-partners__slider');
    var swiperPartner = new Swiper(sliderPartner,{
        slidesPerView: 8,
        centeredSlides: true,
        speed: 500,
        loop: true,
        allowTouchMove: true,
        speed: 8000,
        autoplay: {
            delay: 0,
        },
        disableOnInteraction: false,
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            320: {
                slidesPerView: 2,
            },
            580: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 6,
            },
            1024: {
                slidesPerView: 8,
            }
        }
    });


    var sliderBestSellers = document.querySelectorAll('.bestsellers__slider');
    sliderBestSellers.forEach((el) => {
        var swiperBestSellers = new Swiper(sliderBestSellers,{
            slidesPerView: 5,
            centerSlides: true,
            loop: true,
            allowTouchMove: true,
            navigation: {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                320: {
                    slidesPerView: 1,
                },
                580: {
                    slidesPerView: 2,
                    centeredSlides: false,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 3,
                    centeredSlides: true,
                    spaceBetween: 25,
                },
                1280: {
                    slidesPerView: 5,
                    centeredSlides: true,
                    spaceBetween: 0,
                }
            }
        });
    });
    


    var sliderShop = document.querySelectorAll('.shop__slider-container');
    sliderShop.forEach((el) => {
        var swiperShop = new Swiper(el, {
            slidesPerView: 4,
            spaceBetween: 42,
            loop: true,
            allowTouchMove: true,
            navigation: {
                nextEl: el.parentNode.querySelector('.swiper-button-next'),
                prevEl: el.parentNode.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                320: {
                    slidesPerView: 1,
                },
                425: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4
                },
            }
        });
    });
    

    
    var sliderCardThumbs = document.querySelector('.card-slider__thumbs');
    var sliderCardGallery = document.querySelector('.card-slider__gallery');
    var swiperCardThumbs = new Swiper(sliderCardThumbs,{
        slidesPerView: 5,
        spaceBetween: 15,
        // freeMode: true,
        direction: 'vartical',
        watchOverflow: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: {
                direction: 'horizontal',
                spaceBetween: 10,
            },
            769: {
                direction: 'horizontal',
                spaceBetween: 10,
            },
            1025: {
                direction: 'verical',
                spaceBetween: 20,
            },
            1321: {
                slidesPerView: 7,
                spaceBetween: 15,
                direction: 'verical',
            },
        },
    });
    var swiperCardGallery = new Swiper(sliderCardGallery,{
        slidesPerView: 1,
        effect: 'fade',
        thumbs: {
            swiper: swiperCardThumbs,
        },
    });


    var sliderExplore = document.querySelectorAll('.explore__slider');
    sliderExplore.forEach((el) => {
        var swiperExplore = new Swiper(el, {
            slidesPerView: 5,
            spaceBetween: 42,
            loop: true,
            allowTouchMove: true,
            navigation: {
                nextEl: el.parentNode.querySelector('.swiper-button-next'),
                prevEl: el.parentNode.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                320: {
                    slidesPerView: 1,
                },
                425: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 5,
                },
            },
        });
    });

    var sliderGender = document.querySelectorAll('.gender-slider__box');
    sliderGender.forEach((el) => {
        var swiperGender = new Swiper(el, {
            slidesPerView: 3,
            spaceBetween: 32,
            loop: true,
            allowTouchMove: true,
            navigation: {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1319: {
                    slidesPerView: 3,
                },
            },
        });
    });
    


    // ================================================================================================

    // PULSE BUTTON
    var buttons = document.getElementsByClassName('btn-pulse'),
    forEach = Array.prototype.forEach;

    forEach.call(buttons, function (b) {
        b.addEventListener('click', addElement);
    });

    function addElement(e) {
        var addDiv  = document.createElement('div'),
            mValue  = Math.max(this.clientWidth, this.clientHeight),
            rect    = this.getBoundingClientRect();
            sDiv    = addDiv.style,
            px      = 'px';

        sDiv.width  = sDiv.height = mValue + px;
        sDiv.left  = e.clientX - rect.left - (mValue / 2) + px;
        sDiv.top   = e.clientY - rect.top - (mValue / 2) + px;

        addDiv.classList.add('pulse');
        this.appendChild(addDiv);
    }

    // ================================================================================================

    // LAZY LOAD
    var lazyImages = [].slice.call(document.querySelectorAll('img.load-image'));
    var lazyBackgrounds = [].slice.call(document.querySelectorAll('.lazy-background'));
    var lazyBackgroundsData = [].slice.call(document.querySelectorAll('[data-bg]'));

    if ('IntersectionObserver' in window) {
        var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                //lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImage.classList.remove('lazy');
                lazyImageObserver.unobserve(lazyImage);
            }
            });
        });
        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
        var lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyBackgroundObserver.unobserve(entry.target);
            }
            });
        });
        lazyBackgrounds.forEach(function (lazyBackground) {
            lazyBackgroundObserver.observe(lazyBackground);
        });
        var lazyBackgroundDataObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var lazyBackgroundData = entry.target;
                lazyBackgroundData.style.backgroundImage = 'url(' + lazyBackgroundData.dataset.bg + ')';
                lazyBackgroundDataObserver.unobserve(lazyBackgroundData);
            }
            });
        });
        lazyBackgroundsData.forEach(function (lazyBackgroundData) {
            lazyBackgroundDataObserver.observe(lazyBackgroundData);
        });
    } else {
        // Fallback
        lazyImages.forEach(function (lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            //lazyImage.srcset = lazyImage.dataset.srcset;
        });
        lazyBackgrounds.forEach(function (lazyBackground) {
            lazyBackground.classList.add('visible');
        });
        lazyBackgroundsData.forEach(function (lazyBackgroundData) {
            lazyBackgroundData.style.backgroundImage = 'url(' + lazyBackgroundData.dataset.bg + ')';
        });
    }

    // ================================================================================================

    // POPUP
    $('.pl').click(function (event) {
        var pl = $(this).attr('href').replace('#', '');
        var v = $(this).data('ms');
        popupOpen(pl, v);
        return false;
    });
    function popupOpen(pl, v) {
        $('.popup').removeClass('active').hide();
        if (!$('.menu__body').hasClass('active')) {
            //$('body').data('scroll',$(window).scrollTop());
        }
        // setTimeout(function () {
        //     $('body').addClass('lock');
        // }, 300);
        history.pushState('', '', '#' + pl);
        if (v != '' && v != null) {
            $('.popup-' + pl + ' .popup-video__value').html('<iframe src="https://www.youtube.com/embed/' + v + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>');
        }
        $('.popup-' + pl).fadeIn(0).delay(0).addClass('active');

        if ($('.popup-' + pl).find('.slick-slider').length > 0) {
            $('.popup-' + pl).find('.slick-slider').slick('setPosition');
        }
    }
    function openPopupById(popup_id) {
        $('#' + popup_id).fadeIn(0).delay(0).addClass('active');
    }
    function popupClose() {
        $('.popup').removeClass('active').fadeOut(0);
        if (!$('.menu__body').hasClass('active')) {
            $('body').removeClass('lock');
        }
        $('.popup-video__value').html('');

        history.pushState('', '', window.location.href.split('#')[0]);
    }
    $('.popup-close').click(function (event) {
        popupClose();
        return false;
    });
    $('.popup').click(function (e) {
        if (!$(e.target).is(".popup>.popup-table>.cell *") || $(e.target).is(".popup-close") || $(e.target).is(".popup__close")) {
            popupClose();
            return false;
        }
    });
    $(document).on('keydown', function (e) {
        if (e.which == 27) {
            popupClose();
        }
    });

})