const popperArrows = document.querySelectorAll( ".popper-arrow" );
const cancelButtonAll = document.querySelectorAll( ".cancel-button" );
const popperButtonAll = document.querySelectorAll( ".popper-button" );
const popperPopupAll = document.querySelectorAll( ".popper-popup" );

let popperInstance = null;

//create popper instance
function createInstance( popperButton, popperPopup ) {
    popperInstance = Popper.createPopper( popperButton, popperPopup, {
        placement: "auto", //preferred placement of popper
        modifiers: [ {
                name: "offset", //offsets popper from the reference/button
                options: {
                    offset: [ 0, 8 ]
                }
            },
            {
                name: "flip", //flips popper with allowed placements
                options: {
                    allowedAutoPlacements: ["right", "left", "top", "bottom"],
                    // allowedAutoPlacements: [ "bottom" ],
                    rootBoundary: "viewport"
                }
            }
        ]
    } );
}

//destroy popper instance
function destroyInstance() {
    if ( popperInstance ) {
        popperInstance.destroy();
        popperInstance = null;
    }
}

//show and create popper
function showPopper( popperButton, popperPopup ) {
    popperPopup.setAttribute( "show-popper", "" );
    for ( popperArrow of popperArrows )
        popperArrow.setAttribute( "data-popper-arrow", "" );
    createInstance( popperButton, popperPopup );
}

//hide and destroy popper instance
function hidePopper( popperPopup ) {
    popperPopup.removeAttribute( "show-popper" );
    for ( popperArrow of popperArrows ) {
        popperArrow.removeAttribute( "data-popper-arrow" );
    }
    destroyInstance();
}

// set all popper for all buttons

popperButtonAll.forEach( ( popperButton, i ) => {
    popperButton.addEventListener( "click", function ( e ) {
        e.preventDefault();
        closeAll();
        showPopper( popperButton, popperPopupAll[ i ] );
    } );
} )

function closeAll() {
    popperPopupAll.forEach( ( popperPopup ) => {
        hidePopper( popperPopup );
    } )
}

function closeAllDropdown() {
    const allDropDown = document.querySelectorAll( ".search-suggestions" );
    for ( let i = 0; i < allDropDown.length; i++ ) {
        allDropDown[ i ].classList.remove( "active" );
    }
}

popperPopupAll.forEach( ( popperPopup, i ) => {
    cancelButtonAll[ i ].addEventListener( "click", function ( e ) {
        e.preventDefault();
        hidePopper( popperPopup );
    } )
} )


window.addEventListener( "click", function ( event ) {
    if ( !event.target.closest( ".chosen-container" ) ) {
        closeAllDropdown();
    }
    if ( !event.target.closest( ".popper-button, .popper-popup" ) ) {
        closeAll();
    }
} );