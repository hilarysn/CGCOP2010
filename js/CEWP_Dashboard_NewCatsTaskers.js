var CKO = CKO || {};
CKO.AJAX = CKO.AJAX || {};
CKO.DASHBOARD = CKO.DASHBOARD || {};
CKO.DASHBOARD.TASKERS = CKO.DASHBOARD.TASKERS || {};
CKO.DASHBOARD.TASKERS.VARIABLES = CKO.DASHBOARD.TASKERS.VARIABLES || {};

CKO.DASHBOARD.TASKERS.VARIABLES = {
	site: null,
	loc: String( window.location ),
	CATSurlString: "https://hq.tradoc.army.mil/sites/CATS/_vti_bin/listdata.svc/Taskers?$select=Id,ControlNumber,ReceivedDate,SuspenseDate,TaskerName,TaskerLeads,CompletionStatusValue,TaskerAssists,TaskerInfo,Created&$filter=((CompletionStatusValue%20eq%20%27Open%27)and((substringof(%27CKO%27,TaskerLeads))or(substringof(%27CKO%27,TaskerAssists))or(substringof(%27CKO%27,TaskerInfo))))",
	PMTurlString: "https://hq.tradoc.army.mil/sites/OCKO/PMT/_vti_bin/listdata.svc/CATS?$select=Id,Subject,CATSSuspense,OCKOSuspense,ClosedValue,CATSControlNumber,Issued",
	waitmsg: null,
	count: 0,
	catsID: null,
	html: "",
	newtaskers: {}
};

CKO.DASHBOARD.TASKERS.NewTaskers = function (){

	var v = CKO.DASHBOARD.TASKERS.VARIABLES;

	function Init( site ){
		//var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		//logit("Design Mode = " + inDesignMode);
		//if (inDesignMode === "1") {
		//    $("#NewTaskers").html("").append("<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>");
		//}
		//else {
			var zebra = LoadCATSTaskers();
			jQuery.when.apply( null, zebra ).done( function (){
				var mule = LoadPMTTaskers();
				jQuery.when.apply( null, mule ).done( function (){
					AllTaskersLoaded();
				});
			});
		//}
	}

	function LoadCATSTaskers(){
		var deferreds = [];
		v.newtaskers = [],
		deferreds.push( $.when( CKO.REST.GetListItems.getitems( v.CATSurlString ) ).then( function ( data ){
			var results = data.d.results;
			var j = jQuery.parseJSON( JSON.stringify( results ) );
			console.log( "1. In NewCATSTaskers LoadCATSTaskers j: ", j );
			for ( var i = 0, length = j.length; i < length; i++ ) {
				//figure out role =
				var role = "None";
				var isLead = String(j[i]["TaskerLeads"]);
				if ( isLead === null ) isLead = "nope";
				console.log("1a. In NewCATSTaskers isLead: ",isLead);
				var isAssist = String(j[i]["TaskerAssists"]);
				if ( isAssist === null ) isAssist = "nope";
				console.log("1b. In NewCATSTaskers isAssist: ",isAssist);
				var isInfo = String(j[i]["TaskerInfo"]);
				if ( isInfo === null ) isInfo = "nope";
				console.log("1c. In NewCATSTaskers isInfo: ",isInfo);
				if ( isLead === "CKO" ) role = "Lead";
				if ( isAssist.indexOf( "CKO", 0 ) >= 0 ) role = "Assist";
				if ( isInfo.indexOf( "CKO", 0 ) >= 0 ) role = "Info";
				console.log("1d. In NewCATSTaskers CKO role: ",role);
				v.newtaskers.push({
					id: j[i]["Id"],
					controlnumber: j[i]["ControlNumber"],
					inPMT: false,
					role: role
				});
			}
		}, function ( data ){
				console.log( "2. In NewCATSTaskers LoadCATSTaskers v.newtaskers: ",v.newtaskers);
			})
		);
		return deferreds;
	}

	function LoadPMTTaskers(){
		var deferreds = [];
		v.taskers = [];
		deferreds.push( $.when( CKO.REST.GetListItems.getitems( v.PMTurlString ) ).then( function ( data ){
			console.log( "3. In NewCATSTaskers LoadPMTTaskers taskers data: ", data );
			var results = data.d.results;
			var j = jQuery.parseJSON( JSON.stringify( results ) );
			console.log( "4. In NewCATSTaskers PMT taskers json: ", j );
			for ( var i = 0, length = j.length; i < length; i++ ) {
				var cn = String( j[i]["CATSControlNumber"] );
				cn = cn.trim();
				v.taskers.push({
					controlnumber: cn
				});
			}
		}, function ( data ){
				console.log( "5. In NewCATSTaskers LoadPMTTaskers taskers data: ", data, "v.taskers: ", v.taskers);
			})
		);
		return deferreds;
	}

	function AllTaskersLoaded(){
		var stop = "stop";
		v.html = "<tr><th>No new taskers.</th></tr>";
		$( "#taskTable" ).html( "" ).append( v.html );
		v.html = "";

		//v.html = $( "#taskTable" ).html("");
		console.log( "6. In NewCATSTaskers AllTaskersLoaded v.newtaskers: ", v.newtaskers );

		for ( var i = 0; i < v.newtaskers.length; i++ ) {
			var cn1, cn2;
			cn1 = v.newtaskers[i].controlnumber;
			console.log( "7. In NewCATSTaskers AllTaskersLoaded v.newtaskers: ", v.newtaskers[i].controlnumber );
			for ( var k = 0; k < v.taskers.length; k++ ) {
				cn2 = v.taskers[k].controlnumber;
				if ( cn1 === cn2 ) {
					// already in PMT CATS
					v.newtaskers[i].inPMT = true;
				}
			}
		}

		var stop = "stop";

		for ( var h = 0; h < v.newtaskers.length; h++ ) {
			console.log( "8. In NewCATSTaskers checking role: ", v.newtaskers[h].role, " inPMT: ", v.newtaskers[h].inPMT, " controlonumber: ", v.newtaskers[h].controlnumber );
			if ( v.newtaskers[h].role !== "None" && v.newtaskers[h].inPMT !== true ) {
				v.count += 1;
			}
			console.log( "9. In NewCATSTaskers checking v.count: ",v.count );
		}

		if ( v.count > 0 ) {
			v.html = "<tr><th><a href='/sites/OCKO/PMT/Pages/Taskers.aspx' id='taskerlink'>" + v.count + " tasker(s) awaiting action.</a></th></tr>";
			$( "#taskTable" ).html( "" ).append( v.html );
		//} else {
		//	$( "#taskTable" ).html( "" ).append("<tr><th>No new taskers.</th></tr>");
		} 
	}

	return {
		Init: Init
	};
};

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('CEWP_Dashboard_NewCatsTaskers.js');