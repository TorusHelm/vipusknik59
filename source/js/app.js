'use strict';

document.addEventListener('DOMContentLoaded', function () {
    let tabHandler = new Event('tabHandler');
    let albumSliders = initAlbumsSwiper();
    let mainTypesSlider = initMainTypesSwiper();
    let modalSwiper = initModalSwiper();
    let onlyMobileSliders;
    svg4everybody();
    initMainBannerSwiper();
    initHeaderToggler();
    accordion();
    tab(tabHandler);
    initDragNDrop();
    initModal();
    validateFrom();
    inputNumber();
    scrollToBlock();
    cardHeaderHandle(modalSwiper, 'https://fotopro-perm.ru/api/album/images_slider?id=');
    videPlay();

    if (window.innerWidth < 768) {
        onlyMobileSliders = initOnlyMobileSlider();
    }

    document.addEventListener('tabHandler', function () {
        albumSliders && albumSliders.forEach(swiper => {
            swiper.update();
        });

        mainTypesSlider && mainTypesSlider.forEach(swiper => {
            swiper.update();
        });

        if (window.innerWidth < 768) {
            onlyMobileSliders && onlyMobileSliders.forEach(swiper => {
                swiper.update();
            });
        }

    }, false);
});

function videPlay() {
    let modalVideo = document.querySelector(".js-modal-video-container");

    if (!modalVideo) return;

    let play = modalVideo.querySelector(".js-modal-video-play");
    let video = modalVideo.querySelector(".js-modal-video");

    video.addEventListener("click", function() {
        if (video.paused) {
            play.classList.add("d-none");
        } else {
            play.classList.remove("d-none");
        }
    });
}

function initModalSwiper() {
    var mySwiper = new Swiper('.js-main-swiper-modal', {
        speed: 400,
        slidesPerView: 1,
        loop: true,
        spaceBetween: 12,
        preloadImages: false,
        lazy: true,
        autoHeight: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.js-modal-swiper-next',
            prevEl: '.js-modal-swiper-prev',
        },
    });

    return mySwiper;
}

function cardHeaderHandle(modalSwiper, url) {
    let targets = document.querySelectorAll('.js-modal-init.js-modal-slider');

    if (targets.length) {
        targets.forEach(target => {
            let targetId = target.dataset.id;
            target.addEventListener('click', function () {
                getSlidersData(modalSwiper, `${url + targetId}`);
            });
        });
    }
}

function getSlidersData(modalSwiper, url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();

    if (!modalSwiper) {
        return;
    }

    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            let data = JSON.parse(xhr.response);
            modalSwiper.removeAllSlides();

            data.forEach(item => {
                let slideContent = createSlide(item);
                modalSwiper.appendSlide(slideContent);
            });

            setTimeout(() => {
                modalSwiper.slideTo(0);
                modalSwiper.update();
            }, 100);
        }
    };

    xhr.onerror = function () {
        console.log("Запрос не удался");
    };
}

function createSlide(str, caption) {
    let img = document.createElement('img');
    let slide = document.createElement('figure');
    let figcaption = document.createElement('figcaption');
    figcaption.textContent = caption || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium adipisci atque debitis obcaecati quaerat? Accusamus atque enim, expedita ipsum, molestiae nostrum, officia qui quia ratione reiciendis reprehenderit sint vel veritatis.';
    slide.classList.add('swiper-slide', 'main-slider__slide');
    let imgUri = 'https://fotopro-perm.ru/' + str;
    img.src = imgUri;
    slide.appendChild(img);
    slide.appendChild(figcaption);

    return slide;
}

function scrollToBlock() {
    let inits = document.querySelectorAll('.js-scrollToBlock-init');

    if (inits.length) {
        inits.forEach(function (init) {
            let target = document.querySelector(init.dataset.target);

            init.addEventListener('click', function () {
                target.scrollIntoView({block: "center", behavior: "smooth"});
            });
        });
    }
}

function initOnlyMobileSlider() {
    let swiperContainers = document.querySelectorAll(".js-only-mobile-slider");

    if (!swiperContainers.length) return;

    let arrayOfSwipers = [];

    swiperContainers.forEach((swiperContainer) => {
        let mySwiper = new Swiper(swiperContainer, {
            speed: 400,
            slidesPerView: 1,
            loop: true,
            spaceBetween: 12,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
            }
        });

        arrayOfSwipers.push(mySwiper);
    })

    return arrayOfSwipers;
}

