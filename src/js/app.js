

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

    UIkit.scrollspy($('.footer'),  {
        target: '.footer__bg',
        cls: 'footer__bg_active',
        delay: '400'
    });
}

function initMouseFollowBG() {
    let scene = $(".commercial-hero__bg");
    let strength = 8;
    let currentX = 50;
    let currentY = 50;
    let targetX = 50;
    let targetY = 50;
    let rafId = null;

    function lerp(a, b, t) {
        return a + (b - a) * Math.min(t, 1);
    }

    function updatePosition() {
        currentX = lerp(currentX, targetX, 0.08);
        currentY = lerp(currentY, targetY, 0.08);
        scene.css({
            transform: `translate(${currentX}px, ${currentY}px) scale(1.2)`
        })
        rafId = requestAnimationFrame(updatePosition);
    }

    document.addEventListener("mousemove", function (e) {
        let w = window.innerWidth;
        let h = window.innerHeight;
        targetX = 50 + (e.clientX / w - 0.5) * strength * 10;
        targetY = 50 + (e.clientY / h - 0.5) * strength * 10;
        if (!rafId) rafId = requestAnimationFrame(updatePosition);
    });

    document.addEventListener("mouseleave", function () {
        targetX = 50;
        targetY = 50;
    });

    updatePosition();
}

$( document ).ready(function() {
    window.isMobile = document.documentElement.clientWidth < 768;
    window.isTablet = document.documentElement.clientWidth < 1140;

    initScrollspy();
    initMouseFollowBG();
});