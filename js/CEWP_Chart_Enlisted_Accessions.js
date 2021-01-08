var currentAccessions = [];
var currentMission = [];
var fiscalYears = [];
var options = [];

var CG = CG || {};
CG.AJAX = CG.AJAX || {};
CG.DASHBOARD = CG.MYDASHBOARD || {};
CG.DASHBOARD.CHARTS = CG.DASHBOARD.CHARTS || {};
CG.DASHBOARD.CHARTS.VARIABLES = CG.DASHBOARD.CHARTS.VARIABLES || {};

CG.DASHBOARD.CHARTS.VARIABLES.BUDGET = {
	site: null,
	loc: String( window.location ),
	waitmsg: null,
	title: null,
	ctx: null,
	web: null,
	list: null,
	data: null,
	json: null,
	listitem: null,
	used: 0,
	remaining: 0,
	pending: 0,
	total: 0,
	user: null,
	userID: null,
	qry: null,
	html: "",
	currentFY: null,
	previousFY: null,
	totalAccessions: 0,
	totalMission: 0,
	overUnder: 0
};

CG.DASHBOARD.CHARTS.ACCESSSIONS = function ()
{

	var v = CG.DASHBOARD.CHARTS.VARIABLES.BUDGET;

	function Init( site, qry )
	{
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		if ( inDesignMode === "1" ) {
			$( "#accessions" ).html( "" ).append( "<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>" );
		}
		else {
			setCurrentFY();
		}
	}

	$( document ).ready( function ()
	{
		$( "#inputFY" ).change( changeFY );
	} );

	function setCurrentFY()
	{
		//set current fiscal year
		var d = new Date();
		v.currentYear = d.getFullYear().toString().substr( 2, 2 );
		var month = d.getMonth();
		if ( month > 9 ) {
			v.currentFY = v.currentYear + 1;
		} else {
			v.currentFY = v.currentYear;
		}
		console.log( "v.currentFY", v.currentFY );
		getFiscalYears();
	}

	function getFiscalYears()
	{
		var url = 'https://hq.tradoc.army.mil/sites/cpg/_vti_bin/listdata.svc/EnlistedAccessionsByFiscalYear?select=FY&$orderby=FY';
		console.log( "url in EnlistedAccessionsByFiscalYear: ", url );
		$.ajax( {
			url: url,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function ( data )
			{
				var results = data.d.results;
				var j = jQuery.parseJSON( JSON.stringify( results ) );
				//load all entries in the FY column to an array
				for ( i = 0; i < j.length; i++ ) {
					fiscalYears[i] = j[i].FY;
				}

				//remove the duplicates and load to a new array
				for ( var i = 0; i < fiscalYears.length; i++ ) {
					if ( fiscalYears[i] !== fiscalYears[i - 1] ) options.push( fiscalYears[i] );
				}
				console.log( "options", options );
				loadFilter();
			},
			error: function ( data )
			{
				failure( data.responseJSON.error );
			}
		} );
	}

	function loadFilter()
	{
		//load all entries in the options array to the FY drop down as options
		for ( i = 0; i < options.length; i++ ) {
			//the value is a 2 digit year but the DISPLAY is four
			$( "#inputFY" ).append( "<option value='" + options[i] + "'" + ">" + "20" + options[i] + "</option>" );
			//set current selected value to the current FY (this is for display only to reduce confusion.  The code sets everything to the current FY by default)
			$( "#inputFY" ).val( v.currentFY );
		}
		getMissionCurrent();
	}

	function changeFY()
	{
		//Get the value of the selected FY, reset v.currentFY to the selected value, clear all arrays and variables to refresh with data related to the selected FY
		var selectVal = $( "#inputFY" ).val();
		v.currentFY = selectVal;
		v.totalMission = 0;
		v.totalAccessions = 0;
		v.overUnder = 0;
		currentMission = [];
		currentAccessions = [];
		//re run functions to display relevant data to the selected FY
		getMissionCurrent();
	}

	function getMissionCurrent()
	{
		var accumulator;
		var url = 'https://hq.tradoc.army.mil/sites/cpg/_vti_bin/listdata.svc/EnlistedAccessionsByFiscalYear?select=Mission,FY,FYmonthorder&$orderby=FYmonthorder&$filter=FY eq ' + v.currentFY;
		$.ajax( {
			url: url,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function ( data )
			{
				var results = data.d.results;
				var j = jQuery.parseJSON( JSON.stringify( results ) );
				for ( i = 0; i < j.length; i++ ) {
					currentMission[i] = j[i].Mission;
				}
				accumulator = 0;
				//gather the missions numbers and add them for a total value for YTD
				for ( i = 0; i < currentMission.length; i++ ) {
					accumulator = currentMission[i];
					v.totalMission = v.totalMission + accumulator;
				}
				console.log( "totalMission" + v.currentFY, v.totalMission );
				getAccessionsCurrent();
			},
			error: function ( data )
			{
				failure( data.responseJSON.error );
			}
		} );
	}

	function getAccessionsCurrent()
	{
		var accumulator;
		var url = 'https://hq.tradoc.army.mil/sites/cpg/_vti_bin/listdata.svc/EnlistedAccessionsByFiscalYear?select=Accession,FY,FYmonthorder&$orderby=FYmonthorder&$filter=FY eq ' + v.currentFY;
		console.log( "url in getAccessionsCurrent: ", url );
		$.ajax( {
			url: url,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function ( data )
			{
				var results = data.d.results;
				var j = jQuery.parseJSON( JSON.stringify( results ) );
				console.log( "j: ", j );
				for ( i = 0; i < j.length; i++ ) {
					currentAccessions[i] = j[i].Accession;
				}
				accumulator = 0;
				//gather the accessions numbers and add them for a total value for YTD
				for ( i = 0; i < currentAccessions.length; i++ ) {
					accumulator = currentAccessions[i];
					v.totalAccessions = v.totalAccessions + accumulator;
				}
				console.log( "currentAccessions" + v.currentFY, currentAccessions );
				DrawChart();
			},
			error: function ( data )
			{
				failure( data.responseJSON.error );
			}
		} );
	}

	function DrawChart()
	{
		Highcharts.chart( 'container', {
			chart: {
				type: 'column'
			},
			title: {
				text: "Enlisted Accessions by Fiscal Year 20" + v.currentFY
			},
			xAxis: {
				categories: [
					'Oct',
					'Nov',
					'Dec',
					'Jan',
					'Feb',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'Sept'
				]
			},
			yAxis: [{
				min: 0,
				title: {
					text: 'Recruits'
				}
			}, {
				title: {
					text: ''
				},
				opposite: true
			}],
			legend: {
				shadow: false
			},
			tooltip: {
				shared: true
			},
			plotOptions: {
				column: {
					grouping: false,
					shadow: false,
					borderWidth: 0
				}
			},
			series: [{
				name: 'Mission',
				color: 'rgba(243, 117, 43,1)',
				data: currentMission,
				pointPadding: 0.3,
				pointPlacement: -0.2
			}, {
				name: 'Accessions',
				color: 'rgba(39, 126, 39,.9)',
				data: currentAccessions,
				pointPadding: 0.4,
				pointPlacement: -0.2
			}]
		} );
		updateYTD();
	}

	function updateYTD()
	{
		$( document ).ready( function ()
		{
			//removes values for currently selected FY when the filter is changed.
			$( "#ytdAccessions h3" ).remove();
			$( "#ytdMission h3" ).remove();
			$( "#ytdOverUnder h3" ).remove();
			$( "#ytdAccessions" ).append( "<h3>" + v.totalAccessions + "</h3>" );
			$( "#ytdMission" ).append( "<h3>" + v.totalMission + "</h3>" );
			v.overUnder = v.totalAccessions - v.totalMission;
			$( "#ytdOverUnder" ).append( "<h3>" + v.overUnder + "</h3>" );
			if ( v.overUnder < 0 ) {
				$( "#ytdOverUnder" ).css( "color", "red" );
			}
		} );
	}

	return {
		Init: Init
	};
};

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('CEWP_Chart_Enlisted_Accessions.js');