var userID, org, orgs, orgsenum, type, types, total;//, dhtml = "", ahtml = '';
var chart, chartdata, chartenum, chartitem, chartitems;
//var currentpopup = null;
var SLASH = "/";
//var cw, ch;

function DrawKPPMChart(site) {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        userID = _spPageContextInfo.userId;
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
        logit("Design Mode = " + inDesignMode);
        if (inDesignMode === "1") {
            $("#chart_loading").html("").append("<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>");
        }
        else {
            orgs = new Array();
            chartitems = new Array();
            var zebra = getChartOrgData();
            jQuery.when.apply(null, zebra).done(function () {
                logit("Chart getOrgData complete.");
                var fox = getChartData();
                jQuery.when.apply(null, fox).done(function () {
                    logit("Chart Data Loaded!");
                    var stop = "stop";
                    drawCharts();
                });
            });
        }
    }, "sp.js");
}

function getChartOrgData() {
	var deferreds = [];
	
	var inc = "Include(";
    var xml = "<View><Method Name='Read List' /><Query><OrderBy><FieldRef Name='ChartOrder' /></OrderBy><Where><IsNotNull><FieldRef Name='Title' /></IsNotNull></Where></Query>";
    var fields = ["Title", "Base", "Level", "Latitude", "Longitude", "ChartOrder", "ShowOnKM", "ShowOnChart", "POC"];
    xml += "<ViewFields>";
    for (var z = 0; z <= fields.length - 1; z++) {
        xml += "<FieldRef Name='" + fields[z] + "'/>";
        if (z === fields.length - 1) {
            inc += fields[z] + ")";
        }
        else {
            inc += fields[z] + ", ";
        }
    }
    xml += "<FieldRef Name='ID'/>";
    xml += "</ViewFields>";
    xml += "</View>";
	
	deferreds.push($.when(CKO.CSOM.GetListItems.getitemsfilteredcomplex("current", "Organization", xml, inc)).then(function (items) {
        if (items.get_count() > 0) {
            chartenum = items.getEnumerator();
            while (chartenum.moveNext()) {
				chartitem = chartenum.get_current();
				if(chartitem.get_item("ShowOnChart") === true) {
					chartitems.push({ // get chart data
						"Title": chartitem.get_item("Title"),
						"Base": chartitem.get_item("Base"), 
						"Order": chartitem.get_item("ChartOrder"),
						"PopupData": "", 
						"Military": "", 
						"Civilian": "", 
						"Contractor": "",
						"MilitaryCount": 0, 
						"CivilianCount": 0, 
						"ContractorCount": 0,
						"MilTDARequiredCount": 0, 
						"CivTDARequiredCount": 0, 
						"ConTDARequiredCount": 0,
						"MilTDAAuthorizedCount": 0, 
						"CivTDAAuthorizedCount": 0, 
						"ConTDAAuthorizedCount": 0,
						"MilTDAOnhandCount": 0, 
						"CivTDAOnhandCount": 0, 
						"ConTDAOnhandCount": 0, 
						"TotalPeople": 0 
					});
				}
			}
		}
    }, function (sender, args) {
        logit("Error getting data from Organization list : " + args.get_message());
    }));
    return deferreds;
}

function getChartData() {
	var deferreds = [];
	for (i = 0; i < chartitems.length; i++) {
		var title = chartitems[i].Title;
		deferreds.push($.when(CKO.CSOM.GetListItems.getitemsfilteredandpasstoelement("current", "Knowledge Map", "Organization", title, i)).then(function (items, i) {
			if (items.get_count() > 0) {
				var enumerator = items.getEnumerator();
				var con = 0, mil = 0, civ = 0,cnt = 0;
				while (enumerator.moveNext()){
	    			var current = enumerator.get_current();
	    			var type = current.get_item("PersonType");
	    			switch(type){
	    				case "Contractor":
				    		if(current.get_item("Authorized")) { chartitems[i].ConTDAAuthorizedCount += 1; }
				    		if (current.get_item("Required")) { chartitems[i].ConTDARequiredCount += 1; chartitems[i].TotalPeople += 1; }
				    		if(current.get_item("Onhand")) { chartitems[i].ConTDAOnhandCount += 1;}			    			
			    			//chartitems[i].TotalPeople += 1;
	    					break;
	    					
	    				case "Civilian":
				    		if(current.get_item("Authorized")) { chartitems[i].CivTDAAuthorizedCount += 1; }
				    		if (current.get_item("Required")) { chartitems[i].CivTDARequiredCount += 1; chartitems[i].TotalPeople += 1; }
				    		if(current.get_item("Onhand")) { chartitems[i].CivTDAOnhandCount += 1;}    			
			    			//chartitems[i].TotalPeople += 1;
	    					break;
	    					
	    				case "Military":
			    			if(current.get_item("Authorized")) { chartitems[i].MilTDAAuthorizedCount += 1; }
			    			if (current.get_item("Required")) { chartitems[i].MilTDARequiredCount += 1; chartitems[i].TotalPeople += 1; }
				    		if(current.get_item("Onhand")) { chartitems[i].MilTDAOnhandCount += 1;}
			    			//chartitems[i].TotalPeople += 1;
	    					break;
	    			}
	    		}
	    	}    	
    	}, function (sender, args) {
        	logit("Error getting data from KnowledgeMap list: " + args.get_message());
    	}));
    }
    return deferreds;
}

