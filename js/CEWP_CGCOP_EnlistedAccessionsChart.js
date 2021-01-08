var userID, fy, month, total; //dhtml = "", ahtml = '';
var chart, chartdata, chartenum, chartitem, chartitems;
var currentpopup = null;
var SLASH = "/";
//var cw, ch;
var lastyear = "2019";
var thisyear = "2029";
var nextyear = "2021";
var yearstocheck = [lastyear, thisyear, nextyear];
var monthsarr = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
var lastyearmistotal = 0, thisyearacctotal = 0, nextyearfuttotal = 0;
var lastyearmistotal = 0, thisyearacctotal = 0, nextyearfuttotal = 0;
var	nextyearmistotal = 0, nextyearacctotal = 0, extyearfuttotal = 0;

function DrawEAChart(site) {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        userID = _spPageContextInfo.userId;
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        console.log("Design Mode = " + inDesignMode);
        if (inDesignMode === "1") {
            $("#chart_loading").html("").append("<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>");
        }
        else {
            chartitems = new Array();
            var zebra = getChartData();
            jQuery.when.apply(null, zebra).done(function () {
                console.log("EA FY getChartData complete.");
                var stop = "stop";
                drawCharts();
            });
        }
    }, "sp.js");
}

function getChartData() {
	var deferreds = [];
	//https://hq.tradoc.army.mil/sites/cpg/_vti_bin/listdata.svc/EnlistedAccessionsByFiscalYear?$select=Id,FY,Month,Mission,Accession,Future&$orderby=Month
	var urlString = "https://hq.tradoc.army.mil/sites/cpg/_vti_bin/listdata.svc/EnlistedAccessionsByFiscalYear?$select=Id,FY,Month,Mission,Accession,Future&$orderby=Month&filter=(FY%20eq%20%272020%27)";
	var filterend =	 "%27)";

	jQuery.ajax( {
		url: urlString,
		method: "GET",
		headers: { 'accept': 'application/json; odata=verbose' },
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log( "EA Chart Error Status: " + textStatus + ":: errorThrown: " + errorThrown );
			 $("#SPSTools_Notify").fadeOut("2500", function () {
                    $("#SPSTools_Notify").html("");
             });
		},
		success: function ( data ){
			months.loading = false;
			months.loaded = true;
			var j = jQuery.parseJSON( JSON.stringify( data.d.results ) );


			for ( var i = 0; i < j.length; i++ ) {
				months.push( {
					"ID": j[i]["Id"],
					"FY": j[i]["FY"],
					"Month": j[i]["Month"],
					"Mission": j[i]["Mission"],
					"Accession": j[i]["Accession"],
					"Future": j[i]["Future"]
				} );

				switch ( FY ) {
					case FY < lastyear :
						lastyearmistotal += j[i]["Mission"];
						lastyearacctotal += j[i]["Accession"];
						lastyearfuttotal += j[i]["Future"];
						break;

					case FY < thisyear :
						thisyearmistotal += j[i]["Mission"];
						thisyearacctotal += j[i]["Accession"];
						thisyearfuttotal += j[i]["Future"];
						break;

					case FY < nextyear :
						nextyearmistotal += j[i]["Mission"];
						nextyearacctotal += j[i]["Accession"];
						nextyearfuttotal += j[i]["Future"];
						break;
				}
			}

			for ( i = 0; i < j.length; i++ ) {
				switch ( FY ) {
					case FY < lastyear :
						months.push( {
							"Missiontotal": lastyearmistotal,
							"Accessiontotal": lastyearacctotal,
							"Futuretotal": lastyearfuttotal
						} );

						break;

					case FY < thisyear :
						months.push( {
							"Missiontotal": thisyearmistotal,
							"Accessiontotal": thisyearacctotal,
							"Futuretotal": thisyearfuttotal
						} );

						break;

					case FY < nextyear :
						months.push( {
							"Missiontotal": nextyearmistotal,
							"Accessiontotal": nextyearacctotal,
							"Futuretotal": nextyearfuttotal
						} );

						break;
				}
			}

			months.chartitems.push( { 'name': 'Mission', 'y': months.mission } );
			months.chartitems.push( { 'name': 'Accession', 'y': months.accession } );
			months.chartitems.push( { 'name': 'Future', 'y': months.future } );

			charts.addSeries( {
				name: 'Months',
				data: months.chartitems
			} );
		}
	});
}

