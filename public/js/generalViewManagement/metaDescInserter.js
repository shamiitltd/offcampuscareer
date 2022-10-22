let _desc = '';
let _keywords = '';
let qryObj = updateQueryObject();
let searchStr = ( qryObj[ 'searchAll' ] ? qryObj[ 'searchAll' ] + ' ' : '' );
let titleString = 'Offcampuscareer - Fresher & Experienced Jobs, Internships, Referrals, Scholarships, courses and many more ';
if ( window.location.pathname === '/' ) {
    _desc = "Offcampuscareer provides Thousands of Jobs, Internships, Scholarships, Referrals, courses and various exciting opportunities for students and working employees in hundreds of major and sub-fields";
} else if ( stringMatchWithPath( '/jobs/new' ) ) {
    // loadForm( 'newJobPost' );
} else if ( stringMatchWithPath( '/internships/new' ) ) {
    // loadForm( 'newInternPost' );
} else if ( stringMatchWithPath( '/referral/new' ) ) {
    // loadForm( 'newReferralPost' );
} else if ( stringMatchWithPath( '/scholarships/new' ) ) {
    // loadForm( 'newScholarshipPost' );
} else if ( stringMatchWithPath( '/courses/organisation/new' ) ) {
    // loadForm( 'newEditorialPost' );
} else if ( stringMatchWithPath( '/forwomen/new' ) ) {
    // loadForm( 'newExitingForWomenPost' );
} else if ( stringMatchWithPath( '/signin' ) ) {
    titleString = 'Offcampuscareer - Sign In';
    _desc = "Register, Sign in or sign up to offcampuscareer.com";
} else if ( keyPathMatch( '/jobs' ) ) {
    titleString = searchStr + 'Jobs for Freshers & experienced - Offcampuscareer';
    document.head.innerHTML += `<meta name="twitter:domain" content="Offcampuscareer Jobs">`;
    // _desc = "Your dream Offcampus job awaits at Offcampuscareer. Browse thousands of jobs by salary &amp; tech stack. Personalized job matches. No recruiter spam. Your privacy, guaranteed.";
} else if ( keyPathMatch( '/internships' ) ) {
    titleString = searchStr + ' Internships for Freshers & experienced - Offcampuscareer';
    document.head.innerHTML += `<meta name="twitter:domain" content="Offcampuscareer Internships">`;
    // _desc = "Your dream Offcampus Internship awaits at Offcampuscareer. Browse thousands of Internships by salary &amp; tech stack. Personalized Internship matches. No recruiter spam. Your privacy, guaranteed.";
} else if ( keyPathMatch( '/referral' ) ) {
    titleString = searchStr + ' Referrals for Freshers and experienced - Offcampuscareer';
    document.head.innerHTML += `<meta name="twitter:domain" content="Offcampuscareer Referrals">`;
    // _desc = "Your dream Referral awaits at Offcampuscareer. Browse thousands of Referrals by salary &amp; tech stack. Personalized Referral matches. No recruiter spam. Your privacy, guaranteed.";
} else if ( keyPathMatch( '/scholarships' ) ) {
    titleString = searchStr + ' Scholarships available according to educational qualification - Offcampuscareer';
    document.head.innerHTML += `<meta name="twitter:domain" content="Offcampuscareer Scholarships">`;
    // _desc = "Your dream Scholarship awaits at Offcampuscareer. Browse thousands of Scholarships by educational background &amp; tech stack. Personalized Scholarship matches. No Information spam. Your privacy, guaranteed.";
} else if ( keyPathMatch( '/forwomen' ) ) {
    titleString = searchStr + ' Dream opportunities for womens - Offcampuscareer';
    document.head.innerHTML += `<meta name="twitter:domain" content="Offcampuscareer Exiting for womens">`;
    // _desc = "Your dream opportunities awaits at Offcampuscareer. Browse thousands of exiting opportunities for womens by educational background &amp; tech stack. Personalized opportunity matches. No Information spam. Your privacy, guaranteed.";
} else if ( keyPathMatch( '/view' ) ) {
    titleString = getStrByQrySelectAll( '.pageTitle' ) + '- Offcampuscareer';
    // _desc = getStrByQrySelectAll( '.date' ) + getStrByQrySelectAll( '.descFull' );
    _keywords = getStrByQrySelectAll( '.jd-skills-text' ) + getStrByQrySelectAll( '.basic-details' ); //
} else if ( keyPathMatch( '/courses' ) ) {
    titleString = searchStr + ' Courses for various educational background - Offcampuscareer';
    _desc = "Your Future ready course awaits at Offcampuscareer. Browse thousands of super exiting futuristic courses with different educational background &amp; tech stack. No Information spam.";
} else if ( keyPathMatch( '/courses/organisation/' ) ) {
    titleString = getStrByQrySelectAll( '.pageTitle' ) + '- Offcampuscareer';
    document.head.innerHTML += `<meta name="twitter:domain" content="Offcampuscareer Courses">`;
    // _desc = getStrByQrySelectAll( '.date' ) + getStrByQrySelectAll( '.descFull' );
}


function getStrByQrySelectAll( descclass ) {
    let str = '';
    let elements = document.querySelectorAll( descclass );
    elements.forEach( function ( element ) {
        str += element.textContent + ' ';
    } )
    return ( str.substring( 0, 500 ) );
}

_keywords = filteStringSpace( _keywords );
_desc = filteStringSpace( _desc );
if ( _keywords ) {
    document.head.innerHTML += `<meta name="keywords" content="${ _keywords }">`;
}
if ( _desc ) {
    document.head.innerHTML += `<meta name="description" content="${ _desc }">`;
    document.head.innerHTML += `<meta property="og:description" content="${ _desc }">`;
    document.head.innerHTML += `<meta name="twitter:description" content="${ _desc }">`;
}

let pageTitle = document.querySelector( '.pageTitle' );
if ( pageTitle && pageTitle.textContent ) {
    titleString = pageTitle.textContent + '- offcampuscareer.com';
}

if ( titleString )
    document.title = titleString;
let updated_time = document.querySelector( '.job-start-date' );
let image = document.getElementById( 'logoUrl' );
if ( updated_time ) {
    updated_time = updated_time.dataset.updated;
    document.head.innerHTML += `<meta property="og:updated_time" content="${ updated_time }">`;
    document.head.innerHTML += `<meta property="article:published_time" content="${ updated_time }">`;
    document.head.innerHTML += `<meta property="article:modified_time" content="${ updated_time }">`;
}
document.head.innerHTML += `<meta property="og:title" content="${ titleString }">`;
document.head.innerHTML += `<meta name="twitter:title" content="${ titleString }">`;

if ( image && image.src ) {
    document.head.innerHTML += `<meta property="og:image" content="${ image.src }">`;
    document.head.innerHTML += `<meta name="twitter:image" content="${ image.src }">`;
}
document.head.innerHTML += `<meta property="og:url" content="${ window.location.href }">`;
document.head.innerHTML += `<link rel="canonical" href="${ window.location.href }">`;

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


function stringMatching( str1, str2 ) {
    if ( str1[ str1.length - 1 ] === '/' )
        str1 = str1.slice( 0, -1 );
    return str1 === str2;
}

function stringMatchWithPath( str ) {
    return stringMatching( window.location.pathname, str );
}

function keyPathMatch( key ) {
    return window.location.pathname.indexOf( key ) !== -1;
}
hljs.highlightAll();