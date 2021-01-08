console.log("connected TaskersTracker");
//var showModal = false;		// used when doing vue
//var isdev = false;

var TT = TT || {};
TT.AJAX = TT.AJAX || {};
TT.DASHBOARD = TT.MYDASHBOARD || {};
TT.DASHBOARD.CHARTS = TT.DASHBOARD.CHARTS || {};
TT.DASHBOARD.CHARTS.VARIABLES = TT.DASHBOARD.CHARTS.VARIABLES || {};

TT.DASHBOARD.CHARTS.VARIABLES.TASKERSTRACKER = {
	loading: true,				// used by both drawChart() and ajax call
	loaded: false,				// used by both drawChart() and ajax call
	taskers: {},				// used in almost every function
	subforsymbol:">Ninety"		// highcharts does not like ">" as a character
};

TT.DASHBOARD.CHARTS.TASKERSTRACKER = function () {
	var v = TT.DASHBOARD.CHARTS.VARIABLES.TASKERSTRACKER;

	function Init( site, qry ){
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		if ( inDesignMode === "1" ) {
			$( "#catstaskers" ).html( "" ).append( "<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>" );
		}
		else {
			startMeUp();
		}
	}

	function startMeUp()
	{
		jQuery(document).ready(function () {		
			SP.SOD.executeOrDelayUntilScriptLoaded(function () {
				var SLASH = "/";
				var tp1 = new String(window.location.protocol);
				var tp2 = new String(window.location.host);
				var tp3 = L_Menu_BaseUrl;
				var localSite = tp1 + SLASH + SLASH + tp2 + tp3;

				getFilterstring( localSite );

			}, "sp.js" );
		} );
	}

	function getFilterstring( localSiteURL )
	{
		// checking validity of value sent by startMeUp()
		//console.log( "String( window.location ): ", String( window.location ) ); 
		var fUrlString = localSiteURL + "/_vti_bin/listdata.svc/CATSTaskersFilterValue?$select=Id,FilterValue";

		console.log( "filtering rest call url: ", fUrlString );
		jQuery.ajax({
			url: fUrlString,
			method: "GET",
			async: false,
			headers: { 'accept': 'application/json; odata=verbose' },
			error: function ( jqXHR, textStatus, errorThrown ){
				logit( "Error Status: " + textStatus + ":: errorThrown: " + errorThrown );
			},
			success: function ( data )
			{
				var f = jQuery.parseJSON( JSON.stringify( data.d.results ) );
				var filter = '';
				console.log( " f: ", f );
				for ( var i = 0; i < f.length; i++ ) {
					filter += f[i]["FilterValue"]; 
				}
				console.log( "filter: ", filter );
				GetTaskers( filter );
			}
		} );		  
	}

	function GetTaskers(filter) { 
		//console.log( "In TaskersTracker GetTaskers" );
		//base qry to static target list
		var urlString0 = "https://hq.tradoc.army.mil/sites/CATS/_vti_bin/listdata.svc/Taskers?$select=";
		urlString0 += "Id,ControlNumber,SuspenseDate,TaskerName,TaskerLeads,TaskerAssists,TaskerInfo,CompletionStatusValue&$orderby=SuspenseDate&$filter=";
		// differnce is number of ending right parentheses
		var urlString = urlString0 + "((CompletionStatusValue%20eq%20%27Open%27)";

		var filterstring ="and((substringof(%27"+ filter + "%27,TaskerLeads))or(substringof(%27"+ filter + "%27,TaskerAssists))or(substringof(%27"+ filter + "%27,TaskerInfo))))";
		if ( filter !== "All Taskers" ) {
			urlString += filterstring;
		} else {
			urlString = urlString0 + "((CompletionStatusValue%20eq%20%27Open%27))";
		}
		
		console.log( "url that called CATSTaskersTracker: ", urlString );

		jQuery.ajax({
			url: urlString,
			method: "GET",
			async: false,
			headers: { 'accept': 'application/json; odata=verbose' },
			error: function ( jqXHR, textStatus, errorThrown ){
				logit( "Error Status: " + textStatus + ":: errorThrown: " + errorThrown );
			},
			success: function ( data )
			{
				v.loading = false;
				v.loaded = true;
				var j = jQuery.parseJSON( JSON.stringify( data.d.results ) );
				//console.log( "1. In CATSTaskersTracker GetTaskers j: ", j );

				var NoDate = [];  //no
				var Overdue = [];  //o
				var DueToday = []; //dt
				var Thirty = [];   //t
				var Sixty = [];    //s
				var Ninety = [];   //n
				var GtNinety = []; //gtn

				var NoCount = 0;
				var OCount = 0;
				var DTCount = 0;
				var TCount = 0;
				var SCount = 0;
				var NCount = 0;
				var GtNCount = 0;

				var no = [];
				var o = [];
				var dt = [];
				var t = [];
				var s = [];
				var n = [];
				var gtn = [];

				if ( filter !== "All Taskers" ) {
					for ( var i = 0; i < j.length; i++ ) {
						//figure out role using indexOf === 1
						var role = "None";
						var isLead = String( j[i]["TaskerLeads"] );
						//console.log( "isLead: ", isLead );
						if ( isLead === null ) {
							isLead = "nope";
						} else if ( isLead.indexOf( filter, 0 ) >= 0 ) role = "Lead";
						//console.log( "1a. In CATSTaskersTracker isLead: ", isLead, " role: ", role  );

						var isAssist = String( j[i]["TaskerAssists"] );
						//console.log( "isAssist: ", isAssist );
						if ( isAssist === null ) {
							isAssist = "nope";
						} else if ( isAssist.indexOf( filter, 0 ) >= 0 ) role = "Assist";
						//console.log( "1b. In CATSTaskersTracker isAssist: ", isAssist, " role: ", role  );

						var isInfo = String( j[i]["TaskerInfo"] );
						//console.log( "isInfo: ", isInfo );
						if ( isInfo === null ) {
							isInfo = "nope";
						} else if ( isInfo.indexOf( filter, 0 ) >= 0 ) role = "Info";
						//console.log( "1c. In CATSTaskersTracker isInfo: ", isInfo, " role: ", role );

						var a = moment( j[i]["SuspenseDate"] );
						//console.log( "a: ", a );
						var today = moment( new Date().toISOString() ).format( "YYYY-MM-DD" );
						var c = a.diff( today, 'days' );
						//console.log( "c: ", c );
						var formattedDate = formatDate( j[i]["SuspenseDate"] );

						if ( isNaN( c ) ) {
							c = "no";
						}

						if ( formattedDate === today ) {
							c = 0;
						}

						switch ( true ) {
							case c === "no":
								// no suspense date
								no.push( {
									"ID": j[i]["Id"], //  need id to open CATS tasker
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": '',
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;

							case c <= -1:
								// overdue
								o.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;

							case c === 0:
								dt.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;

							case c >= 1 && c <= 30:
								// 30
								t.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;

							case c > 30 && c <= 60:
								// 60
								s.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;

							case c > 60 && c <= 90:
								// 90
								n.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;

							case c > 90:
								// >90
								gtn.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Role": role
								} );
								break;
						}
					}

				} else {  

					for ( i = 0; i < j.length; i++ ) {

						isLead = String( j[i]["TaskerLeads"] );
						isAssist = String( j[i]["TaskerAssists"] );
						isInfo = String( j[i]["TaskerInfo"] );

						a = moment( j[i]["SuspenseDate"] );
						//console.log( "a: ", a );
						today = moment( new Date().toISOString() ).format( "YYYY-MM-DD" );
						c = a.diff( today, 'days' );
						//console.log( "c: ", c );
						formattedDate = formatDate( j[i]["SuspenseDate"] );

						if ( isNaN( c ) ) {
							c = "no";
						}

						if ( formattedDate === today ) {
							c = 0;
						}

						switch ( true ) {
							case c === "no":
								// no suspense date
								no.push( {
									"ID": j[i]["Id"], //  need id to open CATS tasker
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": '',
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;

							case c <= -1:
								// overdue
								o.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;

							case c === 0:
								dt.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;

							case c >= 1 && c <= 30:
								// 30
								t.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;

							case c > 30 && c <= 60:
								// 60
								s.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;

							case c > 60 && c <= 90:
								// 90
								n.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;

							case c > 90:
								// >90
								gtn.push( {
									"ID": j[i]["Id"],
									"ControlNumber": j[i]["ControlNumber"],
									"SuspenseDate": formattedDate,
									"TaskerName": j[i]["TaskerName"],
									"Lead": isLead,
									"Assist": isAssist,
									"Info": isInfo
								} );
								break;
						} 
					}
				}

				//console.log( "no: ", no, "o: ", o, " dt: ", dt, " t: ", t, " s: ", s, " n: ", n, " gtn: ", gtn );
				// these array names === popup title
				v.taskers.NoDate = no;
				v.taskers.Overdue = o;
				v.taskers.DueToday = dt;
				v.taskers.Thirty = t;
				v.taskers.Sixty = s;
				v.taskers.Ninety = n;
				v.taskers.GtNinety = gtn;

				//console.log( "v.taskers.nodate: ", v.taskers.nodate, " v.taskers.overdue: ", v.taskers.overdue, "v.taskers.duetoday: ", v.taskers.duetoday, " v.taskers.thirty: ", v.taskers.thirty, " v.taskers.sixty: ", v.taskers.sixty, " v.taskers.ninety: ", v.taskers.ninety, " v.taskers.gtninety: ", v.taskers.gtninety );

				v.taskers.NoCount = no.length;
				v.taskers.OCount = o.length;
				v.taskers.DTCount = dt.length;
				v.taskers.TCount = t.length;
				v.taskers.SCount = s.length;
				v.taskers.NCount = n.length;
				v.taskers.GtNCount = gtn.length;

				//console.log( "number of v.taskers: nodate: ", v.taskers.noCount, " overdue: ", v.taskers.OCount, " due today: ", v.taskers.DTCount, " t: ", v.taskers.TCount, " s: ", v.taskers.SCount, " n: ", v.taskers.NCount, " gtn: ", v.taskers.GtNCount );

				v.taskers.chartdata = [
					{ 'name': 'NoDate', 'y': v.taskers.NoCount },
					{ 'name': 'Overdue', 'y': v.taskers.OCount },
					{ 'name': 'DueToday', 'y': v.taskers.DTCount },
					{ 'name': 'Thirty', 'y': v.taskers.TCount },
					{ 'name': 'Sixty', 'y': v.taskers.SCount },
					{ 'name': 'Ninety', 'y': v.taskers.NCount },
					{ 'name': v.subforsymbol, 'y': v.taskers.GtNCount }
					//{ 'name': GtNinety, 'y': v.taskers.GtNCount }
				];

				//console.log( "v.taskers.chartdata: ", v.taskers.chartdata );
			}
		} );
		drawChart( v.taskers.chartdata, filter);
	}

	function drawChart( ser, filter )
	{
		var titleText = "";
		if ( filter !== "All Taskers" ) {
			titleText = 'CATS Taskers for ' + filter;
		} else {
			titleText = 'All Open CATS Taskers';
		}
		
		//console.log( 'In TaskersTracker drawChart' );
		//Highcharts.chart( 'containerttpie', {
		$( '#containerttpie' ).highcharts( {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			colors: ["orange", "red", "yellow", "green", "blue", "black", "purple"],
			credits: { enabled: false },
			title: {
				text: titleText 
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.y}</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y}',
						style: {
							color: Highcharts.theme && Highcharts.theme.contrastTextColor || 'black'
						}
					}
				},
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: function (a)
							{ 
								if ( a.point.name === v.subforsymbol ) a.point.name = 'GtNinety';
								var de = document.createElement( 'p' );	
								if ( filter !== "All Taskers" ) {
									de.innerHTML = buildTable( a.point.name ); // sends a.point.name === z	a.k.a. GtNinety
								} else { 
									de.innerHTML = buildTableDifferent( a.point.name ); // sends a.point.name === z	a.k.a. GtNinety
								} 
								var options = SP.UI.$create_DialogOptions();
								options.title = FormatTitle( a.point.name );
								options.width = 830;
								options.showClose = false;
								options.html = de;
								ExecuteOrDelayUntilScriptLoaded( SP.UI.ModalDialog.showModalDialog( options ), HideForIFrame() ); 
							}
						}
					}
				}
			},
			series: [{
				name: 'Status',
				colorByPoint: true,
				data: ser
			}]
		});

		updated();
	}

	function updated() {
		v.loading = false;
		v.loaded = true;
		console.log("TaskersTracker chart updated");
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

	//function ShowAfterIFrameClose()
	//{
	//	alert( "You\'re ShowIFrame" );
	//	$( ".ms-dlgDisable" ).show();
	//	return 'Cancel';
	//}

	function HideForIFrame()
	{
		//$( ".ms-dlgDisable" ).hide();
	}

	function FormatTitle( z )  // z === title looking for *Count
	{
		//console.log( "in FormatTitle --z into title: ",z" );
		var title = "";
		switch ( z ) {
			//case "nodate":
			case "NoDate":
				title = v.taskers.NoCount + " Taskers with No Suspense Date";
				break;
			//case "overdue":
			case "Overdue":
				title = v.taskers.OCount + " Taskers Overdue";
				break;
			//case "duetoday":
			case "DueToday":
				title = v.taskers.DTCount + " Taskers Due Today";
				break;
			//case "thirty":
			case "Thirty":
				title = v.taskers.TCount + " Taskers Due in 30 Days";
				break;
			//case "sixty":
			case "Sixty":
				title = v.taskers.SCount + " Taskers Due in 60 Days";
				break;
			//case "ninety":
			case "Ninety":
				title = v.taskers.NCount + " Taskers Due in 90 Days"; 
				break;
			//case "gtninety":
			case "GtNinety":
				title = v.taskers.GtNCount + " Taskers Due in More Than 90 Days"; 
				break;
		}
		return title;
	}

	function formatDate( d )
	{
		return d === null ? "" : moment( d ).add( 8, 'hours' ).format( "MM-DD-YYYY" );
	}

	function buildTable( z )
	{
		console.log( "in TaskersTracker buildTable z: ", z );
		var html = '';
		if ( z !== null ) {
			var taskz = v.taskers[z];
			//console.log( "TaskersTracker v.taskz: ", taskz );

			html = "<table id='tblTaskersTracker' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>" +
				"<thead>" +
					"<tr><th class='control'>Control</th><th class='suspense'>Suspense</th><th>Title</th><th class='role'>Role</th></tr>" +
				"</thead>" +
				"<tbody>";

			for ( i = 0; i < taskz.length; i++ ) {
				var id = taskz[i]["ID"];
				var cn = taskz[i]["ControlNumber"];
				var url = 'https://hq.tradoc.army.mil/sites/cats/Lists/Taskers/CATS_DispForm.aspx?ID=' + id;
				var optionslink = "{ url:'" + url + "',allowMaximize:false,showClose:true,autoSize:true,showClose:false}";
				var link = '<div id="' + cn + 'link">' + '<div class="container">' + '<div class="row">' +
					'<button onclick="SP.SOD.execute(' +
					"'sp.ui.dialog.js','SP.UI.ModalDialog.showModalDialog'," + optionslink +
					'); document.getElementById(' + "'" + cn + "link'" + ');" type="button" id="' + cn + 'link' +
					'" class="btn btn-success btn-xs mr-1" value="newlink" alt="View' + cn + '">' +
					cn + '</button>';
				html += '<td width="15%"><a class="control" alt="click to view CATS Tasker ' + cn + '">' + link + '</a></td>';
				html += '<td width="15%" class="suspense">' + taskz[i]["SuspenseDate"] + "</td>";
				html += '<td>' + taskz[i]["TaskerName"] + '</td>';
				html += '<td width="15%" class="role">' + taskz[i]["Role"] + '</td></tr>';
			}
			html += '<tr style="text-align: right;"><td colspan="4" ><button title="Close" id="DlgClose" accesskey="C" type="button" class="btn btn-success" value="cancel" onclick="javascript:SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel, ' + "'" + 'Cancel' + "'" + ');">Close</button></td></tr>';
			html += '</tbody></table>';
			console.log( "TaskersTracker html for links to CATS: ", html );
		}
		return html;
	}

	function buildTableDifferent( z )
	{
		console.log( "in TaskersTracker buildTableDifferent z: ", z );
		var html = '';
		if ( z !== null ) {
			var taskz = v.taskers[z];
			//console.log( "TaskersTracker v.taskz: ", taskz );

			html = "<table id='tblTaskersTracker' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>" +
				"<thead>" +
					"<tr><th class='control'>Control</th><th class='suspense'>Suspense</th><th>Title</th><th class='Lead'>Lead</th><th class='Assist'>Assist</th><th class='Info'>Info</th></tr> " +
				"</thead><tbody>";

			for ( i = 0; i < taskz.length; i++ ) {
				var id = taskz[i]["ID"];
				var cn = taskz[i]["ControlNumber"];
				var url = 'https://hq.tradoc.army.mil/sites/cats/Lists/Taskers/CATS_DispForm.aspx?ID=' + id;
				var optionslink = "{ url:'" + url + "',allowMaximize:false,showClose:true,autoSize:true,showClose:false}";
				var link = '<div id="' + cn + 'link">' + '<div class="container">' + '<div class="row">' +
					'<button onclick="SP.SOD.execute(' +
					"'sp.ui.dialog.js','SP.UI.ModalDialog.showModalDialog'," + optionslink +
					'); document.getElementById(' + "'" + cn + "link'" + ');" type="button" id="' + cn + 'link' +
					'" class="btn btn-success btn-xs mr-1" value="newlink" alt="View' + cn + '">' +
					cn + '</button>';
				html += '<td width="15%"><a class="control" alt="click to view CATS Tasker ' + cn + '">' + link + '</a></td>';
				html += '<td width="10%" class="suspense">' + taskz[i]["SuspenseDate"] + "</td>";
				html += '<td width="20%">' + taskz[i]["TaskerName"] + '</td>';
				html += '<td width="15%" class="lead">' + taskz[i]["Lead"] + '</td>';
				html += '<td width="20%" class="assist">' + taskz[i]["Assist"] + '</td>';
				html += '<td width="20%" class="info">' + taskz[i]["Info"] + '</td></tr>';
			}
			html += '<tr style="text-align: right;"><td colspan="6" ><button title="Close" id="DlgClose" accesskey="C" type="button" class="btn btn-success" value="cancel" onclick="javascript:SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel, ' + "'" + 'Cancel' + "'" + ');">Close</button></td></tr>';
			html += '</tbody></table>';
			console.log( "TaskersTracker html different for links to CATS: ", html );
		}
		return html;
	}

	return {
		Init: Init
	};
};

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('CEWP_Chart_TaskersTracker.js');