<template>
	<div id="TaskerData">
		<div v-if="loading" class="widgetbody"><span class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</span></div>
		<vue-highcharts class="chart" :options="chartOptions" ref="pieTTCharts"></vue-highcharts>
		<b-modal id="taskertablesForFiltered" ref="taskertableForFiltered" centered size="lg" title="Tasker Data" ok-only ok-variant="info" ok-title="Ok" @ok="yourOkFn">
			<div class="container-fluid">
				<table id='tblNoSDate' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in nosdate'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="trole">{{due.TaskerRole}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblOverdue' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in overdue'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblDueToday' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in duetoday'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblThirty' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in thirty'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblSixty' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in sixty'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblNinety' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in ninety'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblGtNinety' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in gtninety'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</b-modal>
		<b-modal id="taskertables" ref="taskertable" centered size="lg" title="Tasker Data" ok-only ok-variant="info" ok-title="Ok" @ok="yourOkFn">
			<div class="container-fluid">
				<table id='tblNoSDate' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in nosdate'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblOverdue' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in overdue'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblDueToday' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in duetoday'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblThirty' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in thirty'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblSixty' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in sixty'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblNinety' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in ninety'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
				<table id='tblGtNinety' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
					<thead>
						<tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
					</thead>
					<tbody>
						<tr v-for='due in gtninety'>
							<td class="control">{{due.ControlNumber}}</td>
							<td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
							<td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
							<td class="tlead">{{due.TaskerLeads}}</td>
							<td class="tassist">{{due.TaskerAssists}}</td>
							<td class="tinfo">{{due.TaskerInfo}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</b-modal>
	</div>
</template>
<script>
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue2-highcharts'
	import moment from 'moment'
	import JQuery from 'jquery'
	var jQuery = require('jquery')
	var Moment = require('moment')
	export default {
	components: {
		VueHighcharts
	},
	name: 'taskerstracker-chart',
    data: function () {
		var titleText = 'All Open CATS Taskers';
		if ( filter !== "All Taskers" ) titleText = 'CATS Taskers for ' + filter;
		return {
			chartdata: [],
			filter: filter,
			chartOptions: {
				colors: ["orange", "red", "yellow", "green", "blue", "black", "purple"],
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'pie'
				},
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
								color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
							}
						}
					},
					series: {
						cursor: 'pointer',
						//point: { //vue
						//	events: {
						//		click: ({ point }) => {
						//			this.showtable(point.name); //****
						//			console.log("calling showtable");
						//		}
						//	}
						//}
						point: {
							events: {
								//click: function ( a )
								//{
								//	if ( a.point.name === v.subforsymbol ) a.point.name = 'GtNinety';
								//	var de = document.createElement( 'p' );
								//	if ( filter !== "All Taskers" ) {
								//		de.innerHTML = buildTable( a.point.name ); // sends a.point.name === z	a.k.a. GtNinety
								//	} else {
								//		de.innerHTML = buildTableDifferent( a.point.name ); // sends a.point.name === z	a.k.a. GtNinety
								//	}
								//	var options = SP.UI.$create_DialogOptions();
								//	options.title = FormatTitle( a.point.name );
								//	options.width = 830;
								//	options.showClose = false;
								//	options.html = de;
								//	ExecuteOrDelayUntilScriptLoaded( SP.UI.ModalDialog.showModalDialog( options ), HideForIFrame() );
								//}
								click: ({ point }) => {
									this.showtable(point.name, filter); //****
									console.log("calling showtable");
								}
							}
						}
					}
				},
				series: []
			},
			loading: true,
			loaded: false,
			showModal: false,

			nosdate: [],  //nos
			overdue: [],  //o
			duetoday: [], //dt
			thirty: [],   //t
			sixty: [],    //s
			ninety: [],   //n
			gtninety: [], //gtn

			isdev: false,
			isTKECloud: false,
			subforsymbol: ">Ninety",		// highcharts does not like ">" as a character

			NOSCount: 0,
			OCount: 0,
			DTCount: 0,
			TCount: 0,
			SCount: 0,
			NCount: 0,
			GTNCount: 0
		}
    },
    created: function () {
      // this.init();
    },
    mounted: function () {
      //this.$nextTick(function () {
      //  // Code that will run only after the
      //  // entire view has been rendered
      this.init();
      //})
    },
    methods: {
		init: function () {
		let location = String(window.location);
			if (location.indexOf('hq.') > 0) {
			  this.isdev = false;
			}
			if ( location.indexOf( 'sharepoint.' ) > 0 ) {
				this.isTKECloud = true;
			}
			var SLASH = "/";
			//webAbsoluteUrl ===
			var tp1 = new String( window.location.protocol ); // alt === siteAbsoluteUrl
			var tp2 = new String( window.location.host );
			var tp3 = L_Menu_BaseUrl; // alt === webServerRelativeUrl
			console.log( "tp3/L_Menu_BaseUrl ", tp3, " webServerRelativeUrl: ", new String( window.location.host ), " webServerRelativeUrl: ", new String( window.location.host ) );
			
			var localSite = tp1 + SLASH + SLASH + tp2 + tp3;

			this.getFilterstring();
		},
		getFilterstring( localSite ) {
			// checking validity of value sent by init()
			console.log( "String( window.location ): ", String( window.location ) ); 
			var fUrlString = localSiteURL + "/_vti_bin/listdata.svc/CATSTaskersFilterValue?$select=Id,FilterValue";
			if ( isTKECloud === true ) fUrlString = localSiteURL + "/_api/Web/Lists/GetByTitle('CATSTaskersFilterValue')/Items?$select=Id,FilterValue";
			console.log( "filtering rest call url: ", fUrlString );
			jQuery.ajax( {
				url: fUrlString,
				method: "GET",
				async: false,
				headers: { 'accept': 'application/json; odata=verbose' },
				error: function ( jqXHR, textStatus, errorThrown ){
					logit( "Error Status: " + textStatus + ":: errorThrown: " + errorThrown );
				},
				success: function ( data ){
					var f = jQuery.parseJSON( JSON.stringify( data.d.results ) );
					var filter = '';
					console.log( " f: ", f );
					for ( var i = 0; i < f.length; i++ ) {
						filter += f[i]["FilterValue"];
					}
					console.log( "Taskers Tracker filter: ", filter );
					this.GetTaskers( filter );
				}
			} );
		},
		filter: filter,
		getTaskers: function ( filter) {
			if (!this.isdev) {
				//console.log( "In TaskersTracker GetTaskers" );
				//base qry to static target list
				// we are told CATS will not be migrated to 2013...
				var urlString0 = "https://hq.tradoc.army.mil/sites/CATS/_vti_bin/listdata.svc/Taskers?$select=";
				urlString0 += "Id,ControlNumber,SuspenseDate,TaskerName,TaskerLeads,TaskerAssists,TaskerInfo,CompletionStatusValue&$orderby=SuspenseDate&$filter=";
				// differnce is number of ending right parentheses
				var urlString = urlString0 + "((CompletionStatusValue%20eq%20%27Open%27)";

				var filterstring = "and((substringof(%27" + filter + "%27,TaskerLeads))or(substringof(%27" + filter + "%27,TaskerAssists))or(substringof(%27" + filter + "%27,TaskerInfo))))";
				if ( filter !== "All Taskers" ) {
					urlString += filterstring;
				} else {
					urlString = urlString0 + "((CompletionStatusValue%20eq%20%27Open%27))";
				}
				console.log( "url called TaskersChart: ", urlString );

				var taskers = this;
				let pieCharts = this.$refs.pieTTCharts;
				jQuery.ajax({
					url: urlString,
					method: "GET",
					headers: { 'accept': 'application/json; odata=verbose' },
					error: function (jqXHR, textStatus, errorThrown) {
						logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
					},
					success: function (data) {
						taskers.loading = false;
						taskers.loaded = true;
						var j = jQuery.parseJSON(JSON.stringify(data.d.results));
						console.log( "1. In CATSTaskersTracker GetTaskers j: ", j );
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

						console.log( "no: ", no, "o: ", o, " dt: ", dt, " t: ", t, " s: ", s, " n: ", n, " gtn: ", gtn );
						// these array names === popup title
						taskers.NoDate = no;
						taskers.Overdue = o;
						taskers.DueToday = dt;
						taskers.Thirty = t;
						taskers.Sixty = s;
						taskers.Ninety = n;
						taskers.GtNinety = gtn;

						console.log( "taskers.nodate: ", taskers.nodate, " taskers.overdue: ", taskers.overdue, "taskers.duetoday: ", taskers.duetoday, " taskers.thirty: ", taskers.thirty, " taskers.sixty: ", taskers.sixty, " taskers.ninety: ", taskers.ninety, " taskers.gtninety: ", taskers.gtninety );

						taskers.NoCount = no.length;
						taskers.OCount = o.length;
						taskers.DTCount = dt.length;
						taskers.TCount = t.length;
						taskers.SCount = s.length;
						taskers.NCount = n.length;
						taskers.GtNCount = gtn.length;

						console.log( "number of taskers: nodate: ", taskers.noCount, " overdue: ", taskers.OCount, " due today: ", taskers.DTCount, " t: ", taskers.TCount, " s: ", taskers.SCount, " n: ", taskers.NCount, " gtn: ", taskers.GtNCount );
						var subforsymbol = ">Ninety";		// highcharts does not like ">" as a character
						taskers.chartdata = [
							{ 'name': 'NoDate', 'y': taskers.NoCount },
							{ 'name': 'Overdue', 'y': taskers.OCount },
							{ 'name': 'DueToday', 'y': taskers.DTCount },
							{ 'name': 'Thirty', 'y': taskers.TCount },
							{ 'name': 'Sixty', 'y': taskers.SCount },
							{ 'name': 'Ninety', 'y': taskers.NCount },
							{ 'name': subforsymbol, 'y': taskers.GtNCount }
						];

				//console.log( "v.taskers.chartdata: ", v.taskers.chartdata );

						pieCharts.addSeries({
							name: 'Status',
							data: tasks.chartdata
						});
					}
				});
			}
		},
		formatDate: function (d) {
			return d === null ? "" : Moment(d).add(8,'hours').format("MM-DD-YYYY");
		},
		yourOkFn: function () {
			this.showModal = false;
			jQuery(".ms-dlgDisable").show();
			//alert("You\'re OK");
		},
		popup: function (id, title, body) {
			//$("#tdBody").html(body); //
			//console.log("Body: " + $("#tdBody").html()); //
			console.log("popup in TaskersChart");
		},
		closepopup: function (){

		},
		showtable: function (point, filter) {
			if ( a.point.name === subforsymbol ) a.point.name = 'GtNinety';
			if ( point !== 0 && filter === "All Taskers" ) {
				jQuery( ".table-taskers" ).hide();
				jQuery( "#tbl" + point ).show();
				this.$refs["taskertable"].show();
				jQuery( ".ms-dlgDisable" ).hide();
			}
			if ( point !== 0 && filter !== "All Taskers" ) {
				jQuery(".table-taskers").hide();
				jQuery("#tbl" + point).show();
				this.$refs["taskertableForFiltered"].show();
				jQuery(".ms-dlgDisable").hide();
			}
		},
		FormatTitle: function (z) {
			console.log("in FormatTitle");
			var title = "";
			switch (z) {
				case "NoDate":
					title = this.NoCount + " Taskers with No Suspense Date";;
					break
				case "Overdue":
					title = this.OCount + " Taskers Overdue";
					break;
				case "DueToday":
					title = this.DTCount + " Taskers Due Today";
					break
				case "Thirty":
					title = this.TCount + " Taskers Due in 30 Days";
					break;
				case "Sixty":
					title = this.SCount + " Taskers Due in 60 Days";
					break;
				case "Ninety":
					title = this.NCount + " Taskers Due in 90 Days";
					break;
				case "gtninety":
					title = this.GtNCount + " Taskers Due in More Than 90 Days"; 
					break;
			}
			return title;
		}
    },
		updated: function () {
			this.loading = false;
			this.loaded = true;
		}
	}
