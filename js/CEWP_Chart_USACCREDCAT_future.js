console.log("connected USACC REDCAT");

var CG = CG || {};
CG.AJAX = CG.AJAX || {};
CG.DASHBOARD = CG.MYDASHBOARD || {};
CG.DASHBOARD.CHARTS = CG.DASHBOARD.CHARTS || {};
CG.DASHBOARD.CHARTS.VARIABLES = CG.DASHBOARD.CHARTS.VARIABLES || {};

CG.DASHBOARD.CHARTS.VARIABLES.USACCREDCAT = {
	site: null,
	j: null,
	//loc: String( window.location ),
	waitmsg: null,
	title: null,
	data: null,
	json: null,
	qry: null,
	html: "",
	loading: true,
	loaded: false,
	redcats: {},
	currentfilter: 2020,
	filteroptions: []//,
	//showModal: false,
	//isdev: false
};

CG.DASHBOARD.CHARTS.USACCREDCAT = function () {
	var v = CG.DASHBOARD.CHARTS.VARIABLES.USACCREDCAT;

	function Init( site, qry ){
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		if ( inDesignMode === "1" ) {
			$( "#usaccredcat" ).html( "" ).append( "<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>" );
		}
		else {
			GetRedcats();
		}
	}

	function GetRedcats() { 
		var urlString = "https://hq.tradoc.army.mil/sites/CPG/_vti_bin/listdata.svc/USACC_REDCAT?$select=Id,FY,REDCATValue,NoCadets&$orderby=FY,REDCATValue";
		console.log( "In getTaskers. url called USACCREDCAT Chart: ", urlString );
		var pseries = [];
		jQuery.ajax({
			url: urlString,
			method: "GET",
			async: false,
			headers: { 'accept': 'application/json; odata=verbose' },
			error: function ( jqXHR, textStatus, errorThrown ){
				logit( "Error Status: " + textStatus + ":: errorThrown: " + errorThrown );
			},
			success: function ( data ){
				v.loading = false;
				v.loaded = true;
				var itemfyfilter = '';
				v.j = jQuery.parseJSON( JSON.stringify( data.d.results ) );
				console.log( "getredcats v.j: ", v.j );

				// get values for filter by year droplist
				for ( var i = 0; i < v.j.length; i++ ) {
					itemfyfilter = v.j[i]["FY"];
					// get unique values of FY for the filter
					if ( v.filteroptions.indexOf( itemfyfilter ) === -1 ) v.filteroptions.push(itemfyfilter);
				}
				console.log( "redcats filter options", v.filteroptions );
				loadFilter();				
			}
		} );
		//drawChart( v.redcats.chartdata);
	}

	function loadFilter()
	{
		// load v.filteroptions in the  droplist
		for ( i = 0; i < v.filteroptions.length; i++ ) {
			$( "#filtervalue" ).append( "<option value='" + options[i] + "'" + ">" + v.filteroptions[i] + "</option>" );
			// display the current selected filter value   
			// the code sets everything to v.currentfilter
			$( "#filtervalue" ).val( v.currentfilter );
		}
		loadCharttData( v.j );
	}

	function changeFilterVal()
	{
		// Get the filter value 
		var selectedValue = $( "#filtervalue" ).val();
		// set v.currentfilter to the selected value
		v.currentfilter = selectedValue; 
		// refresh display 
		loadCharttData( v.j );
	}

	function loadCharttData(j)
	{
		var fy = [];  // for series by year if desired later
		var aa = [];  // African-American
		var ai = [];  // American-Indian
		var as = [];  // Asian
		var cac = []; // Caucasian
		var his = []; // Hispanic
		var oth = []; // Other

		var aaCount = 0;
		var aiCount = 0;
		var asCount = 0;
		var cacCount = 0;
		var hisCount = 0;
		var othCount = 0;
		var itemfy = '';

		for ( i = 0; i < j.length; i++ ) {
			itemfy = j[i]["FY"];
			if ( itemfy === v.currentfilter ) {
				var eth = j[i]["REDCATValue"];
				switch ( true ) {
					case  eth === "African-American" :
						aa.push( {
							"ID": j[i]["Id"],
							"fy": j[i]["FY"],
							"noc": j[i]["NoCadets"]
						} );
						aaCount = j[i]["NoCadets"];
						break;

					case  eth === "American-Indian" :
						ai.push( {
							"ID": j[i]["Id"],
							"fy": j[i]["FY"],
							"noc": j[i]["NoCadets"]
						} );
						aiCount = j[i]["NoCadets"];
						break;

					case  eth === "Asian" :
						as.push( {
							"ID": j[i]["Id"],
							"fy": j[i]["FY"],
							"noc": j[i]["NoCadets"]
						} );
						asCount = j[i]["NoCadets"];
						break;

					case  eth === "Caucasian" :
						cac.push( {
							"ID": j[i]["Id"],
							"fy": j[i]["FY"],
							"noc": j[i]["NoCadets"]
						} );
						cacCount = j[i]["NoCadets"];
						break;

					case  eth === "Hispanic" :
						his.push( {
							"ID": j[i]["Id"],
							"fy": j[i]["FY"],
							"noc": j[i]["NoCadets"]
						} );
						hisCount = j[i]["NoCadets"];
						break;

					case  eth === "Other" :
						oth.push( {
							"ID": j[i]["Id"],
							"fy": j[i]["FY"],
							"noc": j[i]["NoCadets"]
						} );
						othCount = j[i]["NoCadets"];
						break;
				}
			}
		}
		console.log( "aa: ", aa, "ai: ", ai, " as: ", as, " cac: ", cac, " his: ", his, " oth: ", oth );

		v.redcats.aa = aa;
		v.redcats.ai = ai;
		v.redcats.as = as;
		v.redcats.cac = cac;
		v.redcats.his = his;
		v.redcats.oth = oth;

		console.log( "v.redcats.aa: ", v.redcats.aa, " v.redcats.ai: ", v.redcats.ai, "v.redcats.as: ", v.redcats.as, " v.redcats.cac: ", v.redcats.cac, " v.redcats.his: ", v.redcats.his, " v.redcats.oth: ", v.redcats.oth );

		v.redcats.aaCount = aaCount;
		v.redcats.aiCount = aiCount;
		v.redcats.asCount = asCount;
		v.redcats.cacCount = cacCount;
		v.redcats.hisCount = hisCount;
		v.redcats.othCount = othCount;

		console.log("number of v.redcats: aa: ", v.redcats.aaCount, " ai: ", v.redcats.aiCount, " as: ", v.redcats.asCount, " cac: ", v.redcats.cacCount, " his: ", v.redcats.hisCount, " oth: ", v.redcats.othCount);

		v.redcats.chartdata = [
			{ 'name': 'African-American', 'y': v.redcats.aaCount },
			{ 'name': 'American-Indian', 'y': v.redcats.aiCount },
			{ 'name': 'Asian', 'y': v.redcats.asCount },
			{ 'name': 'Caucasian', 'y': v.redcats.cacCount },
			{ 'name': 'Hispanic', 'y': v.redcats.hisCount },
			{ 'name': 'Other', 'y': v.redcats.othCount }
		];

		console.log( "v.redcats.chartdata: ", v.redcats.chartdata );
		drawChart( v.redcats.chartdata);
	}

	function drawChart( ser ) {
		console.log( 'In REDCATS drawChart' );
		//Highcharts.chart( 'containerpie', {
		$( '#containerredcats' ).highcharts( {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			colors: ["black", "brown", "yellow", "pink", "orange", "green"],
			credits: { enabled: false },
			title: {
				//empty to save space
				text: ' '
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.y}</b>'
			},
			accessibility: {
				point: {
					valueSuffix: 'Cadets'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					//cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y}',
						style: {
							color: Highcharts.theme && Highcharts.theme.contrastTextColor || 'black'
						}
					}
				}//,
				//series: {
				//	cursor: 'pointer',
				//	point: {
				//		events: {
				//			click: function (a)
				//			{ 
				//				var de = document.createElement( 'p' );
				//				de.innerHTML = buildTable( a.point.name );
				//				var options = SP.UI.$create_DialogOptions();
				//				//console.log( "a.point.name : ", a.point.name );
				//				options.title =	FormatTitle( a.point.name );
				//				options.width = 800;
				//				//options.height = 600;
				//				//options.autosize = true;
				//				options.html = de;
				//				//options.dialogReturnValueCallback = SP.UI.ModalDialog.commonModalDialogClose( SP.UI.DialogResult.Cancel, yourOkFn());
				//				//options.dialogReturnValueCallback = SP.UI.DialogResult.Cancel, yourOkFn();
				//				SP.UI.ModalDialog.showModalDialog( options );
				//				//$( ".ms-dlgDisable" ).hide();
				//			}
				//		}
				//	}
				//}
			},
			series: [{
				name: 'Cadets',
				colorByPoint: true,
				data: ser
			}]
		});

		updated();
	}

	function updated() {
		v.loading = false;
		v.loaded = true;
	}

	////used for vue version 
	//function showtable( name )	{
	//	if ( name !== 0 ) {
	//		$( ".table-taskers" ).hide();
	//		$( '"#' + name + '"' ).append( v.html );
	//		$( "#tbl" + name ).show();
	//		$( '#taskertable' ).modal( 'show' );
	//		$( ".ms-dlgDisable" ).hide();
	//	}
	//}	 

	//function popup( id, title, body ){
	//	$( "#tdBody" ).html( body ); //
	//	console.log( "Body: " + $( "#tdBody" ).html() ); //
	//	//console.log("popup in TaskersChart");
	//}

	//function closepopup() {
	//	//this.showModal = false;
	//	$( '#taskertable' ).modal( 'hided' );
	//	$( ".ms-dlgDisable" ).show();
	//	//alert("You\'re OK");
	//}

	//function yourOkFn()	{
	//	$( ".ms-dlgDisable" ).show();
	//	//alert("You\'re OK");
	//}

	//function FormatTitle( z ) {
	//	//console.log( "in FormatTitle" );
	//	//console.log( "z into title: ",z );
	//	var title = "";
	//	switch ( z ) {
	//		//case "nosdate":
	//		case "NoSDate":
	//			//title = "No Suspense Date (" + this.NOSCount + ")";
	//			//title = "No Suspense Date (" + v.redcats.NOSCount + ") Taskers";
	//			title = v.redcats.NOSCount + " Taskers with No Suspense Date";
	//			break;
	//		//case "overdue":
	//		case "Overdue":
	//			//title = "Overdue (" + this.OCount + ")";
	//			//title = "Overdue (" + v.redcats.OCount + ") Taskers";
	//			title = v.redcats.OCount + " Taskers Overdue";
	//			break;
	//		//case "duetoday":
	//		case "DueToday":
	//			//title = "Due Today (" + this.DTCount + ")";
	//			//title = "Due Today (" + v.redcats.DTCount + ") Taskers";
	//			title = v.redcats.DTCount + " Taskers Due Today";
	//			break;
	//		//case "thirty":
	//		case "Thirty":
	//			//title = "Due In 30 Days (" + this.TCount + ")";
	//			//title = "Due in 30 Days (" + v.redcats.TCount + ") Taskers";
	//			title = v.redcats.TCount + " Taskers Due in 30 Days";
	//			break;
	//		//case "sixty":
	//		case "Sixty":
	//			//title = "Due In 60 Days (" + this.SCount + ")";
	//			title = "Due in 60 Days (" + v.redcats.SCount + " Taskers";
	//			title = v.redcats.SCount + " Taskers Due in 60 Days";
	//			break;
	//		//case "ninety":
	//		case "Ninety":
	//			//title = "Due In 90 Days (" + this.NCount + ")";
	//			//title = "Due in 90 Days (" + v.redcats.NCount + ") Taskers";
	//			title = v.redcats.NCount + " Taskers Due in 90 Days"; 
	//			break;
	//		//case "gtninety":
	//		case "GtNinety":
	//			//title = "Due in More than 90 Days (" + this.GTNCount + ")";
	//			//title = "Due in More Than 90 Days (" + v.redcats.GTNCount + ") Taskers";
	//			title = v.redcats.GTNCount + " Taskers Due in More Than 90 Days"; 
	//			break;
	//	}
	//	return title;
	//}

	//function formatDate( d ){
	//	return d === null ? "" : moment( d ).add( 8, 'hours' ).format( "MM-DD-YYYY" );
	//}

	//function buildTable( z ){
	//	//console.log( "in writeTable" );
	//	v.html = "<table id='tblNoSDate' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>" +
	//		"<thead>" +
	//			"<tr><th class='control'>Control</th><th class='suspense'>Suspense</th><th>Title</th><th class='tasklead'>Leads</th></tr>" +
	//		"</thead>" +
	//		"<tbody>";
	//	z = z.toLowerCase();
	//	//console.log( "v.redcats: ", v.redcats );
	//	//console.log( "z: ", z );
	//	var taskz = v.redcats[z];
	//	for ( i = 0; i < taskz.length; i++ ) {
	//		v.html += "<tr>";
	//		v.html += '<td class="' + 'control">' + taskz[i]["ControlNumber"] + "</td>";
	//		v.html += '<td class="' + "suspense" + '">' +  formatDate( taskz[i]["SuspenseDate"])  + "</td>";
	//		v.html += '<td>' + taskz[i]["TaskerName"] + '</td>';
	//		v.html += '<td class="' + 'tlead">' + taskz[i]["TaskerLeads"] + '</td>';
	//		v.html += "</tr>";
	//	}
	//	v.html += "</tbody></table>";
	//	return v.html;
	//}

	return {
		Init: Init
	};
};
SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('CEWP_Chart_USACCREDCAT.js');