function loadCssFiles() { // detecting path using if else will make a longer delay than you expect.
    let arrCss = [
        "/css/containers/basicAndDescBoxes.css",
        "/css/containers/homeRecom.css",
        "/css/boxes/jobbox.css",
        "/css/boxes/newjobform.css",
        "/css/boxes/profile.css",
        "/css/boxes/signin.css",
        "/css/boxes/jobdesc.css",
        "/css/libraries/fontAwsomeCustom.css",
        "/css/libraries/screensize.css",
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/night-owl.min.css",
    ];
    for ( let i = 0; i < arrCss.length; i++ ) {
        let link = document.createElement( "link" );
        link.href = arrCss[ i ];
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.getElementsByTagName( "head" )[ 0 ].appendChild( link );
    }
    let arr = [
        "/js/boxFunctManagement/jobBoxClick.js",
    ];
    loadJsFileFromArray( arr );
}
window.addEventListener( 'load', loadCssFiles );

const robotoObserver = new FontFaceObserver( 'Roboto' );
Promise.all( [
    robotoObserver.load( null, 20000 )
] ).then( function () {
    document.documentElement.className += "add-font";
} );

const goback = document.querySelector( '.goback' );
if ( goback )
    goback.addEventListener( 'click', ( event ) => {
        history.back();
        // history.go( -1 );
    } )

function setCookieLifeTime( key, value, days ) {
    let date = new Date();
    days = days || 365;
    date.setTime( +date + ( days * 86400000 ) ); //24 * 60 * 60 * 1000
    window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";
};

function check_cookie_name( name ) {
    var match = document.cookie.match( new RegExp( '(^| )' + name + '=([^;]+)' ) );
    if ( match ) {
        return match[ 2 ];
    }
    return '';
}
let tokenval = check_cookie_name( 'session-token' );
if ( tokenval ) {
    setCookieLifeTime( 'session-token', tokenval );
}

function filteStringSpace( str ) {
    let newStr = '';
    if ( !str.length ) {
        return str;
    }
    for ( let i = 0; i < str.length - 1; i++ ) {
        if ( str[ i ] === '\n' || str[ i ] === '\t' )
            continue;
        if ( str[ i ] === ' ' && ( str[ i + 1 ] === ' ' || str[ i + 1 ] === '\n' || str[ i + 1 ] === '\t' ) ) {
            continue;
        }
        newStr += str[ i ];
    }
    newStr += str[ str.length - 1 ];
    return newStr;
}


// if ( 'serviceWorker' in navigator ) {
//     window.addEventListener( 'load', function () {
//         navigator.serviceWorker.register( '/sw.js' ).then( function ( registration ) {
//             // Registration was successful
//             // console.log( 'ServiceWorker registration successful with scope: ', registration.scope );
//         }, function ( err ) {
//             // registration failed :(
//             // console.log( 'ServiceWorker registration failed: ', err );
//         } );
//     } );
// }