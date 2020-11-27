function addData() {
    let table = document.getElementById("tableData");
    let newId = table.children.length+1;
    let newRow = table.insertRow();
    newRow.id = "row" + newId;                                                                              //add count
   
    for (let i = 0; i < 10; i += 1) {                                                                       //add cells
        let newCell = newRow.insertCell(); 
        if(i == 0){
            let inputField = document.createElement("input");
            inputField.type = "text";
            inputField.value = newId;
            inputField.readOnly = 1; 
            newCell.appendChild(inputField);
            continue;     
        }
        if (i == 9) {                                                                                       //add buttons
            let editButton = document.createElement("input");
            editButton.type = "button";
            editButton.value = "Edit";
            editButton.onclick = editData;
            let deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.value = "Delete";
            deleteButton.onclick = deleteData;
            newCell.appendChild(editButton);
            newCell.appendChild(deleteButton);
            break;
        }        
        let inputField = document.createElement("input");
        inputField.type = "text";
        newCell.appendChild(inputField);
        
    }
}


function editData(){                                                                                        //sets readonly to 0
    let x = this.parentNode.parentNode.id;
    let cells = document.getElementById(x).getElementsByTagName("td");
    for(let i =0; i < cells.length; i +=1){
        if(i == 0 || i == 9)
        continue;
        cells[i].children[0].readOnly = 0;
    }
}


function deleteData(){                                                                                      //deleting row
    let bool = confirm("Delete data?");
    if(bool){
        let x = this.parentNode.parentNode.id;
        let oldId = document.getElementById(x).children[0].children[0].value;
        document.getElementById("row"+oldId).parentNode.removeChild(document.getElementById("row" + oldId));
        let rows = document.getElementById("clientData").getElementsByTagName("tr");
        for(let i = 1; i < rows.length; i +=1){
            let id = rows[i].children[0].children[0].value;
            if(id > oldId){
                id -=1
                rows[i].children[0].children[0].value = id;
                rows[i].id = "row" + id;
            }
        }
    }
}

function submitResults(){                                                                                   //submitting and adding data to local storage
    let cells = document.getElementById("tableData").getElementsByTagName("td");
    for(let i = 0; i < cells.length; i +=1)
    cells[i].children[0].readOnly = 1;
    localStorage.clear();
    localStorage.setItem("dataJson", getJSONData());
}   

function sortByCol(x){                                                                                      //sorting data
    let theadRow = document.getElementById("clientData").getElementsByTagName("th");
    let rowStat = theadRow[x].getAttribute("rowStatus");
  
    let rows = document.getElementById("tableData").getElementsByTagName("tr");
    let k = rows.length;

    function isSorted(col){
        for(let i = 1; i < rows.length; i +=1){
            tempRow1 = ""+rows[i-1].children[col].children[0].value;
            tempRow2 = ""+rows[i].children[col].children[0].value;
            if(!isFirstStrHigher(tempRow1, tempRow2))
                return false;
        }
        return true;
    }

    while(!isSorted(x)){        
        k = Math.trunc(k / 2); 
        if (k == 0)
            k = 1; 
        for(let i = k; i < rows.length; i+=k){
            let tempRow1 = ""+rows[i-k].children[x].children[0].value;
            let tempRow2 = ""+rows[i].children[x].children[0].value;
            if(!isFirstStrHigher(tempRow1, tempRow2))
                swapRows(i-k, i);
        }
    } 
    if(rowStat == "0" || rowStat == "-1"){
        theadRow[x].setAttribute("rowStatus", "1");
        for(let i = 0; i < theadRow.length; i+=1)
            if(i!=x)
            theadRow[i].setAttribute("rowStatus", "0");
        return;
        
    }
    if(rowStat == "1"){
        turnSortedRows();
        theadRow[x].setAttribute("rowStatus", "-1");
        for(let i = 0; i < theadRow.length; i+=1)
            if(i!=x)
            theadRow[i].setAttribute("rowStatus", "0");
        return;
    }
}   


