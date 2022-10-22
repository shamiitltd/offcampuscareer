//Change chache name after every change in main html ejs css js images or any other file to update chache.
const d = new Date();
let month = d.getMonth();
let staticCache = `Oc2-static-v${month}`;
let dynamicCahe = `Oc2-dynamic-v${month}`;
let urlsToCache = [
    '/',
    "/css/libraries/general.css",
    "/css/containerWithSearchForm.css",
    "/css/boxes/searchform.css",
    "/css/tools/navbar.css",
    "/css/libraries/popovers.css",
    "/css/containers/basicAndDescBoxes.css",
    "/css/containers/homeRecom.css",
    "/css/boxes/jobbox.css",
    "/css/boxes/jobdesc.css",
    "/css/libraries/fontAwsomeCustom.css",
    "/favicon.ico",
    "/images/logo.avif",
    "/images/icon/favicon-32x32.png",
    "/images/icon/favicon-16x16.png",
    "/fonts/webfonts/fa-regular-400.woff2",
    "/fonts/webfonts/fa-solid-900.woff2",
    "/fonts/Roboto/Roboto-Light.woff2",
    "/js/libraries/fontFaceObserver.js",
    "/js/generalViewManagement/cssInserter.js",
    "/js/libraries/axios.js",
    "/js/data/suggestions.js",
    "/js/generalViewManagement/boxInserter.js",
    "/js/libraries/popover.js",
    "/js/formsManagement/searchform.js",
    "/js/formsManagement/searchbar_in_popups.js",
    "/js/boxFunctManagement/jobBoxClick.js",
    "/js/generalViewManagement/metaDescInserter.js",
    "/homeRecommendation/",
    "/offline",
    "/useroffline/",
    "/manifest.json"
];

// cache size limit function
const limitCacheSize = ( name, size ) => {
    caches.open( name ).then( cache => {
        cache.keys().then( keys => {
            if ( keys.length > size ) {
                cache.delete( keys[ 0 ] ).then( limitCacheSize( name, size ) );
            }
        } );
    } );
};

self.addEventListener( 'install', function ( event ) {
    // Perform install steps
    event.waitUntil(
        caches.open( staticCache )
        .then( function ( cache ) {
            return cache.addAll( urlsToCache );
        } )
    );
} );

self.addEventListener( 'activate', function ( event ) {
    let cacheAllowlist = [ staticCache, dynamicCahe ];
    event.waitUntil(
        caches.keys().then( function ( cacheNames ) {
            return Promise.all(
                cacheNames.map( function ( cacheName ) {
                    if ( cacheAllowlist.indexOf( cacheName ) === -1 ) {
                        return caches.delete( cacheName );
                    }
                } )
            );
        } )
    );
} );

self.addEventListener( 'fetch', function ( event ) {
    let requestURL = new URL( event.request.url );
    if ( requestURL.origin != location.origin ) {
        event.respondWith( async function () {
            try {
                return await fetch( event.request );
            } catch ( err ) {} //
        }() );
        return;
    }
    if ( /^\/homeRecommendation\//.test( requestURL.pathname ) || /^\/filteredData\//.test( requestURL.pathname ) || /^\/filteredInternships\//.test( requestURL.pathname ) ) {
        event.respondWith( async function () {
            try {
                return fetch( event.request ).then(
                    function ( response ) {
                        // Check if we received a valid response
                        if ( !response || response.status !== 200 || response.type !== 'basic' ) {
                            return response;
                        }
                        let responseToCache = response.clone();
                        caches.open( dynamicCahe )
                            .then( function ( cache ) {
                                cache.put( event.request, responseToCache );
                            } );
                        limitCacheSize( dynamicCahe, 100 );
                        return response;
                    }
                ).catch( err => {
                    return caches.match( event.request );
                } );

            } catch ( err ) {
                return caches.match( event.request );
            }
        }() );
        return;
    }
    if ( /^\/searchform\//.test( requestURL.pathname ) ) {
        event.respondWith( async function () {
            return fetch( event.request ).catch( ( err ) => {
                return caches.match( '/useroffline/' );
            } );

            // try {
            //     return await fetch( event.request );
            // } catch ( err ) {
            //     return caches.match( '/useroffline/' );
            // }
        }() );
        return;
    } else {
        event.respondWith(
            caches.match( event.request )
            .then( function ( response ) {
                // Cache hit - return response
                if ( response ) {
                    return response;
                }
                return fetch( event.request ).then(
                    function ( response ) {
                        // Check if we received a valid response
                        if ( !response || response.status !== 200 || response.type !== 'basic' ) {
                            return response;
                        }
                        let responseToCache = response.clone();
                        caches.open( dynamicCahe )
                            .then( function ( cache ) {
                                cache.put( event.request, responseToCache );
                            } );
                        limitCacheSize( dynamicCahe, 100 );
                        return response;
                    }
                );
            } ).catch( function ( err ) {
                if ( event.request.url.indexOf( 'jobdescriptionbox' ) > -1 || event.request.url.indexOf( 'internshipdescriptionbox' ) > -1 ) {
                    return caches.match( '/useroffline/' );
                } else {
                    return caches.match( '/offline' );
                }
            } )
        );
    }
} );