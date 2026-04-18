function initScrollspy() {
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

function initSwitchers() {
    function syncSwitcherHiddenInput($switcher, options) {
        const emitSwitch = options && options.emitSwitch === true;
        const $input = $switcher.find('.switcher__input');
        if (!$input.length) return;
        const $active = $switcher.find('.switcher__item_active');
        const value = $active.length ? $active.attr('data-switch') : '';
        const nextVal = value != null && value !== '' ? value : '';
        const prevVal = $input.val();
        $input.val(nextVal);
        if (emitSwitch && String(prevVal) !== String(nextVal)) {
            $input.trigger('switch');
        }
    }
    
    function layoutSwitcherThumb($switcher) {
        const $active = $switcher.find('.switcher__item_active');
        const $thumb = $switcher.find('.switcher__thumb');
        if (!$active.length) {
            $thumb.css({ width: '', transform: '' });
            return;
        }
        const switcherEl = $switcher[0];
        const activeEl = $active[0];
        const sr = switcherEl.getBoundingClientRect();
        const ir = activeEl.getBoundingClientRect();
        const left = ir.left - sr.left;
        $thumb.css({
            width: ir.width,
            transform: 'translateX(' + left + 'px)',
        });
    }

    function layoutAllSwitchers() {
        $('.switcher').each(function () {
            layoutSwitcherThumb($(this));
        });
    }

    $('.switcher').each(function () {
        const $sw = $(this);
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(function () {
                layoutSwitcherThumb($sw);
            }).observe($sw[0]);
        }
    });

    $(window).on('resize', layoutAllSwitchers);

    $(document).on('click', '.switcher__item', function () {
        const $item = $(this);
        const $switcher = $item.closest('.switcher');
        $switcher.find('.switcher__item_active').removeClass('switcher__item_active');
        $item.addClass('switcher__item_active');
        layoutSwitcherThumb($switcher);
        syncSwitcherHiddenInput($switcher, { emitSwitch: true });
    });

    $('.switcher').each(function () {
        syncSwitcherHiddenInput($(this));
    });
    layoutAllSwitchers();
    requestAnimationFrame(layoutAllSwitchers);
}

function setLoadBtn(btn, value) {
    if(value) {
        $(btn).data('copy', $(btn).html());
        $(btn).html('<div uk-spinner="ratio: 0.5"></div>');
    }
    else {
        $(btn).html($(btn).data('copy'));
    }

}

function initSimpleChangers() {
    $('.simple-changer__btn').on('click', function(event) {
        const $btn = $(this);
        const $wrapper = $btn.parents('.simple-changer');
        const $input = $btn.siblings('.simple-changer__input');
        const values = $wrapper.data('values').split(',');
        const labels = $wrapper.data('labels').split(',');
        const newIndex = (values.indexOf(String($input.val())) + 1) % values.length;

        $input.val(values[newIndex]);
        setLoadBtn(this, true);
        updateCatalog($wrapper).then(() => {
            $btn.html(labels[newIndex]);
        });
    });
}

function initCatalogFilters() {
    $('.catalog__filters').on('switch', '.switcher__input', function(event) {
        updateCatalog($(this).closest('.catalog'));
    })
}

function destroyCatalogYandexMap() {
    if (window._catalogMapPinSyncT1) window.clearTimeout(window._catalogMapPinSyncT1);
    if (window._catalogMapPinSyncT2) window.clearTimeout(window._catalogMapPinSyncT2);
    if (window._catalogMapPinSyncT3) window.clearTimeout(window._catalogMapPinSyncT3);
    window._catalogMapPinSyncT1 = window._catalogMapPinSyncT2 = window._catalogMapPinSyncT3 = null;
    if (window.catalogYMapInstance) {
        try {
            window.catalogYMapInstance.destroy();
        } catch (e) {}
        window.catalogYMapInstance = null;
    }
    if (window.catalogMapContainerEl) {
        window.catalogMapContainerEl.removeAttribute('data-y-map-inited');
        window.catalogMapContainerEl = null;
    }
}

