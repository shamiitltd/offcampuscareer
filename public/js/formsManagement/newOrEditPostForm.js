const chosenChoices = document.querySelectorAll( ".chosen-choices" );
const searchFields = document.querySelectorAll( ".search-field" );
const searchInputs = document.querySelectorAll( ".search-field input" );
const autocomBoxs = document.querySelectorAll( ".autocom-box" );
const experiencesSelect = document.querySelectorAll( ".experience select" );
const logoUrlVal = document.querySelector( '#logoUrlVal' );

if ( logoUrlVal ) {
    logoUrlVal.addEventListener( 'input', ( event ) => {
        const loadUrlImg = document.querySelector( '#loadUrlImg' );
        loadUrlImg.src = logoUrlVal.value;
    } )
}

const searchChoiceClose = document.querySelectorAll( '.search-choice-close' );
for ( let i = 0; i < searchChoiceClose.length; i++ ) {
    searchChoiceClose[ i ].addEventListener( 'click', ( event ) => {
        searchChoiceClose[ i ].parentElement.remove();
    } )
}


window.addEventListener( 'load', runAfterLoading );

function runAfterLoading() {
    const searchChoiceClose = document.querySelectorAll( '.search-choice-close' );
    for ( let i = 0; i < searchChoiceClose.length; i++ ) {
        searchChoiceClose[ i ].addEventListener( 'click', ( event ) => {
            searchChoiceClose[ i ].parentElement.remove();
        } )
    }
}


for ( let i = 0; i < searchFields.length; i++ ) {
    chosenChoices[ i ].addEventListener( 'click', ( e ) => {
        searchInputs[ i ].focus();
    } )
    if ( stringMatchWithPath( '/courses/organisation/new' ) ) {
        handleSearchInput( searchFields[ i ], autocomBoxs[ i ], [], i );
    } else if ( stringMatchWithPath( '/scholarships/new' ) || stringMatchWithPath( '/forwomen/new' ) ) {
        handleSearchInput( searchFields[ i ], autocomBoxs[ i ], suggestionScholarships, i );
    } else if ( stringMatchWithPath( '/courses/new' ) ) {
        handleSearchInput( searchFields[ i ], autocomBoxs[ i ], suggestionCourses, i );
    } else if ( stringMatchWithPath( '/sitemapscanner/new' ) || stringMatchWithPath( '/sitemapscanner/edit' ) ) {
        handleSearchInput( searchFields[ i ], autocomBoxs[ i ], suggExtentions, i );
    } else
        handleSearchInput( searchFields[ i ], autocomBoxs[ i ], suggestions, i );
}
// Experience select

function experienceSelectFunction() {
    if ( experiencesSelect.length ) {
        experienceOnChange( experiencesSelect[ 0 ], experiencesSelect[ 1 ], false );
        experienceOnChange( experiencesSelect[ 1 ], experiencesSelect[ 0 ], true );
    }
}

function experienceOnChange( minElement, maxElement, check ) {
    if ( minElement && maxElement ) {
        minElement.addEventListener( 'change', ( e ) => { // Minimum experience
            let indexMin = minElement.selectedIndex;
            let indexMax = maxElement.selectedIndex;
            let val = maxElement.options[ indexMax ].value;
            let selectedVal = minElement.options[ indexMin ].value;
            if ( val === '7' || val === '0' ) {
                val = '';
            }
            if ( selectedVal === '7' || selectedVal === '0' ) {
                selectedVal = '';
            }
            if ( val !== '' && selectedVal !== '' ) {
                if ( !check ) {
                    if ( indexMin > indexMax ) {
                        maxElement.selectedIndex = indexMin;
                    }
                } else if ( check ) {
                    if ( indexMin < indexMax ) {
                        maxElement.selectedIndex = indexMin;
                    }
                }
            }
        } )
    }
}
experienceSelectFunction();


