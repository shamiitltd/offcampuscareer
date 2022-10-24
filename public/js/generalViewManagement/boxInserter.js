async function loadForm( path ) {
    const queryVal = window.location.search;
    // console.log(window.location);
    let res = await axios.get( `/${path}/${queryVal}` );
    let mainContent = document.getElementById( 'mainContent' );
    if ( mainContent ) {
        mainContent.insertAdjacentHTML( 'afterbegin', res.data );
        let arr;
        if ( path === 'searchform' || path === 'searchformnormal' ) {
            arr = [
                "/js/formsManagement/searchbar_in_popups.js",
            ];
        } else if ( path === 'sitemapscannerbox' ) {
            arr = [
                "/js/formsManagement/newOrEditPostForm.js",
            ];
            document.querySelector( '.spinner' ).classList.add( 'invisible' );
        } else {
            arr = [
                "/js/formsManagement/newOrEditPostForm.js",
                "/ckeditor/ckeditor.js",
            ];
            document.querySelector( '.spinner' ).classList.add( 'invisible' );
        }
        popupjsload();
        loadJsFileFromArray( arr );
    }
}

async function courseRecommendation( path ) {
    let queryVal = window.location.search;
    // console.log(window.location);
    let res = await axios.get( `/${path}/${queryVal}` );
    let mainContent = document.getElementById( 'mainContent' );
    if ( mainContent )
        mainContent.insertAdjacentHTML( 'beforeend', res.data );
    document.querySelector( '.spinner' ).classList.add( 'invisible' );
    let categories = {
        homeRecommendation: [
            'hrFreshJobs',
            'hrExpJobs',
            'hrInternships'
        ],
        courseRecommendation: [
            'crPastCheckOuts',
            'crTrending',
            'crBasedOnSearch',
            'crInterview',
            'crGeneral',
            'crEngineering',
            'crMedical',
            'crMiscellaneous',
            'crCompetitive'
        ],
        coursessearch: [
            'courseBySearch'
        ]
    };
    let contentCardBox = document.querySelectorAll( '.cards' );
    for ( let i = 0; i < contentCardBox.length && i < categories[ path ].length; i++ ) {
        apiLoadderFun( contentCardBox, categories, path, queryVal, i );
    }
    let arr = [ //jobBoxClick manage by cssinserter
        "/js/generalViewManagement/metaDescInserter.js",
        "/js/generalViewManagement/staticBoxLoader.js"
    ];
    popupjsload();
    loadJsFileFromArray( arr );
}

async function apiLoadderFun( contentCardBox, categories, path, queryVal, i ) {
    let telem = await contentCardBox[ i ].parentElement.querySelector( '.topic-selected' );
    let stelem = await contentCardBox[ i ].parentElement.querySelector( '.stopic-selected' );
    let jtelem = await contentCardBox[ i ].parentElement.querySelector( '.job-title' );
    if ( telem ) {
        let searchstr = '';
        searchstr += telem.textContent;
        if ( stelem ) {
            searchstr += ' ' + stelem.textContent;
        }
        if ( jtelem )
            searchstr += ' ' + jtelem.textContent;

        searchstr = filteStringSpace( searchstr );
        // console.log( searchstr );
        if ( searchstr ) {
            let queryObject = updateQueryObject( 'searchAll', searchstr );
            queryVal = '?' + ( new URLSearchParams( queryObject ).toString() );
        }
    }
    // console.log( queryVal )
    await contentCardBox[ i ].parentElement.querySelector( '.spinner' ).classList.remove( 'invisible' );
    let resFromApi = await axios.get( `/${ categories[ path ][ i ] }/${ queryVal }` );
    if ( !resFromApi || !resFromApi.data )
        await contentCardBox[ i ].parentElement.classList.add( 'invisible' );
    contentCardBox[ i ].innerHTML = await resFromApi.data;
    await contentCardBox[ i ].parentElement.querySelector( '.spinner' ).classList.add( 'invisible' );
    if ( contentCardBox.length === i + 1 ) {
        let arr = [
            "/js/boxFunctManagement/jobBoxClick.js",
        ];
        loadJsFileFromArray( arr );
    }
    await moreUrlInsertion( path );
}

