function buildNodeTable(subNodes) {
    
        console.log("inside buildNodeTable");
        
        var tableHeaders = ['Cost', 'Cost type', 'Value', 'Status'];
    
        var target = document.getElementById("nodeCostList");
    
        var title = document.createElement('h4');
        title.appendChild(document.createTextNode('Node 7'))
    
        target.append(title);
    
        var tbl = document.createElement('table');
        tbl.className = 'table table-striped table-bordered';
    
        var thead = document.createElement('thead');
        var tr = document.createElement('tr')
        var th;
        for (var i = 0; i<4; i++){
          th = document.createElement('th');
          th.appendChild(document.createTextNode(tableHeaders[i]));
          tr.appendChild(th);
        }
        thead.appendChild(tr);
        tbl.appendChild(thead);
    
        var tbody = document.createElement('tbody');
        var td;
        for (var i = 0; i < subNodes.length; i++){
          tr = document.createElement('tr');
            for (var key in data){
              td = document.createElement('td');
              td.appendChild(document.createTextNode(key));
              tr.appendChild(td);
            }
          tbody.appendChild(tr);
        }
        tbl.appendChild(tbody);
        target.appendChild(tbl);
    }
    
    function createSubNode(nodeName, nodeDescription){
      console.log("Name: " + nodeName + "description: " + nodeDescription)
    }