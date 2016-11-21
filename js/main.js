/* This file will have all the mechanics of the app
 *
 * Programa que recibe una gramática regular y produce un autómata finito equivalente y viceversa.
 *
 *
 */

var EPSILON = 'ε';
var EXTRA_STATE = 'Ζ' // A greek letter that looks like Z but it's really Ζ or zeta


	var G = {
	R : {}, // Rules Dictionary
	Sigma : ['a', 'b', EPSILON], // Alphabet
	V : [], // Variables
	S : "", // Initial Variable
}

// Delta is a dictionary where the keys are the states and the values are arrays where columns represent each symbol in Sigma
/* Sample delta function mapping
Delta = {
"state1": {
"a": ["state1", "state2"],
"b": []
},
"state2": {
"a": ["state2"],
"b": ["state1"]
}

}
 */

var clearM = function () {
	M = {
		Q : [], // States
		Sigma : [], // Alphabet
		Delta : {}, // Transition Function matrix
		d0 : "", // Initial State
		F : [], // Final States
	}
}

var M = {
	Q : [], // States
	Sigma : [], // Alphabet
	Delta : {}, // Transition Function matrix
	d0 : "", // Initial State
	F : [], // Final States
}

parseAutomata = function (text) {
        var lines = text.split('\n');
        var varsRegex = /(.*?):{(.+)}/;
        
        var V  = new Array();
        var Σ,S,R;
        var temp = {};
        var error = false;
        separator = ',';
        
        $.each(lines, function (i, line) {
                if(line != "" && !error){
                        m = line.match(varsRegex);
                        //console.log(m);
                        if (m && m.length > 1) {
                                switch(m[1]){
                                        case 'Q':
                                                //Q
                                                V = m[2].split(separator);
                                                //console.log(V);
                                                //console.log("V: " + m[2].split(separator));
                                                break;
                                        case 'δ':
                                                //console.log("δ");
                                                //console.log(Object.keys(V).length);
                                                if(V.length != 0){
                                                        
                                                         $.each(V,function(i,state){
                                                                temp[state] = "";
                                                         });
                                                         //console.log(temp);
                                                        $.each(m[2].split(separator),function(i,rule){
                                                                
                                                                if(V.indexOf(rule.substring(0,1))!= -1 && Σ.indexOf(rule.substring(2,3))!=-1 && V.indexOf(rule.substring(5,6))!= -1){
                                                                        temp[rule.substring(0,1)] =  temp[rule.substring(0,1)]+rule.substring(2,3) +rule.substring(5,6) +"|";
                                                                        
                                                                }else{
                                                                        if(V.indexOf(rule.substring(0,1))== -1){
                                                                                console.log("State "+rule.substring(0,1)+" not in V");
                                                                        }
                                                                        if(V.indexOf(rule.substring(5,6))== -1){
                                                                                console.log("State "+rule.substring(5,6)+" not in V");
                                                                        }
                                                                        if(Σ.indexOf(rule.substring(2,3))== -1){
                                                                                console.log("Symbol "+rule.substring(2,3)+" not in Σ");
                                                                        }
                                                                        error = true;
                                                                }
                                                                //console.log(temp);
                                                                //console.log(rule);
                                                        });
                                                }
                                                break;
                                        case 'Σ':
                                               // console.log("Σ");
                                               //Q
                                                Σ = m[2].split(separator);
                                                //console.log("Σ: " + m[2].split(separator));
                                                break;
                                        case 'So':
                                                //console.log("So");
                                                //S
                                                if(Object.keys(m[2].split(separator)).length ==1){
                                                      S = m[2].split(separator);  
                                                }else{
                                                        if(Object.keys(m[2].split(separator)).length ==0){
                                                              console.log("No initial State provided");  
                                                        }else{
                                                              console.log("Multiple initial States provided");    
                                                        }
                                                        error = true;
                                                }
                                                
                                                //console.log("S: " + S);
                                                break;
                                        case 'F':
                                                //console.log("F");
                                                 $.each(m[2].split(separator),function(i,rule){
                                                        if(V.indexOf(rule.substring(0,1))!= -1){
                                                                        if(temp[rule.substring(0,1)] == ""){
                                                                             temp[rule.substring(0,1)] =  "ε";   
                                                                        }else{
                                                                                temp[rule.substring(0,1)] =  temp[rule.substring(0,1)]+"|ε";
                                                                        }
                                                                               
                                                        }else{
                                                                console.log("State not in V");
                                                                error = true;
                                                        }
                                                 });
                                                 //console.log (temp);
                                                break;
                                        default :
                                                console.log("Provided non valid Automata property");
                                                error = true;
                                                break;
                                }
                                for (var key in temp) {
                                        var value = temp[key];
                                        if(value.substring(value.length -1,value.length) == "|"){
                                                temp[key] = value.substring(0,value.length -1);
                                        }
                                        //console.log(value.length);
                                        // Use `key` and `value`
                                }
                                if(!error && Σ!=undefined && S!=undefined){
                                        R = temp;
                                        console.log("Σ: " + Σ);
                                        console.log("S: " + S);
                                        console.log("R: ");
                                        console.log(R);
                                        console.log("V: " + V);
                                }
                        }else{
                                console.log("Format error detected");
                                error = true;
                        }
                        
                }
                
        }); // END .each lines
        
}//End parseAutomata