async function moreUrlInsertion( path ) {
    if ( path === 'homeRecommendation' ) {
        const moreJobs = document.querySelectorAll( ".moreJobs" );
        if ( moreJobs.length ) {
            let queryObject = updateQueryObject();
            if ( !queryObject[ 'minexp' ] || queryObject[ 'minexp' ] < 2 ) {
                queryObject[ 'minexp' ] = 2;
            }
            queryVal = '?' + ( new URLSearchParams( queryObject ).toString() );
            if ( moreJobs[ 1 ] )
                moreJobs[ 1 ].href = '/jobs/' + queryVal;
            queryObject[ 'minexp' ] = 0;
            queryVal = '?' + ( new URLSearchParams( queryObject ).toString() );
            if ( moreJobs[ 2 ] )
                moreJobs[ 2 ].href = '/internships/' + queryVal;
            queryObject[ 'maxexp' ] = 1;
            queryVal = '?' + ( new URLSearchParams( queryObject ).toString() );
            if ( moreJobs[ 0 ] )
                moreJobs[ 0 ].href = '/jobs/' + queryVal;
        }

    } else if ( path === 'courseRecommendation' ) {

    }
}

async function loadFilteredData( path, key = '' ) {
    const queryVal = window.location.search;
    // console.log( window.location );
    let res;
    if ( key )
        res = await axios.get( `/${ path }/${ key }/${ queryVal }` );
    else
        res = await axios.get( `/${ path }/${ queryVal }` );
    let mainContent = document.getElementById( 'mainContent' );
    if ( mainContent )
        mainContent.insertAdjacentHTML( 'beforeend', res.data );
    let pageTitle = document.querySelector( '.pageTitle' );
    if ( key && pageTitle ) {
        pageTitle = pageTitle.textContent;
        if ( pageTitle ) {
            let newQueryStr = await pathTillKey( key ) + '/' + getDashedStr( pageTitle );
            window.history.pushState( {
                path: newQueryStr
            }, '', newQueryStr );
        } else {
            res = await axios.get( `/nopage` );
            mainContent.innerHTML = res.data;
        }
    }
    let spinners = document.querySelector( '.spinner' );
    if ( spinners ) {
        spinners.classList.add( 'invisible' );
    }
    let arr = [
        "/js/boxFunctManagement/signin.js",
        "/js/boxFunctManagement/jobBoxClick.js",
        "/js/generalViewManagement/metaDescInserter.js"
    ];
    popupjsload();
    loadJsFileFromArray( arr );
}

async function loadEditorial( path ) {
    const prefixPath = '/courses/organisation/';
    const fullPath = window.location.pathname;
    let filterPath = '';
    for ( let i = prefixPath.length; i < fullPath.length; i++ ) {
        filterPath += fullPath[ i ];
    }
    // console.log(window.location);
    let res = await axios.get( `/${path}/${filterPath}` );
    let mainContent = document.getElementById( 'mainContent' );
    mainContent.insertAdjacentHTML( 'beforeend', res.data );
    await document.querySelector( '.spinner' ).classList.add( 'invisible' );

    let arr = [
        "/js/generalViewManagement/metaDescInserter.js"
    ];
    loadJsFileFromArray( arr );
    popupjsload();
}

function loadJsFileFromArray( arr ) {
    for ( let i = 0; i < arr.length; i++ ) {
        let script = document.createElement( "script" );
        script.src = arr[ i ];
        script.type = "text/javascript";
        document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
    }
}

function removeSpecialChar( str ) {
    let newstr = '';
    for ( let i = 0; i < str.length; i++ ) {
        let ascii = str[ i ].charCodeAt( 0 );
        if ( ( ascii >= 48 && ascii <= 57 ) || ( ascii >= 65 && ascii <= 90 ) || ( ascii >= 97 && ascii <= 122 ) ) {
            newstr += str[ i ];
        } else if ( str[ i ] === '%' ) {
            newstr += ' percent ';
        } else if ( str[ i ] === '+' ) {
            newstr += ' plus ';
        } else {
            newstr += ' ';
        }
    }
    return newstr;
}

