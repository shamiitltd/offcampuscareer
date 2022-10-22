function changeMajorTopics() {
    let majorTopics = document.querySelectorAll( '.major-topic' );
    for ( let i = 0; i < majorTopics.length; i++ ) {
        majorTopics[ i ].addEventListener( 'click', async function ( event ) {
            let majParent = await majorTopics[ i ].parentElement;
            let siblings = majParent.querySelectorAll( '.major-topic' );
            for ( let j = 0; j < siblings.length; j++ ) {
                siblings[ j ].classList.remove( 'topic-selected' );
            }
            let subTopicBox = await majParent.parentElement.querySelector( '.level2' );
            let spos = await majorTopics[ i ].dataset.id;
            let ctype = await majorTopics[ i ].dataset.ctype;
            let resFromApi = await axios.get( `/courseitemboxloader/${ctype}/${ spos }` );
            subTopicBox.innerHTML = await resFromApi.data;
            majorTopics[ i ].classList.add( 'topic-selected' );
            let subtopic = await majParent.parentElement.querySelector( '.stopic-selected' );
            await subtopicClick( subtopic, 'courseRecommendation' );
            await changeSubTopics( 'courseRecommendation' );
        } )
    }
}

function changeSubTopics( path ) {
    let subTopics = document.querySelectorAll( '.sub-topic' );
    for ( let i = 0; i < subTopics.length; i++ ) {
        subTopics[ i ].addEventListener( 'click', function ( event ) {
            subtopicClick( event.target, path );
        } )
    }
}
async function subtopicClick( subTopic, path ) {
    let subParent = await subTopic.parentElement;
    let siblings = subParent.querySelectorAll( '.sub-topic' );
    for ( let j = 0; j < siblings.length; j++ ) {
        siblings[ j ].classList.remove( 'stopic-selected' );
    }
    let cardBox = await subParent.parentElement.querySelectorAll( '.cards' );
    subTopic.classList.add( 'stopic-selected' );
    let categories = {
        courseRecommendation: [
            'crEngineering',
        ]
    };
    apiLoadderFun( cardBox, categories, path, '', 0 )
}

changeMajorTopics();
changeSubTopics( 'courseRecommendation' );
let qsearch = document.getElementById( 'qsearch' );
let delQsearch = document.getElementById( 'delQsearch' );
let qstr = check_cookie_name( 'QRY' );
if ( qsearch && qstr ) {
    let strObj = decodeURI( qstr );
    qsearch.textContent = strObj;
    let queryObject = updateQueryObject( 'searchAll', strObj );
    let newQueryStr = '?' + ( new URLSearchParams( queryObject ).toString() );
    qsearch.href = '/courses/search/' + newQueryStr;
}
if ( delQsearch )
    delQsearch.addEventListener( 'click', function ( event ) {
        if ( qstr ) {
            setCookieLifeTime( 'QRY', '', -1 );
            window.open( '/courses', '_self' ).focus();
        }
    } )

let savePC = document.getElementById( 'savePC' );
let editPC = document.getElementById( 'editPC' );
let deletePC = document.getElementById( 'deletePC' );
if ( savePC ) {
    savePC.addEventListener( 'click', function ( eve ) {
        let delBox = editPC.parentElement.parentElement.parentElement.querySelectorAll( '.deleteBox' );
        for ( let i = 0; i < delBox.length; i++ ) {
            delBox[ i ].classList.add( 'invisible' );
        }
        savePC.classList.add( 'invisible' );
        editPC.classList.remove( 'invisible' );

    } )
    editPC.addEventListener( 'click', function ( eve ) {
        let delBox = editPC.parentElement.parentElement.parentElement.querySelectorAll( '.deleteBox' );
        for ( let i = 0; i < delBox.length; i++ ) {
            delBox[ i ].classList.remove( 'invisible' );
        }
        editPC.classList.add( 'invisible' );
        savePC.classList.remove( 'invisible' );
    } )
    deletePC.addEventListener( 'click', function ( eve ) {
        setCookieLifeTime( 'MRC', '', -1 );
        let fullBox = editPC.parentElement.parentElement.parentElement;
        fullBox.classList.add( 'invisible' );
    } )

}