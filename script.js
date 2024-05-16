const input = document.getElementById("DataBuilding");
const ul = document.getElementById("tasklist");
function submit(){
    const li = document.createElement("li");
    li.innerText=input.value;
    if(input.value == ""){
        alert("input data is required")
    } else{
        ul.appendChild(li);
        li.addEventListener("click", 
            function(){
                ul.removeChild(li)
            }
        )
        input.value=""
        
    }
    
}
