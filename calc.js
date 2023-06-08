var isPerformed = false;
var lastOperation = "";
var isDecimal= false;

document.addEventListener("click",(e)=>{
    if(e.target.id){
        expression(e.target.innerHTML);
    }
});

function peek(val){
    return val.charAt(val.length-1);
}

function trim(val,lim){
    return val.substring(0,val.length-lim);
}

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

    //if operator occurs decimal flag is set to false
    if(isNaN(value) && value!="."){
        isDecimal=false;
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
    console.log(isDecimal)
    document.getElementById("display").value = exp;
}

function restrictInput(event){
    console.log("hello")
    var temp = event.target.value;
    var exp = temp.substring(0,temp.length-1);
    var value = peek(exp);
    console.log(exp+" "+value);

    // console.log("exp: "+exp.length);
    // if(exp.length==1 || isNaN(peek(exp))){
    //     event.target.value = "";
    // }

    // if(exp==="0" && !isNaN(exp.charAt(exp.length-1))){
    //     exp="";
    // }
    
    // if(isNaN(exp.charAt(exp.length-1)) && isNaN(exp.charAt(exp.length-2))){
    //     event.target.value = exp.substring(0,exp.length-2)+exp.charAt(exp.length-1);
    // }
    event.target.value = event.target.value.replace(/[^0-9+\-*./%]/g, '');
}

function remove() {
    isPerformed= false;
    isDecimal=false;
    lastOperation= "";
    document.getElementById("display").value = "0";
    console.log("cleared");
}

function backspace() {
    document.getElementById("display").value = document
    .getElementById("display")
    .value.substring(0, document.getElementById("display").value.length - 1);
    console.log("clicked");
}

function hasPrecedence(op1, op2) {
    if(op2=='%'){
        return 'true';
    }
    if ((op1 == "*" || op1 == "/") && (op2 == "+" || op2 == "-")) return false;
    else return true;
}

function perform(op, val1, val2){
    val1 = parseFloat(val1);
    val2 = parseFloat(val2);
    switch(op){
        case '+':
            // console.log(val2+'+'+val1)
            return val2+val1;
        case '*':
            // console.log(val2+'*'+val1)
            return val2*val1;
        case '/':
            // console.log(val2+'/'+val1)
            return val2/val1;
        case '-':
            // console.log(val2+'-'+val1)
            return val2-val1;
        case '%':
            return val2%val1;
    }
}
function calculate() {
    var exp = document.getElementById("display").value;
    console.log(lastOperation +" "+ isPerformed);
    
    if(exp===''){
        document.getElementById("display").value = "";
    }
    
    while(isNaN(exp.charAt(exp.length-1))){
        exp = exp.substring(0,exp.length-1);
    }
    console.log(exp);
    
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
    console.log(lastOperation)
    
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
}