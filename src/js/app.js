

function initScrollspy() {
    console.log(window.isMobile)
    if(window.isMobile) {
        UIkit.scrollspy($('.services__card'),  {
            cls: 'services__card_active',
            repeat: true,
            hidden: false,
            margin: '-300px'
        });
    }
    else {
        UIkit.scrollspy($('.services__container'),  {
            target: '.services__card',
            cls: 'uk-animation-slide-top-small',
            delay: '500'
        });
    }
}

$( document ).ready(function() {
    window.isMobile = document.documentElement.clientWidth < 768;
    window.isTablet = document.documentElement.clientWidth < 1140;

    initScrollspy();
});