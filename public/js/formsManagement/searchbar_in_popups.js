const qualifications = document.getElementById( 'qualification' );
const currencySelect = document.getElementById( 'currency' );
const companySizeSelect = document.getElementById( 'companySize' );

if ( qualifications && qualifications.tagName == "SELECT" )
    selectDropDown( qualifications, highestQualification );
selectDropDown( currencySelect, currency );
selectDropDown( companySizeSelect, companySize );

const chosenChoices = document.querySelectorAll( ".chosen-choices" );
const searchFields = document.querySelectorAll( ".search-field" );
const searchInputs = document.querySelectorAll( ".search-field input" );
const autocomBoxs = document.querySelectorAll( ".autocom-box" );
const experiencesSelect = document.querySelectorAll( ".experience select" );
const jobtypeElement = document.getElementById( 'jobtype' );
const clearAll = document.querySelector( '.clear-all' );
const searchForm = document.querySelector( '#submitform' );
const logoUrlVal = document.querySelector( '#logoUrlVal' );

if ( logoUrlVal ) {
    logoUrlVal.addEventListener( 'input', ( event ) => {
        const loadUrlImg = document.querySelector( '#loadUrlImg' );
        loadUrlImg.src = logoUrlVal.value;
    } )
}

// filters start
if ( clearAll ) {
    if ( clearAll.parentNode.firstElementChild === clearAll ) {
        clearAll.classList.add( 'invisible' );
    }

    clearAll.addEventListener( 'click', ( e ) => {
        e.stopPropagation();
        const searchChoiceClose = document.querySelectorAll( ".search-choice-close" );
        removeAllParentsByChild( searchChoiceClose );
        clearAll.classList.add( 'invisible' );
        formRefilling( searchForm );
        searchForm.submit();
    } )

}

const seletedFilter = document.querySelectorAll( '.selected-filters' );
for ( let i = 0; i < seletedFilter.length; i++ ) {
    seletedFilter[ i ].addEventListener( 'click', ( event ) => {
        seletedFilter[ i ].parentElement.remove();
        formRefilling( searchForm );
        if ( clearAll.parentNode.firstElementChild === clearAll ) {
            clearAll.classList.add( 'invisible' );
        }
        searchForm.submit();
    } )
}


window.addEventListener( 'load', runAfterLoading, false );

function runAfterLoading() {
    const seletedFilter = document.querySelectorAll( '.selected-filters' );
    for ( let i = 0; i < seletedFilter.length; i++ ) {
        seletedFilter[ i ].addEventListener( 'click', ( event ) => {
            seletedFilter[ i ].parentElement.remove();
            formRefilling( searchForm );
            if ( clearAll.parentNode.firstElementChild === clearAll ) {
                clearAll.classList.add( 'invisible' );
            }
            searchForm.submit();
        } )
    }
}

function formRefilling( form, id = '' ) {
    const searchChoiceClose = document.querySelectorAll( ".selected-filters" );
    let inputArr = [];
    for ( let i = 0; i < searchChoiceClose.length; i++ ) {
        let key = searchChoiceClose[ i ].parentElement.dataset.key;
        let val = searchChoiceClose[ i ].dataset.val;
        if ( form.elements[ key ] ) {
            if ( key === 'searchAll' || key === 'location' ) {
                form.elements[ key ].name = key;
                form.elements[ key ].value = val;
            } else if ( key === 'salary' || key === 'minexp' ) {
                let subkey = searchChoiceClose[ i ].parentElement.dataset.keySub;
                let subval = searchChoiceClose[ i ].dataset.valSub;
                form.elements[ key ].name = key;
                form.elements[ subkey ].name = subkey;
                if ( key === 'salary' ) {
                    if ( !form.elements[ key ].value ) {
                        form.elements[ key ].value = val;
                        form.elements[ subkey ].value = subval;
                    }
                } else {
                    if ( form.elements[ key ].value === '0' && form.elements[ subkey ].value === '7' ) {
                        form.elements[ key ].value = val;
                        form.elements[ subkey ].value = subval;
                    }
                }

            } else if ( !form.elements[ key ].value ) {
                form.elements[ key ].name = key;
                form.elements[ key ].value = val;
            } else {
                switch ( form.elements[ key ].type ) {
                    case 'checkbox':
                        form.elements[ key ].checked = !!val;
                        break;
                    case 'select-one':
                        form.elements[ key ].val = val;
                        break;
                    default:
                        inputArr.push( `<input type="text" name="${key}" value="${val}"  hidden>` );
                        break;
                }
            }
        } else {
            inputArr.push( `<input type="text" name="${key}" value="${val}"  hidden>` );
        }
    }

    if ( id ) {
        if ( form.elements[ 'id' ] ) {
            form.elements[ 'id' ].value = id;
        } else {
            inputArr.push( `<input type="text" name="id" value="${id}"  hidden>` );
        }
    }

    let newDiv = document.createElement( "div" );
    newDiv.innerHTML = inputArr.join( '' );
    form.appendChild( newDiv );
}
if ( searchForm ) {
    searchForm.addEventListener( 'submit', ( e ) => {
        formRefilling( searchForm );
    } )
}


// adding Job type
for ( let i = jobtype[ 0 ].length - 1; jobtypeElement && i >= 0; i-- ) {
    let divDataSubbox = document.createElement( 'div' );
    let inputCheckBox = document.createElement( 'input' );
    let labelCheckB = document.createElement( 'label' );
    divDataSubbox.setAttribute( 'class', 'data-subbox' );
    inputCheckBox.setAttribute( 'type', 'checkbox' );
    inputCheckBox.setAttribute( 'class', 's-checkbox' );
    inputCheckBox.setAttribute( 'id', jobtype[ 0 ][ i ] );
    inputCheckBox.setAttribute( 'name', jobtype[ 0 ][ i ] );
    inputCheckBox.setAttribute( 'value', jobtype[ 1 ][ i ] );
    // inputCheckBox.setAttribute('data-value', 'false');
    labelCheckB.setAttribute( 'for', jobtype[ 0 ][ i ] );
    labelCheckB.textContent = jobtype[ 1 ][ i ];
    divDataSubbox.appendChild( inputCheckBox );
    divDataSubbox.appendChild( labelCheckB );
    jobtypeElement.insertAdjacentElement( 'afterbegin', divDataSubbox );
}

function removeAllParentsByChild( searchChoiceClose ) {
    for ( let i = 0; i < searchChoiceClose.length; i++ ) {
        searchChoiceClose[ i ].parentElement.remove();
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
    } else
        handleSearchInput( searchFields[ i ], autocomBoxs[ i ], suggestions, i );
}
// Experience select

function experienceSelectFunction() {
    if ( experiencesSelect.length ) {
        selectDropDownIndexAsVal( experiencesSelect[ 0 ], experienceLevel );
        selectDropDownIndexAsVal( experiencesSelect[ 1 ], experienceLevel );
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


// Functions starts from here
function selectDropDown( selectElement, data ) {
    for ( let i = 0; selectElement && i < data.length; i++ ) {
        let newOption = new Option( data[ i ], data[ i ] );
        selectElement.options.add( newOption )
    }
}

function selectDropDownIndexAsVal( selectElement, data ) {
    for ( let i = 0; selectElement && i < data.length; i++ ) {
        let newOption = new Option( data[ i ], i + 1 );
        selectElement.options.add( newOption )
    }
}

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