function getCatalogMapFeatures() {
    return [
        {
            type: 'Feature',
            id: 'c1',
            geometry: { coordinates: [37.623, 55.755] },
            properties: { title: 'Stone Римская' },
        },
        {
            type: 'Feature',
            id: 'c2',
            geometry: { coordinates: [37.681, 55.788] },
            properties: { title: 'Stone Римская' },
        },
        {
            type: 'Feature',
            id: 'c3',
            geometry: { coordinates: [37.61, 55.819] },
            properties: { title: 'Ostankino Business Park' },
        },
        {
            type: 'Feature',
            id: 'c4',
            geometry: { coordinates: [37.537, 55.749] },
            properties: { title: 'One Tower' },
        },
        {
            type: 'Feature',
            id: 'c5',
            geometry: { coordinates: [37.53, 55.79] },
            properties: { title: 'Stone Ходынка' },
        },
        {
            type: 'Feature',
            id: 'c6',
            geometry: { coordinates: [37.475, 55.775] },
            properties: { title: 'Stone Мнёвники' },
        },
        {
            type: 'Feature',
            id: 'm1',
            geometry: { coordinates: [37.591, 55.752] },
            properties: { title: 'Stone Римская' },
        },
        {
            type: 'Feature',
            id: 'm2',
            geometry: { coordinates: [37.542, 55.658] },
            properties: { title: 'Stone Калужская' },
        },
        {
            type: 'Feature',
            id: 'm3',
            geometry: { coordinates: [37.668, 55.788] },
            properties: { title: 'Ostankino Business Park' },
        },
        {
            type: 'Feature',
            id: 'm4',
            geometry: { coordinates: [37.358, 55.846] },
            properties: { title: 'Stone Римская' },
        },
    ];
}

function findCatalogFeatureById(id) {
    return getCatalogMapFeatures().find(function (f) {
        return f.id === id;
    });
}

function setActiveCatalogMapSelection(catalogSection, featureId) {
    if (!catalogSection) return;
    catalogSection.querySelectorAll('.catalog-map-card').forEach(function (card) {
        card.classList.toggle('catalog-map-card_active', card.getAttribute('data-feature-id') === featureId);
    });
    const mapBox = catalogSection.querySelector('.catalog__map-map');
    if (mapBox) {
        mapBox.querySelectorAll('.catalog-map-pin').forEach(function (pin) {
            pin.classList.toggle('catalog-map-pin_active', pin.getAttribute('data-feature-id') === featureId);
        });
    }
}

function scheduleCatalogMapSelectionSyncAfterZoom(catalog, featureId) {
    if (!catalog || !featureId) return;
    if (window._catalogMapPinSyncT1) window.clearTimeout(window._catalogMapPinSyncT1);
    if (window._catalogMapPinSyncT2) window.clearTimeout(window._catalogMapPinSyncT2);
    if (window._catalogMapPinSyncT3) window.clearTimeout(window._catalogMapPinSyncT3);
    var syncPins = function () {
        setActiveCatalogMapSelection(catalog, featureId);
    };
    window._catalogMapPinSyncT1 = window.setTimeout(syncPins, 520);
    window._catalogMapPinSyncT2 = window.setTimeout(syncPins, 900);
    window._catalogMapPinSyncT3 = window.setTimeout(syncPins, 1300);
}