function drawcharttip(obj) {
	console.log("drawcharttip");
	var stop = "stop";
	var title = obj.point.category;
	var html = "<div class='chartpopup' id='chartpopupcontainer_" + title.replace(/ /g, "_") + "'>";
	html += "<div class='popRow'>" + obj.point.Month + "</div><div class='popRow'><table class='table'>";
	html += "<tr><td>Mission:<td>" + obj.point.Mission + "</td></tr>";
	html += "<tr><td>Accession:<td>" + obj.point.Accession + "</td></tr>";
	html += "<tr><td>Future:<td>" + obj.point.Future + "</td></tr>";
	//html += "<tr><td>Mission YTD Total:<td>" + obj.point.MissionYTDTotal + "</td></tr>";
	//html += "<tr><td>Accession YTD Total:<td>" + obj.point.AccessionYTDTotal + "</td></tr>";
	//html += "<tr><td>Future YTD Total:<td>" + obj.point.FutureYTDTotal + "</td></tr>";
	html += "</table></div></div>";
	return html;
}

function drawlabel(obj) {
	console.log("draw labels");
    var month = obj.value;
    var stop = "stop";
    var html;
    switch (month) {
        case "SEP":
			html = "<span style='color: #8a6d3b;'>" + month + "</span>";
			console.log( "in switch (month)" );
            break;

        case "OCT":
            html = "<span style='color: #3c763d;'>" + month + "</span>";
            break;

        case "NOV":
            html = "<span style='color: #3c763d;'>" + month + "</span>";
            break;

        case "DEC":
            html = "<span style='color: #3c763d;'>" + month + "</span>";
            break;

        case "JAN":
            html = "<span style='color: #3c763d;'>" + month + "</span>";
            break;

        case "FEB":
            html = "<span style='color: #3c763d;'>" + month + "</span>";
            break;

        case "MAR":
            html = "<span style='color: #a94442;'>" + month + "</span>";
            break;

        case "APR":
            html = "<span style='color: #a94442;'>" + month + "</span>";
            break;

        case "MAY":
            html = "<span style='color: #a94442;'>" + month + "</span>";
            break;			

        case "JUN":
            html = "<span style='color: #a94442;'>" + month + "</span>";
            break;			

        case "JUL":
            html = "<span style='color: #a94442;'>" + month + "</span>";
            break;			

        case "AUG":
            html = "<span style='color: #a94442;'>" + month + "</span>";
            break;			

        default:
            html = "<span style='color: #0072bc;'>" + month + "</span>";
            break;
    }
    return html;
}

