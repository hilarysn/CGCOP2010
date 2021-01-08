var CG = CG || {};
CG.AJAX = CG.AJAX || {};
CG.DASHBOARD = CG.MYDASHBOARD || {};
CG.DASHBOARD.CHARTS = CG.DASHBOARD.CHARTS || {};
CG.DASHBOARD.CHARTS.VARIABLES = CG.DASHBOARD.CHARTS.VARIABLES || {};

CG.DASHBOARD.CHARTS.VARIABLES = {

};

CG.DASHBOARD.CHARTS.DATES = function ()
{
	console.log( "connected to dates." );
	var v = CG.DASHBOARD.CHARTS.VARIABLES;

	function Init( site, qry )
	{
		console.log( "connected to dates." );
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		if ( inDesignMode === "1" ) {
			//$("#accessions").html("").append("<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>");
		}
		else {
			firstOne();
		}
	}


	function firstOne()
	{
		$( document ).ready( function ()
		{
			var idNames = [];
			var listName;
			var asOfDate;
			var x = $( ".ms-WPHeader" );

			for ( i = 0; i < x.length; i++ ) {
				if ( x[i].cells[1].id !== "WebPartTitleWPQ3" && x[i].cells[1].id !== "WebPartTitleWPQ9" ) {
					idNames[i] = "#" + x[i].cells[1].id;
				}
			}

			idNames.forEach( function ( idName )
			{
				switch ( idName ) {
					case '#WebPartTitleWPQ12':
						listName = 'EnlistedAccessionsByFiscalYear';
						break;
					case '#WebPartTitleWPQ15':
						listName = 'CadetMissionCommandByFY';
						break;
					case '#WebPartTitleWPQ8':
						listName = 'TripReports';
						break;
					case '#WebPartTitleWPQ5':
						listName = 'SocialMedia';
						break;
					case '#WebPartTitleWPQ14':
						listName = 'USACC_REDCAT';
						break;
					case '#WebPartTitleWPQ4':
						listName = 'TRADOCCampaignPlan';
						break;
					case '#WebPartTitleWPQ13':
						listName = 'IMT_POP_Report';
						break;
					case '#WebPartTitleWPQ6':
						listName = 'ASLGO';
						break;
					case '#WebPartTitleWPQ7':
						listName = 'TRADOCLeaderCommunity_MediaEngagements';
						break;
				}
				console.log( "listName: ", listName );
				var url = 'https://hq.tradoc.army.mil/sites/cpg/_vti_bin/listdata.svc/' + listName + '?select=modified&$orderby=modified';

				$.ajax( {
					url: url,
					method: "GET",
					headers: { "Accept": "application/json; odata=verbose" },
					success: function ( data )
					{
						var results = data.d.results;
						var j = jQuery.parseJSON( JSON.stringify( results ) );
						console.log( "j:", j );
					},
					error: function ( data )
					{
						failure( data.responseJSON.error );
					}
				} );
			} );
		} );
	}

	return {
		Init: Init
	};
};

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('CEWP_Chart_Enlisted_Accessions.js');