function inputNumber() {
    let targets = document.querySelectorAll(".js-input-number-wrapper");

    if (!targets.length) return;

    targets.forEach(function (target) {
        let input = target.querySelector(".js-input-number");
        let down = target.querySelector(".js-input-number-down");
        let up = target.querySelector(".js-input-number-up");

        down.addEventListener("click", function () {
            if (input.value <= 0) return;
            input.stepDown();
        });

        up.addEventListener("click", function () {
            input.stepUp();
        });
    });
}

function createElement(tag, className) {
    let elem = document.createElement(tag);
    elem.classList = className;

    return elem;
}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function validateFrom() {
    let forms = document.querySelectorAll('.js-form-validate');

    if (forms.length) {
        for (const form of forms) {
            let fields = form.querySelectorAll('.js-form-validate-input input');
            let file = form.querySelector('.js-calculate-file-input');
            let validForm = false;

            for (const field of fields) {
                field.addEventListener('change', function () {
                    if (!validateField(field)) {
                        field.classList.add('has-error');
                        validForm = false;
                    } else {
                        field.classList.remove('has-error');
                        validForm = true;
                    }
                });
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                for (const field of fields) {
                    if (!validateField(field)) {
                        field.classList.add('has-error');
                        validForm = false;
                    } else {
                        field.classList.remove('has-error');
                        validForm = true;
                    }
                }

                if (validForm) {
                    let formData = new FormData(form);

                    if (file) {
                        formData.append('file', file.files[0]);
                    }

                    if (form.classList.contains('js-form-calc')) {
                        formData.append('data', window.calcData);
                    }

                    let success = function () {
                        form.classList.add('success');
                        resetForm(form, formData);
                    };

                    sendData(formData, '/send_message', success);
                } else {
                    console.log('unvalid form');
                    return;
                }
            })
        }
    }
}

function resetForm(form, formdata) {
    let btns = form.querySelectorAll('.js-form-calc-reset');
    let fileRemover = form.querySelector('.js-calculate-file-remover');

    if (btns.length) {
        for (const btn of btns) {
            btn.addEventListener('click', function () {
                for (var pair of formdata.entries()) {
                    formdata.delete(pair[0]);
                }

                form.reset();
                form.classList.remove('success');

                if (fileRemover) {
                    fileRemover.click();
                }
            });
        }
    }
}

function validateField(input) {
    let value = input.value;
    let type = input.type;
    let result = false;

    if (type == 'tel') {
        result = validatePhone(value);
    } else if (type == 'email') {
        result = validateMail(value);
    } else {
        result = !isEmpty(value);
    }

    return result;
}

function isEmpty(str) {
    return str == '' && true;
}

function validatePhone(str) {
    let reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return testReg(reg, removeSpaces(str));
}

function validateMail(str) {
    let result = false;
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    result = testReg(reg, str)
    return result;
}

function removeSpaces(str) {
    return str.replace(/\s/g, '');
    ;
}

