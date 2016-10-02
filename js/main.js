/* This file will have all the mecanics of the app
 *
 * Programa que recibe una gramática regular y produce un autómata finito equivalente y viceversa.
 *
 *
 */


// create all the onclick on change etc. events here
initUI = function(){
    var lastFocus; // last textarea element focused
    var lastScrollLeft;
    var lastScrollTop;
    var lastScrollLeftRatio;

    // Prevent
    $("textarea").blur(function() {
       lastFocus = this;
    }).on('keyup click', function(){
       lastScrollTop  = this.scrollTop;
       lastScrollLeft = this.scrollLeft;
       lastScrollLeftRatio = this.scrollLeft/this.scrollWidth;
       console.log('click');
    });
    

    /*
     * @author
     * @function
     */
    insertSymbolIntoText = function(sym, $el, e){
        //e.preventDefault();
        //e.stopPropagation();

        var content = $el.val();
        var position = $el.getCursorPosition()
        var newContent = content.substr(0, position) + sym + content.substr(position);
        $el.val(newContent);

        if (lastFocus) {
            setTimeout(function() {setCaretPosition(lastFocus.id, position+1);}, 10);
        }
        console.log('ran');
        return(false);
    }

    // Function to set the cursor of a text area at certain position
    function setCaretPosition(elemId, caretPos) {
        var elem = document.getElementById(elemId);

        if(elem != null) {
            if(elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
                //console.log('range select');
                return true;
            }
            else {
                if(elem.selectionStart || elem.selectionStart === 0) {
                    elem.focus();
                    //$(elem).scrollTop(caretPos-1);
                    elem.setSelectionRange(caretPos, caretPos);
                    $(elem).scrollTop(lastScrollTop);
                    elem.scrollLeft = lastScrollLeft*elem.scrollWidth+7;
                    console.log(elem.scrollLeft);
                    console.log(elem.scrollWidth);
                    //$.event.trigger({ type : 'keypress' });
                    return true;
                }
                else{
                    elem.focus();
                    $.event.trigger({ type : 'keypress' });
                    //$(elem).scrollTop(caretPos);
                    //console.log('focused');
                    return false;
                }
            }
        }
    }

    $('#eps').click(function (e){

        return insertSymbolIntoText("ε", $("#rule-input"), e);
    });

    // Target a single one
    $("#rule-input").linedtextarea();

}

// All the code should run in this function
$(document).ready(function(){
    /* Code Starts Here */
    initUI();
});