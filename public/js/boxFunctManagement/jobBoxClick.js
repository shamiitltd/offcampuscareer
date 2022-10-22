async function applyingFunctionsOnJobs() {
    updateJobCount();
    const jobBox = document.querySelectorAll( '.job-box' );
    if ( jobBox && ( stringMatchWithPath( '/jobs' ) || stringMatchWithPath( '/internships' ) ) ) {
        let queryObject = updateQueryObject();
        fadingJobBoxes( jobBox, queryObject.id );
    }

    for ( let i = 0; jobBox && i < jobBox.length; i++ ) {
        jobBox[ i ].addEventListener( 'click', async ( event ) => {
            const id = jobBox[ i ].dataset.id;
            let delBox = jobBox[ i ].querySelector( '.deleteBox' );
            if ( delBox && !delBox.classList.contains( 'invisible' ) ) {
                let key = 'MRC';
                let check = check_cookie_name( key );
                if ( check ) {
                    let prevVal = JSON.parse( check );
                    const setVersion = new Set( prevVal.ids );
                    if ( setVersion.has( id ) ) {
                        setVersion.delete( id )
                        prevVal.ids = [ ...setVersion ];
                    }
                    if ( !prevVal.ids.length ) {
                        setCookieLifeTime( key, '', -1 );
                        jobBox[ i ].parentElement.parentElement.parentElement.classList.add( 'invisible' );
                    } else {
                        setCookieLifeTime( key, JSON.stringify( prevVal ), 5 * 365 );
                        jobBox[ i ].classList.add( 'invisible' );
                    }
                }
            } else {
                let queryObject = updateQueryObject( 'id', id );
                let newQueryStr = '?' + ( new URLSearchParams( queryObject ).toString() );
                pathForwarding( window.location.pathname, jobBox, id, newQueryStr, i );
            }
        } )
    }
}


function pathForwarding( currentPathName, jobBox, id, newQueryStr, i ) {
    if ( currentPathName === '/jobs/' || currentPathName === '/jobs' ) {
        if ( window.innerWidth <= 900 ) {
            let newurl = '/jobs/' + id;
            window.open( newurl, '_self' ).focus();
        } else
            explainationBoxLoading( 'jobdescriptionbox', jobBox, id, newQueryStr );
    } else if ( currentPathName === '/internships/' || currentPathName === '/internships' ) {
        if ( window.innerWidth <= 900 ) {
            let newurl = '/internships/' + id;
            window.open( newurl, '_self' ).focus();
        } else
            explainationBoxLoading( 'internshipdescriptionbox', jobBox, id, newQueryStr )
    } else if ( currentPathName === '/referral/' || currentPathName === '/referral' ) {
        if ( window.innerWidth <= 900 ) {
            let newurl = '/referrals/' + id;
            window.open( newurl, '_self' ).focus();
        } else
            explainationBoxLoading( 'referraldescriptionbox', jobBox, id, newQueryStr )
    } else if ( currentPathName === '/scholarships/' || currentPathName === '/scholarships' ) {
        if ( window.innerWidth <= 900 ) {
            let newurl = '/scholarships/' + id;
            window.open( newurl, '_self' ).focus();
        } else
            explainationBoxLoading( 'scholarshipdescriptionbox', jobBox, id, newQueryStr )
    } else if ( currentPathName === '/forwomen/' || currentPathName === '/forwomen' ) {
        if ( window.innerWidth <= 900 ) {
            let newurl = '/forwomens/' + id;
            window.open( newurl, '_self' ).focus();
        } else
            explainationBoxLoading( 'forwomendescriptionbox', jobBox, id, newQueryStr )
    } else if ( currentPathName === '/' ) {
        if ( window.innerWidth <= 900 ) {
            let newurl;
            if ( jobBox[ i ].parentNode.id === 'Freshers' || jobBox[ i ].parentNode.id === 'Experienced' ) {
                newurl = '/jobs/' + id;
            } else if ( jobBox[ i ].parentNode.id === 'Internships' ) {
                newurl = '/internships/' + id;
            }
            window.open( newurl, '_self' ).focus();
        } else {
            if ( jobBox[ i ].parentNode.id === 'Freshers' ) {
                let queryObject = updateQueryObject( 'id', id );
                queryObject[ 'minexp' ] = 0;
                queryObject[ 'maxexp' ] = 1;
                newQueryStr = '?' + ( new URLSearchParams( queryObject ).toString() );
                window.location.href = '/jobs/' + newQueryStr;
            } else if ( jobBox[ i ].parentNode.id === 'Experienced' ) {
                let queryObject = updateQueryObject( 'id', id );
                if ( !queryObject[ 'minexp' ] || queryObject[ 'minexp' ] < 2 ) {
                    queryObject[ 'minexp' ] = 2;
                }
                newQueryStr = '?' + ( new URLSearchParams( queryObject ).toString() );
                window.location.href = '/jobs/' + newQueryStr;
            } else if ( jobBox[ i ].parentNode.id === 'Internships' ) {
                window.location.href = '/internships/' + newQueryStr;
            }
        }
    } else if ( currentPathName === '/courses/' || currentPathName === '/courses' || currentPathName === '/courses/search' || currentPathName === '/courses/search/' ) {
        updateCookieWithId( id );
        if ( window.innerWidth <= 900 ) {
            let newurl = '/viewcourses/' + id;
            window.open( newurl, '_self' ).focus();
        } else
            window.location.href = '/viewcourses/' + id;
    }

}