function handleSearchInput( searchField, autocomBox, suggestedDataArray, index ) {
    const inputBox = searchField.querySelector( 'input' );
    let data;
    if ( index < suggestedDataArray.length )
        data = suggestedDataArray[ index ];
    inputBox.addEventListener( 'focus', ( event ) => {
        let emptyArray = [];
        for ( let i = 0; data && i < data.length; i++ ) {
            emptyArray.push( `<li data-option-array-index=${i}>${data[i]}</li>` );
        }
        closeAllDropdown();
        if ( data )
            autocomBox.parentElement.classList.add( 'active' );
        // console.log(userData);
        showSuggestions( emptyArray, inputBox, autocomBox );
        let allLi = autocomBox.querySelectorAll( 'li' );
        for ( let i = 0; i < allLi.length; i++ ) {
            allLi[ i ].addEventListener( 'click', function ( event ) {
                select( allLi[ i ], autocomBox.parentElement, searchField );
            } )
        }
    } );
    inputBox.addEventListener( 'input', ( e ) => {
        let userData = e.target.value;
        let emptyArray = [];
        if ( userData ) {
            for ( let i = 0; data && i < data.length; i++ ) {
                const suggestedValue = data[ i ].toLocaleLowerCase().includes( userData.toLocaleLowerCase() );
                if ( suggestedValue ) {
                    emptyArray.push( `<li data-option-array-index=${i}>${data[i]}</li>` );
                }
            }
            closeAllDropdown();
            autocomBox.parentElement.classList.add( 'active' );
            // console.log(userData);
            showSuggestions( emptyArray, inputBox, autocomBox );
            let allLi = autocomBox.querySelectorAll( 'li' );
            for ( let i = 0; i < allLi.length; i++ ) {
                allLi[ i ].addEventListener( 'click', function ( event ) {
                    select( allLi[ i ], autocomBox.parentElement, searchField );
                } )
            }
        } else {
            autocomBox.parentElement.classList.remove( 'active' );
        }
    } )
}


function select( element, searchwrap, searchfield ) {
    let selectUserData = element.textContent;
    filterInputTag( selectUserData, searchfield );
    searchwrap.classList.remove( 'active' );
    searchfield.querySelector( 'input' ).value = "";
}



function showSuggestions( list, inputbox, autocomBox ) {
    let listData;
    if ( list.length ) {
        listData = list.join( '' );
    } else {
        userData = inputbox.value;
        listData = `<li data-option-array-index=${-1}>${userData}</li>`;
    }
    autocomBox.innerHTML = listData;
}

function removeParentByChild( childnode ) {
    childnode.addEventListener( 'click', function ( event ) {
        event.stopPropagation();
        childnode.parentElement.remove();
    } )
}


function filterInputTag( textVal, lastSibling ) {
    let textKey = lastSibling.parentElement.id;
    const newLi = document.createElement( 'li' );
    const newSpan = document.createElement( 'span' );
    const inputTg = document.createElement( 'input' );
    const newAnchor = document.createElement( 'a' );
    newLi.setAttribute( 'class', 'search-choice' );
    newLi.setAttribute( 'data-key', textKey );
    newSpan.textContent = textVal;
    inputTg.setAttribute( 'class', 'invisible' );
    inputTg.setAttribute( 'type', 'text' );
    inputTg.setAttribute( 'name', textKey );
    inputTg.value = textVal;
    newAnchor.setAttribute( 'class', 'search-choice-close' );
    newAnchor.classList.add( 'fas' );
    newAnchor.classList.add( 'fa-times' );
    newAnchor.setAttribute( 'title', 'Remove this tag' )
    newAnchor.setAttribute( 'data-val', textVal );
    newLi.appendChild( newSpan );
    newLi.appendChild( inputTg );
    newLi.appendChild( newAnchor );
    lastSibling.insertAdjacentElement( 'beforebegin', newLi );
    removeParentByChild( newAnchor );
}

const jdbasic = document.getElementById( 'basicJD' );
const jdadvance = document.getElementById( 'advanceJD' );
const toggleBAM = document.getElementById( 'toggleBAM' );
const gov = document.getElementById( 'g' );
const organizationTypeB = document.getElementById( 'organizationTypeB' );
const organizationType = document.getElementById( 'organizationType' );
if ( jdbasic && jdadvance ) {
    toggleBAM.addEventListener( 'change', function () {
        if ( this.checked ) {
            jdadvance.hidden = false;
            jdbasic.hidden = true;
        } else {
            jdadvance.hidden = true;
            jdbasic.hidden = false;
        }
    } );
}
if ( organizationTypeB ) {
    g.addEventListener( 'change', function () {
        if ( this.checked ) {
            organizationTypeB.classList.remove( 'flex-row' )
            organizationTypeB.hidden = true;
            organizationType.value = "";
        } else {
            organizationTypeB.classList.add( 'flex-row' )
            organizationTypeB.hidden = false;
        }
        // console.log("Hit")
    } );

}