function drawcharttip(obj) {
	var stop = "stop";
	var title = obj.point.category;
	var html = "<div class='chartpopup' id='chartpopupcontainer_" + title.replace(/ /g, "_") + "'>";
	html += "<div class='popRow'>" + obj.point.Type + "</div><div class='popRow'><table class='table'>";
	html += "<tr><td>Required:<td>" + obj.point.Required + "</td></tr>";
	html += "<tr><td>Authorized:<td>" + obj.point.Authorized + "</td></tr>";
	html += "<tr><td>Onhand:<td>" + obj.point.Onhand + "</td></tr>";
	html += "</table></div></div>";
	return html;
}

function drawlabel(obj) {
    var org = obj.value;
    var stop = "stop";
    var html;
    switch (org) {
        case "HQ TRADOC":
            html = "<span style='color: #8a6d3b;'>" + org + "</span>";
            break;

        case "ARCIC":
            html = "<span style='color: #3c763d;'>" + org + "</span>";
            break;

        case "CIMT":
            html = "<span style='color: #3c763d;'>" + org + "</span>";
            break;

        case "CAC":
            html = "<span style='color: #3c763d;'>" + org + "</span>";
            break;

        case "AWG":
            html = "<span style='color: #3c763d;'>" + org + "</span>";
            break;

        case "REF":
            html = "<span style='color: #3c763d;'>" + org + "</span>";
            break;

        case "DLI":
            html = "<span style='color: #a94442;'>" + org + "</span>";
            break;

        case "USASMA":
            html = "<span style='color: #a94442;'>" + org + "</span>";
            break;

        default:
            html = "<span style='color: #0072bc;'>" + org + "</span>";
            break;
    }
    return html;
}

function drawCharts() {
	var categories = [];
	var total = [];
	var civ = [];
	var con = [];
	var mil = [];

	for (i = 0; i < chartitems.length; i++) {
		categories.push(chartitems[i].Title);
		//total.push(chartitems[i].TotalPeople);
		total.push({
			"y": chartitems[i].TotalPeople,
			"Type": "Total",
			"Required": chartitems[i].CivTDARequiredCount + chartitems[i].ConTDARequiredCount + chartitems[i].MilTDARequiredCount,
			"Authorized": chartitems[i].CivTDAAuthorizedCount + chartitems[i].ConTDAAuthorizedCount + chartitems[i].MilTDAAuthorizedCount,
			"Onhand": chartitems[i].CivTDAOnhandCount + chartitems[i].ConTDAOnhandCount + chartitems[i].MilTDAOnhandCount
		});
		civ.push({
			"y": chartitems[i].CivTDAOnhandCount,
			"Type": "Civilian",
			"Required": chartitems[i].CivTDARequiredCount,
			"Authorized": chartitems[i].CivTDAAuthorizedCount,
			"Onhand": chartitems[i].CivTDAOnhandCount
		});
		con.push({
			"y": chartitems[i].ConTDAOnhandCount,
			"Type": "Contractor",
			"Required": chartitems[i].ConTDARequiredCount,
			"Authorized": chartitems[i].ConTDAAuthorizedCount,
			"Onhand": chartitems[i].ConTDAOnhandCount
		});
		mil.push({
			"y": chartitems[i].MilTDAOnhandCount,
			"Type": "Military",
			"Required": chartitems[i].MilTDARequiredCount,
			"Authorized": chartitems[i].MilTDAAuthorizedCount,
			"Onhand": chartitems[i].MilTDAOnhandCount
		});
	}
	
	chart = Highcharts.chart('chart', {
	    chart: {
	        type: 'column',
	        animation: false
	    },
	    title: {
	        text: 'KPPM Manpower Status',
	        color: '#000000'
	    },
	    xAxis: {
            categories: categories,
            labels: {
                useHTML: true,
                formatter: function () {
                    var xl = drawlabel(this);
                    return xl;
                }
            }
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: 'Manpower'
	        }	    
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
	        formatter: function() {
	        	var tt = drawcharttip(this);
	        	return tt;
	        },
	        positioner: function(labelWidth, labelHeight, point) {
				return {
					x: point.plotX + 100,
					y: point.plotY
				};
	        }
	    },
	    plotOptions: {
	        column: {
	        	grouping: false,
	            dataLabels: {
	                enabled: true,
	                formatter: function(){
	                	if(this.y > 0) { return this.y; }
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
	    },
	    {
	        name: 'Civilian',
	        stacking: 'normal',
	        color: '#0033cc',
	        dataLabels: {
	        	color: '#ffffff'
	        },
	        data: civ
		}, {
			name: 'Contractor',
			stacking: 'normal',
			color: '#ffaa00',
			data: con
		}, {
			 name: 'Military',
			stacking: 'normal',
			color: '#00dd00',
			data: mil
		}]
	});
	
	$("#chart_loading").hide();
}

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('CEWP_KM_Chart.js');