function isFirstStrHigher(s1, s2){ 
    if(s1 == s2)
        return true;                                                                         //returnes true is 1st str must be higher and false in othe case
    if(s1 =="" && s2 == "")
        return true;
    if(s1 == "" && s2 != "")
        return false;
    if(s2 == "" && s1 != "")
        return true;
    if(s1!= "" && s2 != ""){
        if(!Number.isNaN(+s1) && !Number.isNaN(+s2))
            {
                if(+s1 <= +s2)
                    return true;
                if(+s1 > +s2)
                    return false;
            }
        let str1 = s1.split("");
        let str2 = s2.split("");
        let k = str1.length;
        if(str1.length >= str2.length)
            k = str2.length;
        let numb1 = "";
        let numb2 = "";
        for(let i = 0; i < k; i+=1){
            let a = str1[i];
            let b = str2[i];
            if(a == " "){
                if(b == " ")
                    continue;
                return true;
            }
            if(b == " ")
                return false;                
            if(Number.isNaN(+a)){
                if(Number.isNaN(+b)){
                    if(+numb1 != +numb2){
                        if(+numb1 > +numb2)
                            return false;
                        if(+numb1 < +numb2)
                            return true;
                        if(+numb1 == +numb2){
                             numb1 = "";
                             numb2 = "";
                        }     
                    }
                    if(a.toUpperCase() == b.toUpperCase())
                        continue;
                    if(a.toUpperCase() < b.toUpperCase())
                        return true;
                    if(a.toUpperCase() > b.toUpperCase())
                        return false;
                }                    
                return false;
            }
            if(Number.isNaN(+b))
                return true;
            if(!Number.isNaN(+a) && !Number.isNaN(+b)){
                numb1 +=a;
                numb2 +=b;
                continue;
            }            
            if(i == k-1)
                return true;
        }
    }
}

function turnSortedRows(){
    let rowsCount = document.getElementById("tableData").getElementsByTagName("tr").length;
    for(let i = 0; i<= Math.trunc(rowsCount/2-1); i+=1 )
        swapRows(i, rowsCount-i-1);
}

function swapRows(RowNum1, RowNum2){                                                                        //swap 2 rows
    let row1 = document.getElementById("tableData").children[RowNum1];
    let row2 = document.getElementById("tableData").children[RowNum2];
    let temp;
    for(let i = 0; i< row1.children.length; i+=1){
        temp = row1.children[i].children[0].value;
        row1.children[i].children[0].value = row2.children[i].children[0].value;
        row2.children[i].children[0].value = temp;
    }
    temp = row1.id;
    row1.id = row2.id;
    row2.id = temp;
}


function searchData(){                                                                                      //script for searching data
    let x = document.getElementById("search").value.trim(); 
    let arr = document.querySelectorAll("tbody.tableData > tr > td");      
    if(x != ""){
        let count = 0;
        let bool = true;
        arr.forEach(function (elem) {    
            count +=1;   
            if((""+elem.children[0].value).search(x) == -1){
               let a = Math.trunc(count/10);
               if(a == count/10 && count != 0){
                   if(bool){
                   document.getElementById("tableData").children[a-1].classList.add("hide");
                }
                bool = true;
               }
               
            }                
            if((""+elem.children[0].value).search(x) != -1){
                bool = false;
                let a = Math.trunc(count/10);
                document.getElementById("tableData").children[a].classList.remove("hide");
            }
        })
    }
    if(x == ""){
        arr = document.querySelectorAll("tbody.tableData > tr");
        arr.forEach(function (elem) {
            elem.classList.remove("hide");
        })
    }
}

function readFile(input) {
    let file = input.files[0];  
    let reader = new FileReader();
    let data = "";  
    reader.readAsText(file);  
    reader.onload = function() {
      data = reader.result;
      if(data == "")
        alert("incorrect input");
      if(data != ""){
          data = JSON.parse(data);
          uploadData(data);
        }
    } 
    reader.onerror = function() {
      console.log(reader.error);
    }
}

function uploadData(arr){
    for(let i = 0; i < arr.length; i+=1){
        addData();
        let rows = document.getElementById("tableData").getElementsByTagName("tr");
        let lastRow = rows[rows.length-1];
        let rowSize = lastRow.children.length;
        let l = 0;
        for(let key in arr[i]){
            l+=1;
            let a = arr[i][key];
            lastRow.children[l].children[0].value = arr[i][key];
        }
    }
}

function getJSONData(){
    let rows = document.getElementById("tableData").getElementsByTagName("tr");
    let col = rows[0].children.length;
    let data = [];
    for(let i = 0; i < rows.length; i+=1){        
        let d = {};
        d.id = rows[i].children[1].children[0].value;
        d.age = rows[i].children[2].children[0].value;
        d.name = rows[i].children[3].children[0].value;
        d.gender = rows[i].children[4].children[0].value;
        d.company = rows[i].children[5].children[0].value;
        d.email = rows[i].children[6].children[0].value;
        d.phone = rows[i].children[7].children[0].value;
        d.adress = rows[i].children[8].children[0].value;    
        data.push(d);   
    }
    let txtJSON = JSON.stringify(data);
    return txtJSON;
}