function updateCookieWithId( id ) {
    let key = 'MRC';
    let value = {
        ids: [ id ]
    };
    let check = check_cookie_name( key );
    if ( check ) {
        let prevVal = JSON.parse( check );
        const setVersion = new Set( prevVal.ids );
        if ( setVersion.has( id ) ) {
            setVersion.delete( id )
            prevVal.ids = [ ...setVersion ];
        }
        prevVal.ids.unshift( id );
        if ( prevVal.ids.length > 20 ) {
            prevVal.ids.pop();
        }
        setCookieLifeTime( key, JSON.stringify( prevVal ), 5 * 365 );
    } else {
        setCookieLifeTime( key, JSON.stringify( value ), 5 * 365 );
    }
}
async function explainationBoxLoading( path, jobBox, id, newQueryStr ) {
    if ( jobBox )
        fadingJobBoxes( jobBox, id );
    let jobDesc = document.getElementById( 'jobDesc' );
    jobDesc.classList.add( 'fade1' );
    window.history.pushState( {
        path: newQueryStr
    }, '', newQueryStr );
    let res = await axios.get( `/${path}/${id}` );
    jobDesc.innerHTML = await res.data;
    await jobDesc.classList.remove( 'fade1' );
}


function fadingJobBoxes( jobBox, id = '' ) {
    for ( let i = 0; i < jobBox.length; i++ ) {
        jobBox[ i ].classList.remove( 'fade1' );
    }
    if ( !id && jobBox && jobBox[ 0 ] )
        jobBox[ 0 ].classList.add( 'fade1' );
    else
        for ( let i = 0; i < jobBox.length; i++ ) {
            if ( jobBox[ i ].dataset.id === id ) {
                jobBox[ i ].classList.add( 'fade1' );
            }
        }
}


window.onload = applyingFunctionsOnJobs();
// applyingFunctionsOnJobs();


function updateJobCount() {
    const searchCount = document.getElementById( 'searchCount' );
    if ( window.location.pathname === '/' && searchCount )
        searchCount.parentElement.classList = "invisible";
    const countVal = document.getElementById( 'basicBlock' );
    const prevPageClass = document.querySelectorAll( '.prevPage' );
    const nextPageClass = document.querySelectorAll( '.nextPage' );
    const curPageClass = document.querySelectorAll( '.curPage' );
    if ( countVal ) {
        searchCount.textContent = countVal.dataset.count;
    }
    for ( let i = 0; i < curPageClass.length; i++ ) {
        if ( curPageClass[ i ] )
            curPageClass[ i ].addEventListener( 'change', function ( event ) {
                updateSearchedDataWithPageNumber( event.target.value )
            } )
        if ( prevPageClass[ i ] )
            prevPageClass[ i ].addEventListener( 'click', function ( event ) {
                updateSearchedDataWithPageNumber( event.target.dataset.pagenumber )
            } )
        if ( nextPageClass[ i ] )
            nextPageClass[ i ].addEventListener( 'click', function ( event ) {
                updateSearchedDataWithPageNumber( event.target.dataset.pagenumber )
            } )
    }
}

function updateSearchedDataWithPageNumber( pageNumber ) {
    let queryObject = updateQueryObject();
    delete queryObject.id;
    queryObject.page = pageNumber;
    window.location.search = '?' + ( new URLSearchParams( queryObject ).toString() );
    if ( stringMatchWithPath( '/jobs' ) ) {
        loadFilteredData( 'filteredData' );
    } else if ( stringMatchWithPath( '/internships' ) ) {
        loadFilteredData( 'filteredInternships' );
    } else if ( stringMatchWithPath( '/referral' ) ) {
        loadFilteredData( 'referralsContainer' );
    } else if ( stringMatchWithPath( '/scholarships' ) ) {
        loadFilteredData( 'scholarshipsContainer' );
    } else if ( stringMatchWithPath( '/forwomen' ) ) {
        loadFilteredData( 'forwomenContainer' );
    }
}