function getDashedStr( str ) {
    str = removeSpecialChar( str );
    str = filteStringSpace( str );
    str = str.trim();
    let str2 = '';
    for ( let i = 0; i < str.length; i++ ) {
        if ( str[ i ] === ' ' ) {
            str2 += '-';
        } else
            str2 += str[ i ];
    }
    return str2;
}

function stringMatching( str1, str2 ) {
    if ( str1[ str1.length - 1 ] === '/' )
        str1 = str1.slice( 0, -1 );
    return str1 === str2;
}

function stringMatchWithPath( str ) {
    return stringMatching( window.location.pathname, str );
}

function stringKeyMatch( str, key ) {
    return str.indexOf( key ) !== -1;
}

function getPathBlock( nth ) {
    let str = window.location.pathname;
    let key = '/';
    let id = '';
    let start = 1;
    let indx = str.indexOf( key );
    for ( ; start < nth; start++ ) {
        indx = str.indexOf( key, indx + 1 );
    }
    let last = str.indexOf( key, indx + 1 );
    if ( last === -1 )
        last = str.length;
    for ( let i = indx + 1; i < last; i++ ) {
        id += str[ i ];
    }
    return id;
}

function getPathFromNthBlock( nth ) {
    let str = window.location.pathname;
    let key = '/';
    let id = '';
    let start = 1;
    let indx = str.indexOf( key );
    for ( ; start < nth; start++ ) {
        indx = str.indexOf( key, indx + 1 );
    }
    let last = str.length;
    for ( let i = indx + 1; i < last && indx !== -1; i++ ) {
        id += str[ i ];
    }
    return id;
}

function keyPathMatch( key ) {
    return stringKeyMatch( window.location.pathname, key );
}

function pathTillKey( key ) {
    let str = window.location.pathname;
    let last = str.indexOf( key );
    let newPath = '';
    for ( let i = 0; i < last; i++ ) {
        newPath += str[ i ];
    }
    return newPath + key;
}

function updateQueryObject( key = '', value = '' ) {
    let urlParams;
    let match,
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function ( s ) {
            return decodeURIComponent( s.replace( pl, " " ) );
        },
        query = window.location.search.substring( 1 );

    urlParams = {};
    while ( match = search.exec( query ) )
        urlParams[ decode( match[ 1 ] ) ] = decode( match[ 2 ] );
    if ( key && value )
        urlParams[ key ] = value;
    return urlParams;
}

async function loadSimplePage( path ) {
    const queryVal = window.location.search;
    let res = await axios.get( `/${path}/${queryVal}` );
    let mainContent = document.getElementById( 'mainContent' );
    if ( mainContent )
        mainContent.insertAdjacentHTML( 'afterbegin', res.data );
    document.querySelector( '.spinner' ).classList.add( 'invisible' );
    if ( path === 'signinbox' || path === 'authresetpass' ) {
        let arr = [
            "/js/boxFunctManagement/signin.js",
            "/js/generalViewManagement/metaDescInserter.js"
        ];
        loadJsFileFromArray( arr );
    }
    popupjsload();
}

function pageLoader( generalPage, descPage ) {
    let pathkey = getPathBlock( 2 );
    if ( pathkey ) {
        loadFilteredData( descPage, pathkey );
        popupjsload();
    } else {
        loadForm( 'searchform' );
        loadFilteredData( generalPage );
    }
}

function popupjsload() {
    let arr = [
        "/js/libraries/popover.js",
        "/js/formsManagement/searchform.js",
    ];
    loadJsFileFromArray( arr );
}

