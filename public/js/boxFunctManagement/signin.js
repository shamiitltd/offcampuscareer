const newuser = document.getElementById( 'newuser' );
const back2signin = document.getElementById( 'back2signin' );
const backtosignin = document.getElementById( 'backtosignin' );
const forgotpassButton = document.getElementById( 'forgot' );
const signIn = document.querySelector( '.signin-form' );
const signUp = document.querySelector( '.signup-form' );
const resetpass = document.querySelector( '.resetpass-form' );
const updatePass = document.querySelector( '.updatePass-form' );
const errorNoti = document.querySelector( '.error' );
const loadingSpinner = document.querySelector( '.loading-spinner' );
if ( newuser )
    newuser.addEventListener( 'click', ( event ) => {
        resetpass.classList.add( 'invisible' );
        signIn.classList.add( 'invisible' );
        signUp.classList.remove( 'invisible' );
    } )
if ( back2signin )
    back2signin.addEventListener( 'click', ( event ) => {
        resetpass.classList.add( 'invisible' );
        signUp.classList.add( 'invisible' );
        signIn.classList.remove( 'invisible' );
    } )
if ( backtosignin )
    backtosignin.addEventListener( 'click', ( event ) => {
        resetpass.classList.add( 'invisible' );
        signUp.classList.add( 'invisible' );
        signIn.classList.remove( 'invisible' );
    } )
if ( forgotpassButton )
    forgotpassButton.addEventListener( 'click', ( event ) => {
        resetpass.classList.remove( 'invisible' );
        signUp.classList.add( 'invisible' );
        signIn.classList.add( 'invisible' );
    } )
if ( signIn )
    signIn.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let email = document.getElementById( 'siEmail' ).value;
        let password = document.getElementById( 'siPass' ).value;
        errorNoti.textContent = '';
        signInViaEmail( email, password );
    } )
if ( signUp )
    signUp.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let name = document.getElementById( 'suName' ).value;
        let email = document.getElementById( 'suEmail' ).value;
        let password = document.getElementById( 'suPass' ).value;
        let cPassword = document.getElementById( 'suCPass' ).value;
        errorNoti.textContent = '';
        if ( password == cPassword ) {
            signUpViaEmail( name, email, password );
        } else {
            let suerror = document.getElementById( 'suerror' );
            suerror.classList.remove( 'invisible' );
            suerror.textContent = "Password not matched";
        }
    } )
if ( resetpass )
    resetpass.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        errorNoti.textContent = '';
        let email = document.getElementById( 'rsEmail' ).value;
        resetpassFunct( email );
    } )

async function signUpViaEmail( name, email, password ) {
    let newID = new Date().getTime();
    const formData = {
        'id': newID,
        'name': name,
        'email': email,
        'password': password
    };
    await loadingSpinner.classList.remove( 'invisible' );
    let res = await axios.post( `/registerNewUser`, formData );
    if ( res.data === 'success' ) {
        const formData2 = {
            'email': email,
            'password': password
        };
        let res2 = await axios.post( `/signinUser`, formData2 );
        await loadingSpinner.classList.add( 'invisible' );
        if ( res2.data === 'success' ) {
            let prurl = check_cookie_name( 'PRURL' );
            let strurl = decodeURIComponent( prurl );
            if ( prurl ) {
                setCookieLifeTime( 'PRURL', '', -1 );
                window.location.href = strurl;
            } else {
                if ( document.referrer && document.referrer.indexOf( 'offcampuscareer' ) !== -1 )
                    window.location.href = document.referrer;
                else
                    window.location.href = '/';
            }
        } else {
            let suerror = document.getElementById( 'suerror' );
            suerror.classList.remove( 'invisible' );
            suerror.textContent = res2.data;
        }
    } else {
        await loadingSpinner.classList.add( 'invisible' );
        let suerror = document.getElementById( 'suerror' );
        suerror.classList.remove( 'invisible' );
        suerror.textContent = res.data;
    }
}

