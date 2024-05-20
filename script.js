const search = document.querySelector("#show")
search.addEventListener("click",
    function(){
        fetch("data.json")
        .then ((Response => {
            return Response.json()
            }))
        .then((data=>{
            // console.log(data[0].BOROUGH)
            let container = document.getElementById("tableee");
            let table = document.createElement("table");
            let cols  = Object.keys(data[0]);
            let thead = document.createElement("thead");
            let tr    = document.createElement("tr");
            cols.forEach((item)=>{
                let th = document.createElement("th");
                th.innerText = item;
                tr.appendChild(th); 
                thead.appendChild(tr);
                table.appendChild(tr);
                })
            data.forEach((item)=> {
                let tr = document.createElement("tr");
                let vals = Object.values(item);
                vals.forEach((elem)=>{
                      let td  = document.createElement("td");
                      td.innerText  = elem;
                      tr.appendChild(td);
                    })
                    table.appendChild(tr);
                })
            container.appendChild(table)
            }))
        }
)