function testReg(re, str) {
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

function sendData(data, url, success) {
    if (!data || !url) {
        return console.log('error, have no data or url');
    }

    let xhr = new XMLHttpRequest();

    xhr.onloadend = function () {
        if (xhr.status == 200) {
            let successFu = success;

            successFu();
            console.log("Успех");
        } else {
            console.log("Ошибка " + this.status);
        }
    };

    xhr.open("POST", url);
    xhr.send(data);
}

function initModal() {
    let inits = document.querySelectorAll('.js-modal-init');
    let body = document.body;

    if (inits.length) {
        for (const init of inits) {
            let target = document.querySelector(init.dataset.target);
            let closes = target.querySelectorAll('.js-modal-close');
            let video = target.querySelector(".js-modal-video");
            let play = target.querySelector(".js-modal-video-play");
            let initVideo = init.querySelector("video");

            if (target) {
                if (closes.length) {
                    for (const close of closes) {
                        close.addEventListener('click', function () {
                            target.classList.remove('is-active');
                            body.classList.remove('modal-is-active');

                            video && video.pause();
                            play && play.classList.remove("d-none");
                            init.classList.contains("js-modal-init-video") && initVideo.play();
                        });
                    }
                }

                init.addEventListener('click', function () {
                    target.classList.add('is-active');
                    body.classList.add('modal-is-active');

                    init.classList.contains("js-modal-init-video") && initVideo.pause();
                });
            }
        }
    }
}

function initDragNDrop() {
    let container = document.querySelector('.js-calculate-file');
    let dropArea = document.querySelector('.js-calculate-file-droparea');
    let fileElem = document.querySelector('.js-calculate-file-input');
    let addings = document.querySelector('.js-calculate-file-addings');
    let fileName = document.querySelector('.js-calculate-file-name');
    let remover = document.querySelector('.js-calculate-file-remover');

    if (!container && !dropArea && !fileElem && !addings && !fileName && !remover) {
        return;
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    };

    function highlight() {
        container.classList.add('highlight');
    };

    function unhighlight() {
        container.classList.remove('highlight');
    };

    function handleFiles(files) {
        addings.classList.add('is-show');
        container.classList.add('has-result');
        fileName.textContent = files[0].name;
    };

    function handleRemoveFiles() {
        addings.classList.remove('is-show');
        container.classList.remove('has-result');
        fileName.textContent = '';
        fileElem.value = '';
    };

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        if (Validate(this)) {
            handleFiles(files);
        }
    };

    fileElem.addEventListener('change', function () {
        if (Validate(this)) {
            handleFiles(this.files);
        }
    });

    remover.addEventListener('click', function () {
        handleRemoveFiles();
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    var _validFileExtensions = ['.zip', '.rar'];

    function Validate(input) {
        var sFileName = input.value;

        if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }

            if (!blnValid) {
                container.classList.add('has-error');

                setTimeout(function () {
                    container.classList.remove('has-error');
                }, 2000)

                return false;
            }
        }

        return true;
    }
}

function initHeaderToggler() {
    let toggler = document.querySelector('.js-header-toggler');
    let header = document.querySelector('.js-header');
    let pageWrap = document.querySelector('.js-page-wrap');
    let darkness = document.querySelector('.js-header-darkness');

    if (toggler && header && pageWrap && darkness) {
        toggler.addEventListener('click', function () {
            header.classList.toggle('is-open');
            toggler.classList.toggle('is-active');
            pageWrap.classList.toggle('scroll-blocked-mobile');
        });

        darkness.addEventListener('click', function () {
            header.classList.remove('is-open');
            toggler.classList.remove('is-active');
            pageWrap.classList.remove('scroll-blocked-mobile');
        });
    }
}

function initMainTypesSwiper() {
    let swiperContainers = document.querySelectorAll(".js-main-types-swiper-container");

    if (!swiperContainers.length) return;

    let swiperArray = [];

    swiperContainers.forEach((swiperContainer) => {
        let parent = swiperContainer.closest(".main-slider__wrapper");
        let navigation = parent.querySelectorAll(".js-swiper-main-prev, .js-swiper-main-next");
        let pagination = parent.querySelector(".swiper-pagination");

        let mySwiper = new Swiper(swiperContainer, {
            speed: 400,
            slidesPerView: 1,
            loop: true,
            spaceBetween: 12,
            autoHeight: true,
            pagination: {
                el: pagination,
                type: 'bullets',
                clickable: true
            },
            navigation: {
                prevEl: navigation[0],
                nextEl: navigation[1]
            },
        });

        swiperArray.push(mySwiper);
    });

    return swiperArray;
}

function initMainBannerSwiper() {
    let mySwiper = new Swiper('.js-main-banner-swiper-container', {
        speed: 400,
        slidesPerView: 1,
        loop: true,
        spaceBetween: 12,
        autoHeight: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.js-swiper-main-next',
            prevEl: '.js-swiper-main-prev',
        },
    });

    return mySwiper;
}

function initAlbumsSwiper() {
    let swipers = document.querySelectorAll(".js-swiper-albums");

    if (!swipers.length) return;

    let albumSwipers = [];

    swipers.forEach(function (swiper) {
        let mySwiper = new Swiper(swiper, {
            speed: 400,
            loop: true,
            slidesPerView: 5,
            spaceBetween: 12,
            autoHeight: true,
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                480: {
                    slidesPerView: 1
                },
                767: {
                    slidesPerView: 2
                },
                1023: {
                    slidesPerView: 3
                },
                1199: {
                    slidesPerView: 4
                }
            }
        });

        albumSwipers.push(mySwiper);
    });


    return albumSwipers;
}

