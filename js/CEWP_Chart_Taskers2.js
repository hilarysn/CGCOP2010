console.log( "connected CEWP_Chart_Taskers" );
var nodate = [];  //no
var overdue = [];  //o
var duetoday = []; //dt
var thirty = [];   //t
var sixty = [];    //s
var ninety = [];   //n
var gtninety = []; //gtn
var NoCount = 0;
var OCount = 0;
var DTCount = 0;
var TCount = 0;
var SCount = 0;
var NCount = 0;
var GtNCount = 0;
var subforsymbol = ">Ninety";

var CG = CG || {};
CG.AJAX = CG.AJAX || {};
CG.DASHBOARD = CG.MYDASHBOARD || {};
CG.DASHBOARD.CHARTS = CG.DASHBOARD.CHARTS || {};
CG.DASHBOARD.CHARTS.VARIABLES = CG.DASHBOARD.CHARTS.VARIABLES || {};

CG.DASHBOARD.CHARTS.VARIABLES.TASKERS = {
	site: null,
	loc: String( window.location ),
	waitmsg: null,
	title: null,
	data: null,
	json: null,
	qry: null,
	html: "",
	loading: true,
	loaded: false,
	taskers: {},
	today: null
};

CG.DASHBOARD.CHARTS.TASKERS = function ()
{
	var v = CG.DASHBOARD.CHARTS.VARIABLES.TASKERS;

	function Init( site, qry )
	{
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		if ( inDesignMode === "1" ) {
			$( "#catstaskers" ).html( "" ).append( "<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>" );
		}
		else {
			GetTaskers();
		}
	}

	function GetTaskers()
	{
		var urlString = "https://hq.tradoc.army.mil/sites/CATS/_vti_bin/listdata.svc/Taskers?$select=Id,ControlNumber,SuspenseDate,TaskerName,TaskDeliverables,TaskerLeads,CompletionStatusValue&$orderby=SuspenseDate&$filter=substringof(%27CG%27,ControlNumber)%20and%20(CompletionStatusValue%20eq%20%27Open%27)";
		console.log( "GetTaskers: url called CEWP Chart Taskers: ", urlString );
		var pseries = [];
		jQuery.ajax( {
			url: urlString,
			method: "GET",
			async: false,
			headers: { 'accept': 'application/json; odata=verbose' },
			error: function ( jqXHR, textStatus, errorThrown )
			{
				logit( "Error Status: " + textStatus + ":: errorThrown: " + errorThrown );
			},
			success: function ( data )
			{
				v.loading = false;
				v.loaded = true;
				var j = jQuery.parseJSON( JSON.stringify( data.d.results ) );
				//console.log( "CEWP Chart Taskers j: ", j );  
				var no = [];
				var o = [];
				var dt = [];
				var t = [];
				var s = [];
				var n = [];
				var gtn = [];

				for ( var i = 0; i < j.length; i++ ) {
					var a = moment( j[i]["SuspenseDate"] );
					//console.log( "a: ", a );
					var today = moment( new Date().toISOString() ).format( "YYYY-MM-DD" );
					var c = a.diff( v.today, 'days' );
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
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": '',
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;

						case c <= -1:
							// overdue
							o.push( {
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": formattedDate,
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;

						case c === 0:
							// due today
							dt.push( {
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": formattedDate,
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;

						case c >= 1 && c <= 30:
							// 30
							t.push( {
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": formattedDate,
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;

						case c > 30 && c <= 60:
							// 60
							s.push( {
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": formattedDate,
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;

						case c > 60 && c <= 90:
							// 90
							n.push( {
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": formattedDate,
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;

						case c > 90:
							// >90
							gtn.push( {
								"ID": j[i]["Id"],
								"ControlNumber": j[i]["ControlNumber"],
								"SuspenseDate": formattedDate,
								"TaskerName": j[i]["TaskerName"],
								"TaskDeliverables": j[i]["TaskDeliverables"],
								"TaskerLeads": j[i]["TaskerLeads"]
							} );
							break;
					}
				}

				//console.log( "no: ", no, "o: ", o, " dt: ", dt, " t: ", t, " s: ", s, " n: ", n, " gtn: ", gtn );

				v.taskers.nodate = no;
				v.taskers.overdue = o;
				v.taskers.duetoday = dt;
				v.taskers.thirty = t;
				v.taskers.sixty = s;
				v.taskers.ninety = n;
				v.taskers.gtninety = gtn;

				//console.log( "v.taskers.nodate: ", v.taskers.nodate, " v.taskers.overdue: ", v.taskers.overdue, "v.taskers.duetoday: ", v.taskers.duetoday, " v.taskers.thirty: ", v.taskers.thirty, " v.taskers.sixty: ", v.taskers.sixty, " v.taskers.ninety: ", v.taskers.ninety, " v.taskers.gtninety: ", v.taskers.gtninety );

				v.taskers.NoCount = no.length;
				v.taskers.OCount = o.length;
				v.taskers.DTCount = dt.length;
				v.taskers.TCount = t.length;
				v.taskers.SCount = s.length;
				v.taskers.NCount = n.length;
				v.taskers.GtNCount = gtn.length;

				//console.log( "number of v.taskers: nodate: ", v.taskers.NoCount, " overdue: ", v.taskers.OCount, " due today: ", v.taskers.DTCount, " t: ", v.taskers.TCount, " s: ", v.taskers.SCount, " n: ", v.taskers.NCount, " gtn: ", v.taskers.GtNCount );

				v.taskers.chartdata = [
					{ 'name': 'NoDate', 'y': v.taskers.NoCount },
					{ 'name': 'Overdue', 'y': v.taskers.OCount },
					{ 'name': 'DueToday', 'y': v.taskers.DTCount },
					{ 'name': 'Thirty', 'y': v.taskers.TCount },
					{ 'name': 'Sixty', 'y': v.taskers.SCount },
					{ 'name': 'Ninety', 'y': v.taskers.NCount },
					{ 'name': subforsymbol, 'y': v.taskers.GtNCount }
				];

				//console.log( "v.taskers.chartdata: ", v.taskers.chartdata );

			}
		} );
		drawChart( v.taskers.chartdata );
	}

	function drawChart( ser )
	{
		//console.log( 'In drawChart' );
		//Highcharts.chart( 'containerpie', {
		$( '#containerpie' ).highcharts( {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			colors: ["orange", "red", "yellow", "green", "blue", "black", "purple"],
			credits: { enabled: false },
			title: {
				// empty to save space
				text: ' '
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
							click: function ( a )
							{
								if ( a.point.name === subforsymbol ) a.point.name = 'GtNinety';
								var de = document.createElement( 'p' );
								de.innerHTML = buildTable( a.point.name );// a.point.name === z	
								var options = SP.UI.$create_DialogOptions();
								options.title = formatTitle( a.point.name );
								options.width = 830;
								options.showClose = false;
								options.html = de;
								ExecuteOrDelayUntilScriptLoaded( SP.UI.ModalDialog.showModalDialog( options ), HideIFrame() );
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
		} );

		updated();
	}

	function updated()
	{
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
	//	alert("You\'re OK");
	//}

	function ShowIFrame()
	{
		alert( "You\'re ShowIFrame" );
		$( ".ms-dlgDisable" ).show();
		$( ".ms-dlgContent" ).hide();
		return 'Cancel';
	}

	function HideIFrame()
	{

	}

	function formatTitle( z )
	{
		//console.log( "z in formatTitle", z );
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
				title = v.taskers.GtNCount + " Taskers Due in Greater than 90 Days";
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
		v.html = '';
		if ( z !== null ) {
			//console.log( "in buildTable" );
			z = z.toLowerCase();
			var zzz = z;			
			var taskz = v.taskers[zzz];
			v.html += "<table id='tbl" + z + "' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>" +
				"<thead>" +
				"<tr><th class='control'>Control</th><th class='suspense'>Suspense</th><th>Title</th><th class='tasklead'>Leads</th></tr>" +
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
				v.html += '<td width="15%"><a class="control" alt="click to view CATS Tasker ' + cn + '">' + link + '</a></td>';
				v.html += '<td width="15%" class="suspense">' + taskz[i]["SuspenseDate"] + "</td>";
				v.html += '<td>' + taskz[i]["TaskerName"] + '</td>';
				v.html += '<td width="15%" class="tleads">' + taskz[i]["TaskerLeads"] + '</td></tr>';
			}
			v.html += '<tr style="text-align: right;"><td colspan="4" ><button title="Close" id="DlgClose" accesskey="C" type="button" class="btn btn-success" value="cancel" onclick="javascript:SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel, ' + "'" + 'Cancel' + "'" + ');">Close</button></td></tr>';
			v.html += '</tbody></table>';																																																						  
		}
		return v.html;
	}

	return {
		Init: Init
	};
};
SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs( 'CEWP_Chart_Taskers2.js' );