function scrollCatalogMapCardIntoView(card) {
    if (!card) return;
    try {
        card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch (e) {
        card.scrollIntoView();
    }
}

function initCatalogMapCardsInteractions() {
    $(document).on('click', '.catalog-map-card', function () {
        const id = this.getAttribute('data-feature-id');
        if (!id) return;
        const map = window.catalogYMapInstance;
        const feature = findCatalogFeatureById(id);
        if (!map || !feature) return;
        const catalog = this.closest('.catalog');
        setActiveCatalogMapSelection(catalog, id);
        map.update({
            location: {
                center: feature.geometry.coordinates,
                zoom: 15,
                duration: 450,
            },
        });
        scheduleCatalogMapSelectionSyncAfterZoom(catalog, id);
    });
}

function boundsFromCoordinatesList(coordsList) {
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;
    coordsList.forEach(function (c) {
        minLng = Math.min(minLng, c[0]);
        minLat = Math.min(minLat, c[1]);
        maxLng = Math.max(maxLng, c[0]);
        maxLat = Math.max(maxLat, c[1]);
    });
    return [[minLng, minLat], [maxLng, maxLat]];
}

function initCatalogYandexMap(container) {
    if (!container || typeof ymaps3 === 'undefined') return;
    if (container.getAttribute('data-y-map-inited') === '1') return;
    container.setAttribute('data-y-map-inited', '1');

    (async function () {
        try {
            await ymaps3.ready;
            if (!container.isConnected) return;

            const { YMapClusterer, clusterByGrid } = self['@yandex/ymaps3-clusterer'];
            const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

            if (!container.isConnected) return;

            const features = getCatalogMapFeatures();
            const initialBounds = boundsFromCoordinatesList(
                features.map(function (f) {
                    return f.geometry.coordinates;
                })
            );

            const map = new YMap(
                container,
                {
                    location: { bounds: initialBounds, duration: 0 },
                    showScaleInCopyrights: true,
                },
                [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})]
            );

            window.catalogYMapInstance = map;
            window.catalogMapContainerEl = container;

            function buildClusterElement(count) {
                const el = document.createElement('div');
                el.className = 'catalog-map-cluster';
                el.innerHTML = '<span class="catalog-map-cluster__count">' + count + '</span>';
                return el;
            }


            function buildSingleMarkerElement(feature) {
                const el = document.createElement('div');
                el.className = 'catalog-map-pin';
                el.setAttribute('data-feature-id', feature.id);

                const iconWrap = document.createElement('div');
                iconWrap.className = 'catalog-map-pin__icon';
                iconWrap.setAttribute('aria-hidden', 'true');
                iconWrap.innerHTML = '<img src="images/icons/map-pointer.svg">';

                const titleEl = document.createElement('span');
                titleEl.className = 'catalog-map-pin__title';
                titleEl.textContent = feature.properties.title;

                el.appendChild(iconWrap);
                el.appendChild(titleEl);
                return el;
            }

            const marker = function (feature) {
                return new YMapMarker(
                    {
                        coordinates: feature.geometry.coordinates,
                        onClick: function () {
                            const catalog = container.closest('.catalog');
                            if (!catalog) return;
                            const card = catalog.querySelector(
                                '.catalog-map-card[data-feature-id="' + feature.id + '"]'
                            );
                            setActiveCatalogMapSelection(catalog, feature.id);
                            map.update({
                                location: {
                                    center: feature.geometry.coordinates,
                                    zoom: 15,
                                    duration: 450,
                                },
                            });
                            scheduleCatalogMapSelectionSyncAfterZoom(catalog, feature.id);
                            if (card) scrollCatalogMapCardIntoView(card);
                        },
                    },
                    buildSingleMarkerElement(feature)
                );
            };

            const cluster = function (coordinates, clusterFeatures) {
                return new YMapMarker(
                    {
                        coordinates: coordinates,
                        onClick: function () {
                            const coords = clusterFeatures.map(function (f) {
                                return f.geometry.coordinates;
                            });
                            const b = boundsFromCoordinatesList(coords);
                            map.update({
                                location: {
                                    bounds: b,
                                    duration: 400,
                                },
                            });
                        },
                    },
                    buildClusterElement(clusterFeatures.length)
                );
            };

            const clusterer = new YMapClusterer({
                method: clusterByGrid({ gridSize: 64 }),
                features: features,
                marker: marker,
                cluster: cluster,
            });

            map.addChild(clusterer);
        } catch (err) {
            console.error('Yandex map init failed', err);
            container.removeAttribute('data-y-map-inited');
        }
    })();
}

async function updateCatalog($from) {
    const $content = $from.closest('.catalog').find('.catalog__content');
    if (!$content.length) return;


    const formData = $('.catalog__filters').serializeArray();
    console.log(formData);

    $content.addClass('catalog__content_load');

    await new Promise(function (resolve) {
        setTimeout(() => {
            destroyCatalogYandexMap();
            // TODO: Create ajax (with debounce)
            $content.html(() => {
                if(formData.find(elem => elem.name === 'view').value == 'list') {
                    return $('<div>').append($('.catalog__list').clone().attr('hidden', false)).html();
                }
                if(formData.find(elem => elem.name === 'view').value == 'grid') {
                    return $('<div>').append($('.catalog__grid').clone().attr('hidden', false)).html();
                }
                if(formData.find(elem => elem.name === 'view').value == 'map') {
                    return $('<div>').append($('.catalog__map').clone().attr('hidden', false)).html();
                }
            })
            $content.removeClass('catalog__content_load');
            resolve();
        }, 1000);
    });

    const viewField = formData.find(elem => elem.name === 'view');
    if (viewField && viewField.value === 'map') {
        const mapEl = $content.find('.catalog__map-map')[0];
        if (mapEl) initCatalogYandexMap(mapEl);
    }
}

$( document ).ready(function() {
    window.isMobile = document.documentElement.clientWidth < 768;
    window.isTablet = document.documentElement.clientWidth < 1140;

    initScrollspy();
    initMouseFollowBG();
    initSwitchers();
    initSimpleChangers();
    initCatalogFilters();
    initCatalogMapCardsInteractions();

    const initialCatalogMap = document.querySelector('.catalog__content .catalog__map-map');
    initCatalogYandexMap(initialCatalogMap);
});