async function signInViaEmail( email, password ) {
    const formData = {
        'email': email,
        'password': password
    };
    await loadingSpinner.classList.remove( 'invisible' );
    let res = await axios.post( `/signinUser`, formData );
    await loadingSpinner.classList.add( 'invisible' );

    if ( res.data === 'success' ) {
        let prurl = check_cookie_name( 'PRURL' );
        let strurl = decodeURIComponent( prurl );
        // console.log( prurl, strurl );
        if ( prurl ) {
            setCookieLifeTime( 'PRURL', '', -1 );
            window.location.href = strurl;
        } else {
            if ( document.referrer && document.referrer.indexOf( 'offcampuscareer' ) !== -1 )
                window.location.href = document.referrer;
            else
                window.location.href = '/';
        }
    } else {
        let suerror = document.getElementById( 'sierror' );
        suerror.classList.remove( 'invisible' );
        suerror.textContent = res.data;
    }
}

async function resetpassFunct( email ) {
    loadingSpinner.classList.remove( 'invisible' );
    let res = await axios.get( `/resetpassword/${email}` );
    loadingSpinner.classList.add( 'invisible' );
    if ( res.data === 'success' ) {
        let prurl = check_cookie_name( 'PRURL' );
        let strurl = decodeURIComponent( prurl );
        window.alert( "We send a link to your registered Mail." );
        if ( prurl ) {
            setCookieLifeTime( 'PRURL', '', -1 );
            window.location.href = strurl;
        } else {
            if ( document.referrer && document.referrer.indexOf( 'offcampuscareer' ) !== -1 )
                window.location.href = document.referrer;
            else
                window.location.href = '/';
        }
    } else {
        let rsperror = document.getElementById( 'rsperror' );
        rsperror.classList.remove( 'invisible' );
        rsperror.textContent = res.data;
    }
}
if ( updatePass )
    updatePass.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let email = document.getElementById( 'suEmail' ).value;
        let password = document.getElementById( 'suPass' ).value;
        let cPassword = document.getElementById( 'suCPass' ).value;
        let token = document.getElementById( 'token' ).value;
        errorNoti.textContent = '';
        if ( password === cPassword ) {
            updatePassFunction( email, password, token );
        } else {
            let rperror = document.getElementById( 'rperror' );
            rperror.classList.remove( 'invisible' );
            rperror.textContent = "Password not matched";
        }
    } )

async function updatePassFunction( email, password, token ) {
    const formData = {
        'email': email,
        'password': password,
        'token': token
    };
    loadingSpinner.classList.remove( 'invisible' );
    let res = await axios.post( `/resetNewPassword`, formData );
    const formData2 = {
        'email': email,
        'password': password
    };
    if ( res.data === 'success' ) {
        let res2 = await axios.post( `/signinUser`, formData2 );
        loadingSpinner.classList.add( 'invisible' );
        if ( res2.data === 'success' ) {
            window.location.href = '/';
        } else {
            let rperror = document.getElementById( 'rperror' );
            rperror.classList.remove( 'invisible' );
            rperror.textContent = res2.data;
        }
    } else {
        loadingSpinner.classList.add( 'invisible' );
        let rperror = document.getElementById( 'rperror' );
        rperror.classList.remove( 'invisible' );
        rperror.textContent = res.data;
    }
}

const deleteRssButtons = document.querySelectorAll( ".deleteRss" );
if ( deleteRssButtons ) {
    for ( let i = 0; i < deleteRssButtons.length; i++ ) {
        deleteRssButtons[ i ].addEventListener( 'click', async ( e ) => {
            loadingSpinner.classList.remove( 'invisible' );
            const rowgroup = document.getElementById( `row${i+1}` );
            deleteRssData( deleteRssButtons[ i ], rowgroup );
        } )
    }
}

async function deleteRssData( deleteRssButton, rowgroup ) {
    let rssid = deleteRssButton.dataset.rssid;
    const formData = {
        rssid: rssid
    };
    if ( confirm( 'Are you sure you want to delete?' ) ) {
        let res = await axios.post( `/deleteRssfile`, formData );
        loadingSpinner.classList.add( 'invisible' );
        rowgroup.classList.add( 'invisible' );
        alert( res.data );
    } else {
        loadingSpinner.classList.add( 'invisible' );
        alert( "Not Deleted!!!" );
    }
}