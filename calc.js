var isPerformed = false;
var lastOperation = "";
var isDecimal= false;

document.addEventListener("click",(e)=>{
    var target = e.target;
    var exp = document.getElementById('display').value;
    if(target.id){
        expression(e.target.innerHTML);
        setDecimalFlag(exp,target.innerHTML);
    }
});

function peek(val){
    return val.charAt(val.length-1);
}

function trim(val,lim){
    return val.substring(0,val.length-lim);
}

function mpeek(exp){
    return exp.substring(0,exp.length-1).charAt(exp.length-2);
}

//sets decimal flag with value
function setDecimalFlag(exp,value){
    if(!isDecimal && value==="."){
        var i = exp.length-1;
        while(exp.charAt(i)!='.' && i>=0){
            i--;
        }
        if(i!=0){
            isDecimal=false;
        }
    }
}

//sets decimal flag while deleting or evaluating
function setDeciFlag(exp){
    var i = exp.length-1;
    while(i>=0 && exp.charAt(i)!='.'){
        i--;
    }
    if(i===-1){
        isDecimal=false;
    }else{
        isDecimal=true;
    }
}

//clears the input
function remove() {
    isPerformed= false;
    isDecimal=false;
    lastOperation= "";
    document.getElementById("display").value = "0";
}

//deletes recently added elements
function backspace() {
    var exp = document.getElementById('display').value;
    document.getElementById("display").value = exp.substring(0, exp.length - 1);
    setDeciFlag(document.getElementById('display').value);
}

//handles input
function expression(value) {
    var exp = document.getElementById("display").value;

    //replaces initial 0 with number
    if((exp===0 || exp=='0') && !isNaN(value)){
        exp="";
    }
    
    //prevents muliple decimal points for same operand
    if(isDecimal && value==="."){
        return;    
    }

    //concatinates 0 if operator follows dot
    if(isNaN(peek(exp)) && value==="."){
        exp+='0';
    }

    //sets flag
    if(isNaN(value)){
        lastOperation="";
        isDecimal = (value==='.')?true:false;
        isPerformed=false;
    }

    //prevents repetation of operators by replacing the recent added operator
    // does not replaces decimal point(.)
    if(isNaN(value) && value!='.' && isNaN(peek(exp)) && peek(exp)!='.'){
        exp = trim(exp,1)+value;
    }

    //default case
    else{
        exp += value.replaceAll(/\s/g, "");
    }
    document.getElementById("display").value = exp;
}

//handles keyboard input
function restrictInput(event){
    var temp = event.target.value;
    var exp = temp.substring(0,temp.length);
    var value = peek(exp);

    //prevents muliple decimal points for same operand
    if(isDecimal && value==="."){
        event.target.value = trim(event.target.value,1);
        return;    
    }

    //if operator occurs decimal flag is set to false
    if(isNaN(value) && value!="."){
        isDecimal=false;
    }

    //concatinates 0 if operator follows dot
    if((isNaN(mpeek(exp)) || mpeek(exp)==="") && value==="."){
        event.target.value=trim(event.target.value,1)+"0.";
    }

    //sets flag
    if(isNaN(value)){
        lastOperation="";
        isDecimal = (value==='.')?true:false;
        isPerformed=false;
    }

    //prevents repetation of operators by replacing the recent added operator
    // does not replaces decimal point(.)
    if(isNaN(value) && value!='.' && isNaN(mpeek(exp)) && mpeek(exp)!='.'){
        event.target.value = trim(exp,2)+value;
    }

    event.target.value = event.target.value.replace(/[^0-9+\-*./%]/g, '');
}


//Evaluates the expression
//checks precedence of the operator
function hasPrecedence(op1, op2) {
    if(op2=='%'){
        return 'true';
    }
    if ((op1 == "*" || op1 == "/") && (op2 == "+" || op2 == "-")) return false;
    else return true;
}

//performs actual operation
function perform(op, val1, val2){
    val1 = parseFloat(val1);
    val2 = parseFloat(val2);
    switch(op){
        case '+':
            return val2+val1;
        case '*':
            return val2*val1;
        case '/':
            return val2/val1;
        case '-':
            return val2-val1;
        case '%':
            return val2%val1;
    }
}

//performs operation
function calculate() {
    var exp = document.getElementById("display").value;
    
    if(exp===''){
        document.getElementById("display").value = "";
    }
    
    while(isNaN(exp.charAt(exp.length-1))){
        exp = exp.substring(0,exp.length-1);
    }
    
    if(!isPerformed){
        var i = exp.length-1;
        while((!isNaN(exp.charAt(i)) || exp.charAt(i)==='.') && i>=0){
            lastOperation=exp.charAt(i--)+lastOperation;
        }
        lastOperation=exp.charAt(i)+lastOperation;
        
    }

    if(!isNaN(lastOperation.charAt(0)) || lastOperation.charAt(0)==='.'){
        lastOperation="";
    }

    if(isPerformed){
        exp += lastOperation;
    }
    
    isPerformed = true;
    var op = [];
    var values = [];
    
    for(i = 0 ; i<exp.length ; i++){
        if(!isNaN(exp.charAt(i))){
            var temp = "";
            while(i<=exp.length && (!isNaN(exp.charAt(i)) || exp.charAt(i)==='.')){
                temp+=exp.charAt(i++);
            }
            values.push(temp);
            i--;
        }
        else if(isNaN(exp.charAt(i))){
            while(op.length!=0 && hasPrecedence(exp.charAt(i),op[op.length-1])){
                values.push(perform(op.pop(),values.pop(),values.pop()));
            }
            op.push(exp.charAt(i));
        }
    }
    while(op.length!=0){
        values.push(perform(op.pop(),values.pop(),values.pop()));
    }

    document.getElementById('display').value = values.pop();
    setDeciFlag(document.getElementById('display').value);
}