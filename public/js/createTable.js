var arrayTablesData = [ { 'projectID': 'VC-900', 
					  	  'version' : '1',
					  	  'calculationStatus' : 'In Progress',
					  	  'responsiblePerson': 'Mike Hillary',
					  	  'deliveryDate': '2017-10-08' },
				    	
				    	{ 'projectID': 'QP-837', 
				      	  'version' : '2',
					  	  'calculationStatus' : 'Submitted',
					  	  'responsiblePerson': 'Nina Sharon',
					   	  'deliveryDate': '2017-10-08'},

					   	{ 'projectID': 'S-9299', 
				      	  'version' : '5',
					  	  'calculationStatus' : 'In Progress',
					  	  'responsiblePerson': 'Gustav Pelle',
					   	  'deliveryDate': '2018-01-30'},

					   	{ 'projectID': 'EU-872', 
				      	  'version' : '11',
					  	  'calculationStatus' : 'Submitted',
					  	  'responsiblePerson': 'Karl Karl',
					   	  'deliveryDate': '2017-11-16'},

					   	{ 'projectID': 'NT-982', 
				      	  'version' : '3',
					  	  'calculationStatus' : 'Submitted',
					  	  'responsiblePerson': 'N/A',
					   	  'deliveryDate': '2017-12-10'},
				      ];
var isATag = true;


/**
 * @param arrayString arrayHeader : you input the Headers that you want like createTableHeader[Header1, Header2]
 */
function createTableHeader(arrayHeader,elementId){
	const thead = document.createElement("THEAD");
	const tr = document.createElement("TR");
	for(let i = 0; i < arrayHeader.length; i++){
		let th = document.createElement("TH");
		let text = document.createTextNode(arrayHeader[i]);

		th.appendChild(text);
		tr.appendChild(th);
	}
	thead.appendChild(tr);
	document.getElementById(elementId).appendChild(thead);
}

/**
 * @param int headerLenght : lenght of how many header you have
 * @param arrayString arrayTablesData : the data
 * @param bool isATag
 */
function insertTableData(headerLength, arrayTablesData, isATag, elementId){
	const tablesDataKeys = Object.keys(arrayTablesData[0]);
	const tbody = document.createElement("TBODY");

	for(let i = 0; i < arrayTablesData.length; i++){
		let tr = document.createElement("TR");
		for(let j = 0; j < headerLength; j++){
			let tableData = arrayTablesData[i];
			let td = document.createElement("TD");
			let text = document.createTextNode(tableData[tablesDataKeys[j]]);

			if(j == 0 && isATag){ // if we need clickable modal
				td.appendChild(clickAbleDirectedTo(text,"index.html"));
			}
			else td.appendChild(text);

			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	document.getElementById(elementId).appendChild(tbody);
}

/** 
* @param element <text>
* @param string path: like index.html
* @return element <a>
*/
function clickAbleDirectedTo(text,path){
	let a = document.createElement("A");
	a.setAttribute("href",path);
	a.appendChild(text);
	return(a);
}

/** 
* @param element <text>
* @return element <a>
*/
function clickAbleModal(text){
	let a = document.createElement("A");
	a.setAttribute("type", "button");
	a.setAttribute("data-toggle", "modal");
	a.setAttribute("data-target", "#calculationSubmission");
	a.setAttribute("onclick", "setProjectID(this.innerHTML)");
	a.appendChild(text);
	return(a);
}


//createTableHeader(['Project Id', 'Version', 'Caculation', 'Responsible Person', 'Delivery Date'], "myTable");
//insertTableData(5, arrayTablesData, isATag, "myTable");