if ( window.location.pathname === '/' ) {
    loadForm( 'searchform' );
    courseRecommendation( 'homeRecommendation' );
} else if ( stringMatchWithPath( '/jobs/new' ) || stringMatchWithPath( '/jobs/edit' ) ) {
    loadForm( 'newJobPost' );
} else if ( stringMatchWithPath( '/internships/new' ) || stringMatchWithPath( '/internships/edit' ) ) {
    loadForm( 'newInternPost' );
} else if ( stringMatchWithPath( '/referral/new' ) || stringMatchWithPath( '/referral/edit' ) ) {
    loadForm( 'newReferralPost' );
} else if ( stringMatchWithPath( '/scholarships/new' ) || stringMatchWithPath( '/scholarships/edit' ) ) {
    loadForm( 'newScholarshipPost' );
} else if ( stringMatchWithPath( '/courses/organisation/new' ) || stringMatchWithPath( '/courses/organisation/edit' ) ) {
    loadForm( 'newEditorialPost' );
} else if ( stringMatchWithPath( '/forwomen/new' ) || stringMatchWithPath( '/forwomen/edit' ) ) {
    loadForm( 'newExitingForWomenPost' );
} else if ( stringMatchWithPath( '/courses/new' ) || stringMatchWithPath( '/courses/edit' ) ) {
    loadForm( 'newCoursePost' );
} else if ( stringMatchWithPath( '/signin' ) ) {
    loadSimplePage( 'signinbox' );
} else if ( stringMatchWithPath( '/auth/resetpass' ) ) {
    loadSimplePage( `authresetpass` );
} else if ( keyPathMatch( '/jobs' ) ) {
    pageLoader( 'filteredData', 'jobdescriptionbox' );
} else if ( keyPathMatch( '/internships' ) ) {
    pageLoader( 'filteredInternships', 'internshipdescriptionbox' );
} else if ( keyPathMatch( '/referral' ) ) {
    pageLoader( 'referralsContainer', 'referraldescriptionbox' );
} else if ( keyPathMatch( '/scholarships' ) ) {
    pageLoader( 'scholarshipsContainer', 'scholarshipdescriptionbox' );
} else if ( keyPathMatch( '/forwomen' ) ) {
    pageLoader( 'forwomenContainer', 'forwomendescriptionbox' );
} else if ( stringMatchWithPath( '/courses' ) ) {
    loadForm( 'searchformnormal' );
    courseRecommendation( 'courseRecommendation' );
} else if ( stringMatchWithPath( '/courses/search' ) ) {
    loadForm( 'searchformnormal' );
    courseRecommendation( 'coursessearch' );
} else if ( stringMatchWithPath( '/sitemapscanner/new' ) || stringMatchWithPath( '/sitemapscanner/edit' ) ) {
    loadForm( 'sitemapscannerbox' );
} else if ( stringMatchWithPath( '/recruiters' ) ) {
    loadSimplePage( 'adminPortal' );
} else if ( stringMatchWithPath( '/deleteInfo' ) ) {
    loadSimplePage( 'deletorbox' );
} else if ( keyPathMatch( '/viewcourses' ) ) {
    loadFilteredData( 'viewcoursesdata', getPathBlock( 2 ) );
} else if ( keyPathMatch( '/courses/organisation/' ) ) {
    loadEditorial( 'accessEditorial' );
} else if ( keyPathMatch( '/profile' ) ) {
    loadFilteredData( 'profileView', getPathBlock( 2 ) );
} else if ( keyPathMatch( '/privacypolicy' ) ) {
    loadSimplePage( 'privpolicy' );
} else {
    loadSimplePage( 'nopage' );
}



const bars = document.querySelectorAll( '.bars' );
const barBox = document.querySelector( '.bar-box' );
const sideBarDiv = document.querySelector( '.blur-box' );
const sideBar = document.querySelector( '.side-bar' );

if ( bars ) {
    barBox.addEventListener( 'click', function () {
        for ( let i = 0; i < bars.length; i++ ) {
            bars[ i ].classList.toggle( 'bars-r' );
            if ( bars[ i ].classList.contains( 'bars-r' ) ) {
                sideBar.classList.add( 'side-bar-visible' )
            } else {
                sideBar.classList.remove( 'side-bar-visible' );
            }
        }
    } )
    sideBarDiv.addEventListener( 'click', function ( event ) {
        event.preventDefault();
        // event.stopImmediatePropagation();
        for ( let i = 0; i < bars.length; i++ )
            bars[ i ].classList.remove( 'bars-r' );
        sideBar.classList.remove( 'side-bar-visible' );

    } )
}