function tab(tabHandler) {
    let tabsContainers = document.querySelectorAll(".js-tab-container");

    if (!tabsContainers.length) return;


    tabsContainers.forEach((tabsContainer) => {
        let menuItems = tabsContainer.querySelectorAll(".js-tab-menu-item");
        let subitems = tabsContainer.querySelectorAll(".js-tab-menu-subitem");

        menuItems.forEach((menuItem) => {
            menuItem.onclick = () => {
                let activeMenuItem = Array.from(menuItems).find(getActiveTab);
                let activeContentItem = tabsContainer.querySelector(activeMenuItem.dataset.target);
                let currentContentItem = tabsContainer.querySelector(menuItem.dataset.target);

                activeMenuItem.classList.remove("is-active");

                if (activeContentItem) {
                    activeContentItem.classList.remove("is-active");
                }

                if (currentContentItem) {
                    currentContentItem.classList.add("is-active");
                }

                menuItem.classList.add("is-active");

                if (tabHandler) {
                    document.dispatchEvent(tabHandler);
                }
            };
        });

        subitems.forEach((subitem) => {
            let mainTarget = document.querySelector(`.js-tab-menu-item[data-target="${subitem.dataset.target}"]`);
            subitem.addEventListener("click", function () {
                mainTarget.click();
            });
        });
    });

    function getActiveTab(element) {
        return element.classList.contains("is-active");
    }
}

function accordion() {
    let wrapper = document.querySelectorAll('.js-accordion');
    wrapper.forEach(wrapperItem => {
        let items = wrapperItem.querySelectorAll('.js-accordion-item');
        let individual = wrapperItem.getAttribute('individual') && wrapperItem.getAttribute('individual') !== 'false';

        items.forEach(item => {
            if (item.classList.contains('is-active')) {
                setTimeout(() => {
                    let readyContent = item.querySelector('.js-accordion-content');
                    let readyContentHeight = readyContent.scrollHeight;

                    readyContent.style.maxHeight = readyContentHeight + 'px';
                }, 100);
            }

            let subItems = item.querySelectorAll('.js-accordion-subitem');

            for (const subItem of subItems) {
                if (subItem.classList.contains('is-active')) {
                    setTimeout(() => {
                        let readyContent = subItem.querySelector('.js-accordion-content');
                        let readyContentHeight = readyContent.scrollHeight;

                        readyContent.style.maxHeight = readyContentHeight + 'px';
                    }, 100);
                }
            }

            itemIteration(item, items, individual);

            subItems.forEach(subitem => {
                itemIteration(subitem, subItems, individual, true)
            });
        })
    })
}

function itemIteration(item, items, individual, isSubitem) {
    let init = item.querySelector('.js-accordion-init');
    let content = item.querySelector('.js-accordion-content');

    if (isSubitem === true) {
        content.addEventListener('transitionend', function () {
            let parentItem = item.closest('.js-accordion-item');
            let parentContentHeight = parentItem.scrollHeight + 'px';
            let parentContent = parentItem.querySelector('.js-accordion-content');

            parentContent.setAttribute('style', `max-height: ${parentContentHeight}`);
        });
    }

    init.addEventListener('click', function () {
        if (item.classList.contains('is-active')) {
            item.classList.remove('is-active');
            content.style.maxHeight = '0px';

            return false
        }

        if (isSubitem === true) {
            let parentItem = item.closest('.js-accordion-item');
            let parentContent = parentItem.querySelector('.js-accordion-content');

            parentContent.setAttribute('style', `max-height: none`);
        }

        if (individual) {
            items.forEach((elem) => {
                let elemContent = elem.querySelector('.js-accordion-content');
                elem.classList.remove('is-active');
                elemContent.style.maxHeight = 0 + 'px';
            })
        }

        item.classList.add('is-active');
        content.style.maxHeight = content.scrollHeight + 'px';
    });
}

(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {
            return null
        } else return this.parentElement.closest(selector)
    };
}(Element.prototype));
