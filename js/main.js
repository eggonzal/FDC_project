/* This file will have all the mechanics of the app
 *
 * Programa que recibe una gramática regular y produce un autómata finito equivalente y viceversa.
 *
 *
 */
var G = {
	R : {},
	Sigma : ['a', 'b', 'ε'],
	V : [],
	S : "",
}

var M = {
	Q     : [],
	Sigma : [],
	d0    : "",
	
}
parseRules = function (text) {
    
    G.V = [];
	var varsRegex = /(.*?):(.*)/;
	var lines = text.split('\n');
	var lineNum = 1;

	separator = '|';

	removeKey = function (key) {
		try {
			delete G.R[key];
			var index = G.V.indexOf(key);
			if (index > -1) {
				G.V.splice(index, 1);
			}
			if (G.S === key) {
				G.S = G.V.length ? G.V[0] : '';
			}

		} catch (err) {
			console.log(err);
		}
	}
    
	$.each(lines, function (i, line) {
		m = line.match(varsRegex);
		if (m && m.length > 1) {

			// Parse the variable name
			var variable = m[1];

			// Parse the rule
			if (m.length == 3) {
				var ruleStr = m[2];
				var transitions = ruleStr.split(separator);

				// Remove empty rules
				for (var index = 0; index < transitions.length; index++) {
					if (transitions[index] === "")
						transitions.splice(index, 1);
				}

				G.R[variable] = transitions
					G.V[G.V.length] = variable;

				// Use the first variable as the start rule
				if (lineNum === 1)
					G.S = variable;
			}
		} else
			console.log('Syntax Error line ' + lineNum + ' : Expected ":" after variable name.');
		lineNum++;
	});

	for (var key in G.R) {
		var rules = G.R[key];
		for (var index = 0; index < rules.length; index++) {
			var aRule = rules[index];
			var language = G.Sigma.join('');

			// Match not in language
			var matchVariables = "(.*?)((" + G.V.join('|') + ")+.*$)";
			var re = new RegExp(matchVariables);
			var m = aRule.match(re);
			var varsInRule = "";
			if (m && m.length > 2) {
				varsInRule = m[2];
			}

			// Remove the variables from the rule string
			var terminalSymbols = aRule.replace(varsInRule, "");

			/** Validate that all terminal symbols are contained in Sigma **/
			re = new RegExp("^[" + language + "]$");
			m = terminalSymbols.match(re);

			// Remove invalid syntax
			if (m === null) {
				console.log("Syntax Error in rule definition " + key + ":"
					 + rules.join(separator) + "\n   At '" + aRule + "':"
					 + "\n      One or more symbols not in Σ={'" + G.Sigma.join("', '") + "'}"
                     + "\n      Or number of terminal symbols is different than 1"
                );
				removeKey(key);

				// break for loop since the current rule has been removed
				break;
			}

			/** Validate that only variables are contained in the variable part **/
			if (varsInRule && varsInRule.length) {
				re = new RegExp("^(" + G.V.join('|') + ")?$");
				m = varsInRule.match(re);

				// Remove invalid syntax
				if (m === null) {
					console.log("Syntax Error in rule definition " + key + ":"
						 + rules.join(separator) + "\n   At '" + aRule + "':"
						 + "\n      Rule ends with symbols different from the variables V={'" + G.V.join("', '") + "'}"
						 + "\n      This can be caused by a previous rule breaking");
					removeKey(key);

					// break for loop since the current rule has been removed
					break;
				}
			}
		}
	}
    
    console.log(G);
    return true;
}

// create all the onclick on change etc. events here
initUI = function () {
	var lastFocus; // last textarea element focused

	// fix the scroll position
	var lastScrollLeft;
	var lastScrollTop;
	var lastScrollLeftRatio;
	$("textarea").blur(function () {
		lastFocus = this;
	}).on('keyup click', function () {
		lastScrollTop = this.scrollTop;
		lastScrollLeft = this.scrollLeft;
		lastScrollLeftRatio = this.scrollLeft / this.scrollWidth;
		parseRules(this.value);
	});

	/*
	 * @author
	 * @function
	 */
	insertSymbolIntoText = function (sym, $el) {
		var content = $el.val();
		var position = $el.getCursorPosition()
			var newContent = content.substr(0, position) + sym + content.substr(position);
		$el.val(newContent);

		if (lastFocus) {
			setTimeout(function () {
				setCaretPosition(lastFocus.id, position + 1);
			}, 10);
		}
		return (false);
	}

	// Function to set the cursor of a text area at certain position
	function setCaretPosition(elemId, caretPos) {
		var elem = document.getElementById(elemId);

		if (elem != null) {
			if (elem.createTextRange) {
				var range = elem.createTextRange();
				range.move('character', caretPos);
				range.select();
				return true;
			} else {
				if (elem.selectionStart || elem.selectionStart === 0) {
					elem.focus();
					elem.setSelectionRange(caretPos, caretPos);
					$(elem).scrollTop(lastScrollTop);
					elem.scrollLeft = lastScrollLeft * elem.scrollWidth + 7;
					return true;
				} else {
					elem.focus();
					$.event.trigger({
						type : 'keypress'
					});
					return false;
				}
			}
		}
	}

	$('#eps').click(function (e) {
		return insertSymbolIntoText("ε", $("#rule-input"), e);
	});

	// Target a single one
	$("#rule-input").linedtextarea();

}

// All the code should run in this function
$(document).ready(function () {
	/* Code Starts Here */
	initUI();

});