</script>
<style scoped>
  body {
    font-size: 0.8em;
  }
  .widgetbody {
    width: 100%;
    min-height: 100px;
    position: relative;
  }
  .loading {
    color: #2df20f;
    font-size: 30px;
    line-height: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fa-spinner {
    color: #2df20f;
    font-size: 30px;
    line-height: 30px;
  }
  .table td, .table th {
    padding: .2rem;
  }
  .control { width: 80px; }
  .suspense { width: 90px; }
  .tasklead { width: 90px; }
  .tlead { width: 73px; }
  .poplink { cursor: pointer; text-decoration: none !important; }
  tbody {
    display: block;
    height: 400px;
    overflow-y: scroll;
  }
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed; 
  }
  .highcharts-container {
    width: 60%;
    text-align: center;
  }
  .col-lg-4 {
    -ms-flex: 0 0 50.00%;
    flex: 0 0 50.00%;
    max-width: 50.00%;
  }
  .panel-black > .panel-header {
    display: none;
  }
  .ms-WPBody noindex ms-wpContentDivSpace #WebPartWPQ11 {
    overflow: visible;
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-dialog {
    max-width: 800px;
    width: 800px;
  }
  .modal-body {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: auto;
  }
  .modal-header .close {
    display: none;
  }
  .show .modal .modal-dialog {
    -webkit-transform: translate(0,0);
    transform: translate(-1,-1);
  }
  #taskertables___BV_modal_footer_ {
    display: none;
  }
  #taskertablesForFiltered___BV_modal_footer_ {
	display: none;
  }
</style>
