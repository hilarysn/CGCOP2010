var CKO = CKO || {};
CKO.KNOWLEDGEMAP = CKO.KNOWLEDGEMAP || {};
CKO.KNOWLEDGEMAP.MAP = CKO.KNOWLEDGEMAP.MAP || {};
CKO.KNOWLEDGEMAP.MAP.VARIABLES = CKO.KNOWLEDGEMAP.MAP.VARIABLES || {};

CKO.KNOWLEDGEMAP.MAP.VARIABLES.Map = {
	mx: 0,
	my: 0,
	org: null,
	orgs: null,
	orgsenum: null,
	mapdata: null,
	mapenum: null,
	mapitems: null,
	markers: [],
	html: "",
	tooltip: null,
	bluelayer: null,
	greenlayer: null,
	goldlayer: null,
	redlayer: null,
	bluegreenlayer: null,
	site: null,
	mcgopts: {
		maxClusterRadius: 40,
		spiderfyOnMaxZoom: true,
		zoomToBoundsOnClick: true,
		showCoverageOnHover: true
	}
};

CKO.KNOWLEDGEMAP.MAP.Map = function () {

	var v = CKO.KNOWLEDGEMAP.MAP.VARIABLES.Map;
	console.log( 'map called ' );

	function Init( site ) {
		//console.log( 'hoo boy before calling KM init' );
		SP.SOD.executeOrDelayUntilScriptLoaded( function () {
			RegisterSod( 'init.js', "/sites/cpg/_layouts/1033/init.js" );
			RegisterSod( 'MicrosoftAjax.js', "/sites/cpg/_layouts/MicrosoftAjax.js" );
			RegisterSod( 'sp.core.js', "/sites/cpg/_layouts/1033/sp.core.js" );
			RegisterSod( 'sp.runtime.js', "/sites/cpg/_layouts/sp.runtime.js" );
			RegisterSod( 'sp.js', site + "/_layouts/sp.js" );
			RegisterSod( 'jquery.min.js', "/SiteAssets/js/jquery.min.js" );
			RegisterSod( 'leaflet.js', site + "/SiteAssets/js/leaflet.js" );
			RegisterSod( 'esri-leaflet.js', site + "/SiteAssets/js/esri-leaflet.js" );
			RegisterSod( 'esri-leaflet-geocoder.js', site + "/SiteAssets/js/esri-leaflet-geocoder.js" );
			RegisterSod( 'leaflet.markercluster.js', site + "/SiteAssets/js/leaflet.markercluster.js" );
			RegisterSod( 'leaflet.markercluster.layersupport.js', site + "/SiteAssets/js/leaflet.markercluster.layersupport.js" );
			RegisterSod( 'CewpKmMap21.js', site + "/SiteAssets/js/CewpKmMap21.js" );
			RegisterSodDep( 'init.js', 'MicrosoftAjax.js' );
			RegisterSodDep( 'MicrosoftAjax.js', 'sp.core.js' );
			RegisterSodDep( 'sp.core.js', 'sp.runtime.js' );
			RegisterSodDep( 'sp.runtime.js', 'sp.js' );
			RegisterSodDep( 'sp.js', 'jquery.min.js' );
			RegisterSodDep( 'jquery.min.js', 'leaflet.js' );
			RegisterSodDep( 'leaflet.js', 'esri-leaflet.js' );
			RegisterSodDep( 'esri-leaflet.js', 'esri-leaflet-geocoder.js' );
			RegisterSodDep( 'esri-leaflet-geocoder.js', 'leaflet.markercluster.js' );
			RegisterSodDep( 'leaflet.markercluster.js', 'leaflet.markercluster.layersupport.js' );
			RegisterSodDep( 'leaflet.markercluster.layersupport.js', 'CewpKmMap21.js' );
			EnsureScriptFunc( "CewpKmMap21.js", null, function () {
				drawMap( site );
				$("#map_loading").hide();
			} );
		}, "SP.js" );
		//console.log( 'hoo boy after calling KM init' );
	}

	function drawMap( site ) {

		try {
			var clientContext = new SP.ClientContext( '/jacothedog' );
		} catch ( ex ) {
			alert( "SP is not loaded! " + ex.message );
		}
	
		getMapData( site );
		console.log("v.mapitems: ",v.mapitems);
		console.log("v.markers: ",v.markers);
		addOrganizations();
		waitTillYourFatherGetsHome();
		function waitTillYourFatherGetsHome() {
			console.log( 'dad came home');
			var currentUrl, value;
			try { currentUrl = '/sites/cpg'; }
			catch ( k ) { currentUrl = ""; }
			if ( currentUrl === '/' || currentUrl === "" ) {
				value = currentUrl + "_layouts/hey_sucker.aspx";
			} else {
				value = currentUrl + "/_layouts/it_worked.aspx";
			}
			//console.log( 'current url value: ', value );

			// since leaflet is bundled into the browserify package it won't be able to detect where the images are
			// solution is to point it to where you host the the leaflet images yourself
			L.Icon.Default.imagePath = '/sites/OCKO/PMT/SiteAssets/html/static/img/';
			// console.log( 'leaflet icon file path: ', L.Icon.Default.imagePath );

			var Esri_WorldStreetMap = L.tileLayer( 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
				minZoom: 3,
				maxZoom: 24
			} );

			// draw the map
			var map = L.map( 'map' ).setView( [35.5, -99], 5 );
			//var map = L.map( this.$refs['mapElement'] ).setView( [36.783862, -76.099385], 3 ),
			// add layer support to the map
			mcgLayerSupportGroup = L.markerClusterGroup.layerSupport(),
				results = L.layerGroup().addTo( map );

			// add the name to the elements, so we can find one of them later
			document.getElementById( 'map' ).map = map;
			var elements = document.getElementsByClassName( 'map' );
			if ( elements.length > 0 ) {
				for ( var i = 0, length = elements.length; i < length; i++ ) {
					elements[i].style.zIndex = i + 2;
				}
			}

			//limit zoom in and zoom out in the map
			map.options.minZoom = 3;
			map.options.maxZoom = 24;

			//Map base map
			var baseMaps = {
				'Esri World StreetMap': Esri_WorldStreetMap
			};

			//Map Overlay and control
			var overlayMaps = {
				"<span id='sos' style='color: blue;'>TRADOC <img src='/sites/OCKO/PMT/SiteAssets/images/blueCircle.gif' alt='blue dot' style='width:10px;height:10px;' align='right'></span>": v.bluelayer,
				//"<span id='sos' style='color: #b3ffff;'>Supported on site & by TRADOC HQ <img src='/sites/OCKO/PMT/SiteAssets/images/bluegreenCircle.gif' alt='bluegreen dot' style='width:10px;height:10px;' align='right'></span>": v.bluegreenlayer,
				"<span id='sthq' style='color: green;'>USACC <img src='/sites/OCKO/PMT/SiteAssets/images/greendot.png' alt='green dot' style='width:10px;height:10px;' align='right></span>": v.greenlayer,
				"<span id='thq' style='text-shadow: 2px 2px #ffaa00; font-weight: 700;'>TRADOC <img src='/sites/OCKO/PMT/SiteAssets/images/goldstar.gif' alt='gold star' style='width:10px;height:10px;' align='right'></span>": v.goldlayer
				//"<span id='ncs' style='color: red;' >Not currently supported <img src='/sites/OCKO/PMT/SiteAssets/images/reddot.png' alt='red dot' style='width:10px;height:10px;' align='right'></span>": v.redlayer
			};

			// Create a Layers Control and add it to the map.
			L.control.layers( null, overlayMaps, {
				collapsed: false
			}).addTo( map );

			//make the (case "Supported by TRADOC HQ") locations active in the layer control
			Esri_WorldStreetMap.addTo( map );
			v.greenlayer.addTo( map );
			v.bluelayer.addTo( map );
			v.goldlayer.addTo( map );

			var searchControl = L.esri.Geocoding.geosearch().addTo( map );
			var gs = L.esri.Geocoding.geocodeService();

			//var location = results.address.Match_addr + "<br><a href='javascript:testclick(" + JSON.stringify(results) + ")'>Click for this location</a>";
			searchControl.on( 'results', function ( data ) {
				results.clearLayers();
				for ( var i = data.results.length - 1; i >= 0; i-- ) {
					results.addLayer( L.marker( data.results[i].latlng ) );
				}
			});

			////build the legend  legend integrated into layers
			//var legend = L.control( { position: 'bottomright' } );
			//legend.onAdd = function ( map ) {
			//	var div = L.DomUtil.create( 'div', 'legend' );
			//	var keycolor = [
			//		'blue',
			//		'green',
			//		'#ffaa00',
			//		'red'
			//	];
			//	var labels = [					//icon legend label
			//		'Supported on site',		//blue
			//		'Supported by TRADOC HQ',	//green
			//		'TRADOC HQ',				//gold
			//		'Not currently supported'	//red
			//	];
			//	var icon = [
			//		'/sites/OCKO/PMT/SiteAssets/images/blueCircle.gif',
			//		'/sites/OCKO/PMT/SiteAssets/images/greendot.png',
			//		'/sites/OCKO/PMT/SiteAssets/images/goldstar.gif',
			//		'/sites/OCKO/PMT/SiteAssets/images/reddot.png'
			//	];
			//	var key = '';
			//	for ( var i = 0; i < labels.length; i++ ) {
			//		var line = '<tr style="font-size: 10px; color:' + keycolor[i] + '"><td>' + labels[i] + '</td><td>&nbsp;&nbsp;&nbsp;<img src="' + icon[i] + '"style="width:12px;height:12px;"</td></tr>';
			//		key += line;
			//	}
			//	div.innerHTML += '<br/><div style="background: #fff; margin-right: 0px; box - shadow: none;	border: 2px solid rgba( 0, 0, 0, 0.2 );	border - radius: 5px;"><table style="font-size: 10px;"><tr style="font-weight: 600"><td>Support Type </td><td>&nbsp;&nbsp;&nbsp;Icon</td></tr>' + key + '</table></div></div>';
			//	return div;
			//};
			//legend.addTo( map );
			//console.log( 'line 218 added legend' );
		}
	}

	function getMapData( site ) {
		console.log( 'line 227 started getMapData' );
		var _spPageContextInfo = window._spPageContextInfo; //added 6-18-19
		var inDesignMode;

		try {
			inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
		} catch ( ex ) {
			console.log( "Check for design mode failed; " + ex.message );
			inDesignMode = 0;
		}

		if ( inDesignMode === "1" ) {
			$( "#map_loading" ).html( "" ).append( "<div style='margin:5px;text-align:center;font-weight:bold;font-size:14px;font-style:italic;'>Query Suspended During Page Edit Mode</div>" );
		} else {

			h1 = $( window ).height();
			h2 = ( Math.floor( h1 / 10 ) * 10 ) - 100;
			h3 = h2 - 150;

			$( '#PMTModal' ).on( 'shown.bs.modal', function ( event ) {
				$( ".pmtmodal" ).css( { height: h2 + "px" } );
				$( "#PMTModal .panel-body" ).css( { height: h3 + "px" } );
				$( "#PMTModal .row" ).css( { "margin-bottom": "10px" } );
			} );

			v.orgs = new Array();
			v.mapitems = new Array();
			v.markers = new Array();
			//get the org data and load it into mapitems
			hsnGetOrgData();
			//console.log("getMapData: v.mapitems is ",v.mapitems)
			//get the PopupData and load it into mapitems.popupdata
			var mappopupdata = getMapPopupData();
			//console.log( "getMapData: mapdata is ", mappopupdata );
			//console.log( "getMapData: v.mapitems is now ", v.mapitems );
		}
	}

	function hsnGetOrgData() {
		console.log( 'Called hsnGetOrgData' );
		//var urlString = "https://hq.tradoc.army.mil/sites/OCKO/PMT/_vti_bin/ListData.svc/Organization?$orderby=ChartOrder&$filter=ShowOnKM%20eq%20true";
		var urlString = "https://hq.tradoc.army.mil/sites/ig/opsadmin/_vti_bin/ListData.svc/IGInspectionCommands?$orderby=CompCommand";
		var data = GetListItems( urlString );
		//console.log( "hsnGetOrgData: GetListItems returned ", data );
		var results = data.responseJSON.d.results;
		//console.log( "hsnGetOrgData: dat.d.results is ", results );
		var jresults = jQuery.parseJSON( JSON.stringify( results ) );
		console.log( "hsnGetOrgData: jresults are ", jresults );
		for ( var i = 0; i < jresults.length; i++ ) {
			v.mapitems.push( {
				"Title": jresults[i]['Title'], //command
				"Base": jresults[i]['Base'],
				"lat": jresults[i]['lat'],
				"lon": jresults[i]['lng'],
				"POC": jresults[i]['POC'],	//commander?
				"Level": jresults[i]['Level'],
				"Type": jresults[i]['OrganizationTypeValue'],
				//"ShowOnChart": jresults[i]['ShowOnChart'],
				//"ShowOnKM:": jresults[i]['ShowOnKM'],
				//"Modified": jresults[i]['Modified'],
				//"MajorAchievements": jresults[i]['MajorAchievements'],
				//"Issues": jresults[i]['Issues'],
				//"Events": jresults[i]['Events'],
				//"FutureChallenges": jresults[i]['FutureChallenges'],
				"PopupData": ""
			} );
		}
		console.log( "hsnGetOrgData: v.mapitems is ", v.mapitems );
	}

	function getMapPopupData() {
		var deferreds = [];
		for ( i = 0; i < v.mapitems.length; i++ ) {
			var base = v.mapitems[i]['Base'];
			deferreds.push( function ( items, i ) {
				if ( items.get_count() > 0 ) {
					var enumerator = items.getEnumerator();
					var cnt = 0;
					while ( enumerator.moveNext() ) {
						var current = enumerator.get_current();
						if ( cnt === 0 ) {
							v.mapitems[i]['PopupData'] = v.mapitems[i]['Type'] + ";" + v.mapitems[i]['Level'] + ";" + base + ";" + v.mapitems[i]['Title'] + ";" + v.mapitems[i]['POC'];
						}
						else {
							v.mapitems[i].PopupData += "|" + v.mapitems[i]['Type'] + ";" + v.mapitems[i]['Level'] + ";" + base + ";" + v.mapitems[i]['Title'] + ";" + v.mapitems[i]['POC'];
						}
						cnt += 1;
					}
				}
			}, function ( sender, args ) {
				console.log( "Error getting data from v.mapitems: " + args.get_message() );
			} );
		}
		console.log( 'getMapPopupData deferreds: ', deferreds );
		return deferreds;
	}

	function GetListItems( qurl ) {
		var ajax = jQuery.ajax( {
			url: qurl,
			async: false,
			method: "GET",
			headers: { 'accept': 'application/json; odata=verbose' },
			error: function ( jqXHR, textStatus, errorThrown ) {
				var err = textStatus + ", " + errorThrown;
				return  "GetListItems Error: " + err;
			},
			success: function ( data ) {
				console.log( "GetListItems AJAX call data is ", data );
				return data;
			}
		} );
		//return ajax.promise();
		console.log( "GetListItems AJAX returned ", ajax );
		return ajax;
	}

	function addOrganizations() {
		console.log( 'line 331 starting addOrganizations' );

		var bluemarkers = [];
		var greenmarkers = [];
		var goldmarkers = [];
		var redmarkers = [];
		var bluegreenmarkers = [];

		// marker cluster groups
		var bluemcg = L.markerClusterGroup( v.mcgopts );
		var greenmcg = L.markerClusterGroup( v.mcgopts );
		var goldmcg = L.markerClusterGroup( v.mcgopts );
		var redmcg = L.markerClusterGroup( v.mcgopts );
		var bluegreenmcg = L.markerClusterGroup( v.mcgopts );
		//console.log( 'line 352 greenmcg: ', greenmcg );
		//console.log( 'line 353 v.mapitems.length: ', v.mapitems.length );
		// draw the icons for map items called by the query string

		for ( var i = 0; i < v.mapitems.length; i++ ) {
			//console.log( 'v.mapitems[i]["lat"]', v.mapitems[i]["lat"] );
			//console.log( 'v.mapitems[i]["lon"]', v.mapitems[i]["lon"] );
			var iconurl = '';
			var img = '';
			var alttext = '';
			var host = 'https://hq.tradoc.army.mil';
			var ttl = v.mapitems[i]['Title'];
			var lat = v.mapitems[i]['lat'];
			var long = v.mapitems[i]['lon'];
			var base = v.mapitems[i]['Base'];
			var POC = v.mapitems[i]['POC'];
			var level = v.mapitems[i]['Level'];
			var type = v.mapitems[i]['Type'];
			var mach = v.mapitems[i]['MajorAchievements'];
			var issues = v.mapitems[i]['Issues'];
			var events = v.mapitems[i]['Events'];
			var fc = v.mapitems[i]['FutureChallenges'];
			var bc = '';
			var popupData = v.mapitems[i]['PopupData'];

			switch ( type ) {
				case "TRADOC HQ":
					iconurl = '/sites/cpg/SiteAssets/images/goldStar.gif';
					img = host + iconurl;
					alttext = 'TRADOC HQ';
					bc = "#fff0b3";
					break;

				case "Supported on site":
					iconurl = '/sites/cpg/SiteAssets/images/blueCircle.gif';
					img = host + iconurl;
					alttext = 'Supported on site';
					bc = "#cce6ff";
					break;

				case "Supported by TRADOC HQ":
					iconurl = '/sites/cpg/SiteAssets/images/greendot.png';
					img = host + iconurl;
					alttext = 'Supported by TRADOC HQ';
					bc = "#e6ffe6";
					break;

				case "Not currently supported":
					iconurl = '/sites/cpg/SiteAssets/images/reddot.png';
					img = host + iconurl;
					alttext = 'Not currently supported';
					bc = "#ffe6e6";
					break;
			}
			if ( base === "Fort Leavenworth" ) {
				iconurl = '/sites/cpg/SiteAssets/images/bluegreenCircle.gif';
				img = host + iconurl;
				alttext = 'Supported by TRADOC HQ and supported on site';
				bc = "#b3ffff";
			}

			var cls = iconurl;
			//console.log( "mapitem ", i, ttl, lat, long, v.mapitems[i]['Type'], iconurl );

			//build the popup
			var redicon = L.icon( {
				iconUrl: '/sites/cpg/SiteAssets/images/amberdot.png',
				iconSize: [20, 20],
				iconAnchor: [20, 20],
				popupAnchor: [0, 40]
			} );

			var blackicon = L.icon( {
				iconUrl: iconurl,
				iconSize: [20, 20],
				iconAnchor: [20, 20],
				popupAnchor: [0, 40]
			} );

			var icon = cls === 'redPopup' ? redicon : blackicon;
			console.log( 'icon: ', icon );
			var panel = cls === 'redPopup' ? 'redPopupPanel' : 'blackPopupPanel';

			// Leaflet onclick modal calls open modal in context of leaflet.
			// var occontent content replaces draw tooltip content 	
			// marker clustering replaces need to build multiple popups and minidashboard
			//onclick content
			var occontent = '<div id="map" class="' + panel + '" style="background-color:' + bc + '">' +
				'<div class = "panelheader" style="color:' + bc + '" >' + ttl + ' at  ' + base + '&nbsp; &nbsp; <img style="width:15px;height:15px;" align = "right" src="' + iconurl + '" alt="' + alttext + '"><br/></div>' +
				'<b>Support Type:</b> ' + type + '<br/>' +
				'<b>Level:</b> ' + level + '<br/>' +
				'<b>POC:</b> ' + POC + '<br/><br/>' +  
				'<b>Major Achievements:</b> ' + mach + '<br/><br/>' + 
				'<b>Issues:</b> ' + issues + '<br/><br/>' + 
				'<b>Events:</b> ' + events + '<br/><br/>' +
				'<b>Future Challenges:</b> ' + fc + '<br/><br/>' + '</div>';

			var ohcontent = popupData;
			console.log( 'ohcontent: ', occontent );
			// add the marker
			var marker = L.marker( [lat, long], { icon: icon } ).bindPopup( occontent, { className: cls } );

			//add onhover control
			marker.on( 'mouseover', function ( ev ) {
				// marker = L.marker( [lat, long], { icon: icon } ).bindPopup( ohcontent, { className: cls } );
				ev.target.openPopup();
			});	

			//console.log( 'marker: ', marker );
			//add to the correct layer
			//console.log( 'type: ', type );
			switch ( type ) {
				case "TRADOC HQ":
					goldmcg.addLayer( marker );
					console.log( 'goldmcg: ', goldmcg );
					goldmarkers.push( marker );
					console.log( 'markers: ', v.markers );
					break;

				case "Supported on site":
					bluemcg.addLayer( marker );
					console.log( 'bluemcg: ', bluemcg );
					bluemarkers.push( marker );
					console.log( 'markers: ', v.markers );
					break;

				case "Supported by TRADOC HQ":
					greenmcg.addLayer( marker );
					console.log( 'greenmcg: ', greenmcg );
					greenmarkers.push( marker );
					break;

				case "Not currently supported":
					redmcg.addLayer( marker );
					redmarkers.push( marker );
					break;
			}
			if ( v.mapitems[i].Base === "Fort Leavenworth" ) {
				bluegreenmcg.addLayer( marker );
				bluegreenmarkers.push( marker );
			}
			v.markers.push( marker );

			console.log( 'got markers into layers: ', v.markers );

			v.bluelayer = bluemcg;
			v.greenlayer = greenmcg;
			v.goldlayer = goldmcg;
			v.redlayer = redmcg;
			v.bluegreenlayer = bluegreenmcg;
			//console.log( 'v.greenlayer: ', v.greenlayer );
			//console.log( 'v.bluelayer: ', v.bluelayer );
			//console.log( 'v.goldlayer: ', v.goldlayer );
			//console.log( 'line 461 ending addOrganizations' );
		}
	}
	
	console.log( 'returning KM Init' );
	return {
		Init: Init
	};
};
SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs( 'CewpKmMap21.js' );