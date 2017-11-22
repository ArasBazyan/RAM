//var arrayTablesData = [{"idProject":652,"ProjectName":"VC700",
//						"ProjectDescription":"This a platform for blabla bla ",
//						"Version":1,"VersionLocked":"No","idManager":700,
//						"dateStart":"01.12.2017","dateEnd":"01.12.2018",
//						"StartofProduction":"01.08.2018","ProjectComments":"bla bla"}];

var isATag = true;
var mapp = [];


function adminViewTable(manager) {
	$.ajax({
		url: 'http://localhost:3000/adminView/' + manager,
		type: 'GET',
		dataType: 'html'
	}).done(function(data) {
			console.log(manager);
			if (data === 'null'|| data === 'undefined') {
					console.log("NOOOOO!");
			}
			mapp = JSON.parse(data);
			console.log(mapp);
			createTableHeader(['Project Name', 'Version', 'Status', 'Responsible Person', 'Delivery Date'], "myTable");
			insertTableData(3, mapp, isATag, "myTable");
	}).fail(function() {
			console.log("Something went wrong!");
	});
}
/*
jQuery.get('http://localhost:3000/projectDetail/700/1', function(data) {
		console.log("Post resposne:");
		console.dir(data);
		mapp = data;

});*/


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
				td.appendChild(clickAbleDirectedTo(text,"projectDetail"));
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