// Takes the text from the textarea and parses it to populate G
parseRules = function (text) {

	// Reset M
	clearM();

	G.V = [];
	var varsRegex = /(.*?):(.*)/;
	var lines = text.split('\n');
	var lineNum = 1;
	var LOGS = [];

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

			// A variable can't be a symbol in the alphabet
			if (G.Sigma.indexOf(variable) > -1) {
				msg = 'Syntax Error line ' + lineNum + ' :\n\t variable "' + variable + '" is a symbol in Σ={\'' + G.Sigma.join("', '") + '\'}';
				LOGS[LOGS.length] = msg;
				console.log(msg);
				return true; // A continue in the loop
			}

			// Parse the rule
			if (m.length == 3) {
				var ruleStr = m[2];
				var transitions = ruleStr.split(separator);

				// Remove empty rules
				for (var index = 0; index < transitions.length; index++) {
					if (transitions[index] === "")
						transitions.splice(index--, 1);
				}

				G.R[variable] = transitions
					G.V[G.V.length] = variable; // Better performance than G.V.push(variable);

				// Use the first variable as the start rule
				if (lineNum === 1)
					G.S = variable;
			}
		} else {
			msg = 'Syntax Error line ' + lineNum + ' : Expected ":" after variable name.';
			console.log(msg);
			LOGS[LOGS.length] = msg;
		}
		lineNum++;
	}); // END .each lines

	// Validate the Syntax of the rules and remove from G the ones with errors.
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
				msg = "Syntax Error in rule definition " + key + ":"
					 + rules.join(separator) + "\n   At '" + aRule + "':"
					 + "\n      One or more symbols not in Σ={'" + G.Sigma.join("', '") + "'}"
					 + "\n      Or number of terminal symbols is different than 1";
				console.log(msg);
				LOGS[LOGS.length] = msg;
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
					msg = "Syntax Error in rule definition " + key + ":"
						 + rules.join(separator) + "\n   At '" + aRule + "':"
						 + "\n      Rule ends with symbols different from the variables V={'" + G.V.join("', '") + "'}"
						 + "\n      This can be caused by a previous rule breaking";
					console.log(msg);
					LOGS[LOGS.length] = msg;

					removeKey(key);

					// break for loop since the current rule has been removed
					break;
				}
			}
		}
	}

	console.log(G);
	GtoM();
	console.log(M);
	return true;
} // End Parse Rules

