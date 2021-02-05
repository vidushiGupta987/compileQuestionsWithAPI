let  compileButton = document.getElementById("compileButton")
let lineNumberBox = document.getElementById("lineNumberBox")
let codeTextarea = document.getElementById("codeTextarea")
let languageSelection = document.getElementById("languageSelection")
let outputBox = document.getElementById("outputBox")

let lines = 1
for(lines; lines<15; lines++) {
    lineNumberBox.innerHTML += "<br/>" + (lines+1)
}

compileButton.addEventListener("click", function() {
    var request = new XMLHttpRequest();
    request.open("POST", "https://codequotient.com/api/executeCode");
    let data = {
        code : codeTextarea.value , 
        langId : languageSelection.value
    }
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(data))
    request.addEventListener("load", function(event) {
        let inputResponse = JSON.parse(event.srcElement.response)
        if(inputResponse.error != null) {
            alert(inputResponse.error)
        }
        else {
            let codeId = inputResponse.codeId
            compileButton.innerHTML = "Compiling"
            setTimeout(function() {
                var output = new XMLHttpRequest();
                output.open("GET", "https://codequotient.com/api/codeResult/" + codeId);
                output.send()
                output.addEventListener("load", function(event) {
                    console.log(event)
                    let outputResponse = JSON.parse(JSON.parse(event.srcElement.response).data)
                    if(outputResponse.output == null) {
                        alert("Some error occured, please try again.")
                    }
                    else {
                        if(outputResponse.output != "") {
                            outputBox.innerHTML = outputResponse.output
                        }
                        else {
                            outputBox.innerHTML = outputResponse.errors
                        }
                    }
                })
                compileButton.innerHTML = "Compile"
            }, 2500)
        }
    })
})

codeTextarea.addEventListener("keydown", function(event) {
    if(event.key == "Tab") {

        event.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

        this.selectionStart = this.selectionEnd = start + 1;
    }
    else if(event.key == "Enter") {
        let text = codeTextarea.value
        let lineCount = text.split(/\r*\n/).length + 1
        if(lineCount > lines) {
            lineNumberBox.innerHTML += "<br/>" + (++lines)
        }
    }
})

codeTextarea.addEventListener("scroll", function(event) {
    lineNumberBox.scrollTop = codeTextarea.scrollTop
})