function drawCharts() {
	console.log( "in EA drawCharts" );
	var total = [];
	var mission = [];
	var accession = [];
	var future = [];

	for (i = 0; i < chartitems.length; i++) {
		categories.push( chartitems[i].Title );
		total.push( {
			"y": chartitems[i].Totals,
			"Type": "Total",
			"Mission": TotalMission[0],
			"Accession": TotalAccession[0],
			"Future": TotalFuture[0]
		} );
		mission.push({
			"y": chartitems[i].Mission,
			"Type": "Mission",
			"Mission": chartitems[i].Mission,
			"Accession": chartitems[i].Accession,
			"Future": chartitems[i].Future,
			"YTD_Total": chartitems[i].MissionYTDTotal
		} );

		accession.push( {
			"y": chartitems[i].Accession,
			"Type": "Accession",
			"Mission": chartitems[i].Mission,
			"Accession": chartitems[i].Accession,
			"Future": chartitems[i].Future,
			"YTD_Total": chartitems[i].AccessionYTDTotal 
		} );

		fut.push( {
			"y": chartitems[i].Future,
			"Type": "Future",
			"Mission": chartitems[i].Mission,
			"Accession": chartitems[i].Accession,
			"Future": chartitems[i].Future,
			"YTD_Total": chartitems[i].FutureYTDTotal
		} ); 
	}
	
	chart = Highcharts.chart( 'chart', {
		chart: {
			type: 'column'//,
			//animation: false,
		},
		title: {
			text: 'Enlisted Accessions by Fiscal Year',
			color: '#000000'
		},
		xAxis: {
			categories: categories,
			labels: {
				useHTML: true,
				formatter: function (){
					var xl = drawlabel( this );
					return xl;
				}
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'month'
			},
			opposite: true
		},
		legend: {
			align: 'right',
			x: -30,
			verticalAlign: 'top',
			y: 25,
			floating: true,
			backgroundColor: Highcharts.theme && Highcharts.theme.background2 || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		tooltip: {
			useHTML: true,
			formatter: function (){
				var tt = drawcharttip( this );
				return tt;
			}, positioner: function ( labelWidth, labelHeight, point )	{
				return {
					x: point.plotX + 100,
					y: point.plotY
				};
			}
		},
		plotOptions: {
			column: {
				grouping: false,
				shadow: false,
				borderwidth: 0,
				dataLabels: {
					enabled: true,
					formatter: function (){
						if ( this.y > 0 ) { return this.y; }
					},
					color: Highcharts.theme && Highcharts.theme.dataLabelsColor || 'black'
				}
			},
			series: {
				pointWidth: 20,
				animation: false
			}
		},
		series: [{
			type: 'column',
			name: 'Total',
			stacking: null,
			pointWidth: 30,
			pointPadding: 1,
			data: total,
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}'
			}
		}, {
			name: 'Mission',
			stacking: 'normal',
			color: '#0033cc',
			dataLabels: {
				color: '#ffffff'
			},
			data: mis
		}, {
			name: 'Accession',
			stacking: 'normal',
			color: '#ffaa00',
			data: acc
		}, {
			name: 'Future',
			stacking: 'normal',
			color: '#00dd00',
			data: fut
		}, {
			name: 'Total',
			stacking: 'normal',
			color: '#ffaa77',
			data: total
		}]
	});
	
	$("#chart_loading").hide();	
}

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs( '/sites/cpg/SiteAssets/js/CEWP_CGCOP_EnlistedAccessionsChart.js' );

						// SEP - OCT
					//"LastYearMission":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"LastYearAccession": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"LastYearFuture": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"LastYearMissionYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"LastYearAccessionYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"LastYearFutureYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

					//"ThisYearMission": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"ThisYearAccession":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"ThisYearFuture": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

					//"ThisYearMissionYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"ThisYearAccessionYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"ThisYearFutureYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

					//"NextYearMission": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"NextYearAccession": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"NextYearFuture":  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

					//"NextYearMissionYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"NextYearAccessionYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					//"NextYearFutureYTDTotal": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],


						//for ( var k = 0; k < monthsarr.length; k++ ) {
						//	if ( current.get_item( "Month" ) === monthsarr[k] ) {
						//		var m = current.get_item( "Mission" );
						//		var a = current.get_item( "Accession" );
						//		var f = current.get_item( "Future" );
						//		chartitems[i].Mission = m;
						//		chartitems[i].Accession = a;
						//		chartitems[i].Future = f;
						//		chartitems[i].MissionYTDTotal = TotalMission[0] + m;
						//		chartitems[i].AccessionYTDTotal = TotalAccessions[0] + a;
						//		chartitems[i].FutureYTDTotal = TotalFuture[0] + f;			
						//		chartitems[i].TotalMission += m;
						//		chartitems[i].TotalAccessions += a;
						//		chartitems[i].TotalFuture += f;
						//	}
						//}

						//break;

					//case thisyear :
					//	for ( var k = 0; k < monthsarr.length; k++ ) {
					//		if ( current.get_item( "Month" ) === monthsarr[k] ) {
					//			var m = current.get_item( "Mission" );
					//			var a = current.get_item( "Accession" );
					//			var f = current.get_item( "Future" );
					//			chartitems[i].ThisYearMission[k] = m;
					//			chartitems[i].ThisYearAccession[k] = a;
					//			chartitems[i].ThisYearFuture[k] = f;
					//			if ( k > 0 ) {
					//				chartitems[i].ThisYearMissionYTDTotal[k] = chartitems[i].ThisYearMissionYTDTotal[k - 1] + m;
					//				chartitems[i].ThisYearAccessionYTDTotal[k] = chartitems[i].ThisYearMissionYTDTotal[k - 1] + a;
					//				chartitems[i].ThisYearMissionYTDTotal[k] = chartitems[i].ThisYearMissionYTDTotal[k - 1] + f;
					//			} else {
					//					chartitems[i].ThisYearMissionYTDTotal[k] = m;
					//				chartitems[i].ThisYearAccessionYTDTotal[k] = a;
					//				chartitems[i].ThistYearMissionYTDTotal[k] = f;
					//			}							
					//			TotalMission[1] += m;
					//			TotalAccessions[1] += a;
					//			TotalFuture[1] += f;
					//		}
					//	}

					//	break;

					//case nextyear :
					//	for ( var k = 0; k < monthsarr.length; k++ ) {
					//		if ( current.get_item( "Month" ) === monthsarr[k] ) {
					//			var m = current.get_item( "Mission" );
					//			var a = current.get_item( "Accession" );
					//			var f = current.get_item( "Future" );
					//			chartitems[i].NextYearMission[k] = m;
					//			chartitems[i].NextYearAccession[k] = a;
					//			chartitems[i].NextYearFuture[k] = f;
					//			if ( k > 0 ) {
					//				chartitems[i].NextYearMissionYTDTotal[k] = chartitems[i].ThisYearMissionYTDTotal[k - 1] + m;
					//				chartitems[i].NextYearAccessionYTDTotal[k] = chartitems[i].ThisYearMissionYTDTotal[k - 1] + a;
					//				chartitems[i].NextYearMissionYTDTotal[k] = chartitems[i].ThisYearMissionYTDTotal[k - 1] + f;
					//			} else {
					//					chartitems[i].NextYearMissionYTDTotal[k] = m;
					//				chartitems[i].NextYearAccessionYTDTotal[k] = a;
					//				chartitems[i].NexttYearMissionYTDTotal[k] = f;
					//			}							
					//			TotalMission[2] += m;
					//			TotalAccessions[2] += a;
					//			TotalFuture[2] += f;
					//		}
					//	}

						//break;
				//} 

//function DrawEAChart(site) {
//    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
//		userID = _spPageContextInfo.userId;
//		console.log("userID: ",userID);
//        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
//        console.log("Design Mode = " + inDesignMode);
//        if (inDesignMode === "1") {
//            $("#chart_loading").html("").append("<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>");
//        } else {
//            fys = new Array();
//            chartitems = new Array();
//            var zebra = getChartData();
//            jQuery.when.apply(null, zebra).done(function () {
//				console.log("saw the zebra");
//                console.log("FY getChartData complete.");
//                     drawCharts();
//            });
//        }
//    }, "sp.js");
//}
///////

			//months.mission = mis;
			//months.accession = acc;
			//months.future = fut;

			//months.missiontotal = arrSum( mis );
			//months.accessiontotal = arrSum( acc );
			//months.futuretotal = arrSum( fut );

			//function arrSum (arr){
			//  return arr.reduce(function(a,b){
			//	return a + b
			//  }, 0);
			//}