// Constructs the M object based on the G object passed
GtoM = function () {
	var LOGS = [];

	// Start with the initial state
	if (G.S.length) {
		M.d0 = G.S
			M.Sigma = G.Sigma.slice(); // Create a copy of Sigma
	} else {
		msg = "Error:\n\tNo initial state found";
		LOGS[LOGS.length] = msg;
		console.log(msg);
		return false;
	}

	var matchVariables = "(.*?)((" + G.V.join('|') + ").*$)";
	var re = new RegExp(matchVariables);

	// Traverse the rules and create the Delta function matrix
	$.each(G.V, function (i, variable) {
		var rules = G.R[variable];

		// Prevent errors
		if (rules === undefined) {
			msg = "Error:\n\tVariable '" + variable + "' not found in G.R";
			LOGS[LOGS.length] = msg;
			console.log(msg);
		}

		// Parse the rules in G.S[variable]
		for (var index = 0; index < rules.length; index++) {
			var aRule = rules[index];
			console.log("Parsing rule: " + aRule);

			var m = aRule.match(re);
			var varsInRule = "";
			if (m && m.length > 2) {
				varsInRule = m[2];
			}

			// Remove the variables from the rule string
			var terminalSymbol = aRule.replace(varsInRule, "");

			var state = variable;
			var nextState = varsInRule === "" && terminalSymbol !== EPSILON ? EXTRA_STATE : varsInRule;

			// Add the extra state if needed also mark it as Final state
			if (nextState === EXTRA_STATE && M.Delta[EXTRA_STATE] === undefined) {
				generateDeltaEntry(EXTRA_STATE, EPSILON, EXTRA_STATE);
				/*
				initM_Delta(EXTRA_STATE);
				if( M.F.indexOf(EXTRA_STATE) < 0 )
				M.F[M.F.length] = EXTRA_STATE;
				 */
			}

			generateDeltaEntry(state, terminalSymbol, nextState);

		} // End parse rule
	}); // END traverse each rules

} // END GtoM

// Ensure the state entry in Delta is initialized
var initM_Delta = function (state) {
	if (M.Delta[state] === undefined) {
		M.Delta[state] = {};
	}

	$.each(M.Sigma, function (index, symbol) {
		if (symbol === EPSILON)
			return;

		if (M.Delta[state][symbol] === undefined)
			M.Delta[state][symbol] = [];
	});

}
// Adds the transition to the Delta function matrix
var generateDeltaEntry = function (state, symbol, nextState) {
	console.log("Generating d(" + state + ", " + symbol + ") -> " + nextState);

	// Prevents write errors in the dictionary
	initM_Delta(state);

	// Add state to the M.Q array if not already there
	if (M.Q.indexOf(state) < 0)
		M.Q[M.Q.length] = state;

	// If it's a final state add it to the array M.F
	var isFinal = nextState === EXTRA_STATE || (symbol === EPSILON && nextState === "");
	if (isFinal && M.F.indexOf(state) < 0)
		M.F[M.F.length] = state;

	// Nothing else to do here
	if (symbol === EPSILON)
		return true;

	// Add a state to the transtition list if not already there  "d(state,symbol) -> nextState"
	if (M.Delta[state][symbol].indexOf(nextState) < 0)
		M.Delta[state][symbol].push(nextState);
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
                 if (document.activeElement && document.activeElement.id.toLowerCase() == "rule-input") 
                {       
                        parseRules(this.value);
                }
                else if(document.activeElement && document.activeElement.id.toLowerCase() == "automata-input"){
                        parseAutomata(this.value);
                }
	}).click();

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
        $('#sigma').click(function (e) {
		return insertSymbolIntoText("Σ", $("#automata-input"), e);
	});
        $('#delta').click(function (e) {
		return insertSymbolIntoText("δ", $("#automata-input"), e);
	});

	// Target a single one
	$("#rule-input").linedtextarea();
	
	  jQuery('.linedtextarea').on('focusin', function () { //JLV
       document.getElementById('rule-output').value="";
     });
    
    jQuery('.JLalpabhet').on('focusout', function () { //JLV 
          G.Sigma=this.value.split(",");
          G.Sigma.push(EPSILON);
          console.log(this.value.split(","));
     });//JLV

    jQuery('.getTran').on('click', function () { //JLV 
     
     for (var index = 0; index < Object.keys(M.Q).length; index++) {
         for (var ine = 0; ine < Object.keys(M.Sigma).length; ine++) {
            letra=M.Sigma[ine];
                if(M.Delta[M.Q[index]][letra] != "" && M.Delta[M.Q[index]][letra] != undefined){
                 document.getElementById('rule-output').value = document.getElementById('rule-output').value + "\n"+("* d(" + M.Q[index] + ", " + letra  + ") -> " + M.Delta[M.Q[index]][letra] );   
                }
          }
     }
     
     });//JLV



}

// All the code should run in this function
$(document).ready(function () {
	/* Code Starts Here */
	initUI();

});
