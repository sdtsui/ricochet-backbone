window.quadrantHolder = Backbone.Model.extend({
    //All Quadrants:
	defaults: {
	    Q1A : [
	        'NW,N,N,N,NE,NW,N,N',
	        'W,S,X,X,X,X,SEYH,W',
	        'WE,NWGT,X,X,X,X,N,X',
	        'W,X,X,X,X,X,X,X',
	        'W,X,X,X,X,X,S,X',
	        'SW,X,X,X,X,X,NEBQ,W',
	        'NW,X,E,SWRC,X,X,X,S',
	        'W,X,X,N,X,X,E,NW'
	    ],
	    Q1B : [
	        'NW,NE,NW,N,NS,N,N,N',
	        'W,S,X,E,NWRC,X,X,X',
	        'W,NEGT,W,X,X,X,X,X',
	        'W,X,X,X,X,X,SEYH,W',
	        'W,X,X,X,X,X,N,X',
	        'SW,X,X,X,X,X,X,X',
	        'NW,X,E,SWBQ,X,X,X,S',
	        'W,X,X,N,X,X,E,NW'
	    ],
	    Q2A : [
	        'NW,N,N,NE,NW,N,N,N',
	        'W,X,X,X,X,E,SWBC,X',
	        'W,S,X,X,X,X,N,X',
	        'W,NEYT,W,X,X,S,X,X',
	        'W,X,X,X,E,NWGQ,X,X',
	        'W,X,SERH,W,X,X,X,X',
	        'SW,X,N,X,X,X,X,S',
	        'NW,X,X,X,X,X,E,NW'
	    ],
	    Q2B : [
	        'NW,N,N,N,NE,NW,N,N',
	        'W,X,SERH,W,X,X,X,X',
	        'W,X,N,X,X,X,X,X',
	        'WE,SWGQ,X,X,X,X,S,X',
	        'SW,N,X,X,X,E,NWYT,X',
	        'NW,X,X,X,X,S,X,X',
	        'W,X,X,X,X,NEBC,W,S',
	        'W,X,X,X,X,X,E,NW'
	    ],
	    Q3A : [
	        'NW,N,N,NE,NW,N,N,N',
	        'W,X,X,X,X,SEGH,W,X',
	        'WE,SWRQ,X,X,X,N,X,X',
	        'SW,N,X,X,X,X,S,X',
	        'NW,X,X,X,X,E,NWYC,X',
	        'W,X,S,X,X,X,X,X',
	        'W,X,NEBT,W,X,X,X,S',
	        'W,X,X,X,X,X,E,NW'
	    ],
	    Q3B : [
	        'NW,N,NS,N,NE,NW,N,N',
	        'W,E,NWYC,X,X,X,X,X',
	        'W,X,X,X,X,X,X,X',
	        'W,X,X,X,X,E,SWBT,X',
	        'SW,X,X,X,S,X,N,X',
	        'NW,X,X,X,NERQ,W,X,X',
	        'W,SEGH,W,X,X,X,X,S',
	        'W,N,X,X,X,X,E,NW'
	    ],
	    Q4A : [
	        'NW,N,N,NE,NW,N,N,N',
	        'W,X,X,X,X,X,X,X',
	        'W,X,X,X,X,SEBH,W,X',
	        'W,X,S,X,X,N,X,X',
	        'SW,X,NEGC,W,X,X,X,X',
	        'NW,S,X,X,X,X,E,SWRT',
	        'WE,NWYQ,X,X,X,X,X,NS',
	        'W,X,X,X,X,X,E,NW'
	    ],
	    Q4B : [
	        'NW,N,N,NE,NW,N,N,N',
	        'WE,SWRT,X,X,X,X,S,X',
	        'W,N,X,X,X,X,NEGC,W',
	        'W,X,X,X,X,X,X,X',
	        'W,X,SEBH,W,X,X,X,S',
	        'SW,X,N,X,X,X,E,NWYQ',
	        'NW,X,X,X,X,X,X,S',
	        'W,X,X,X,X,X,E,NW'
	    ]
	},
	initialize: function() {
		this.set('Q1', [this.get('Q1A'),this.get('Q1B')]);
		this.set('Q2', [this.get('Q2A'),this.get('Q2B')]);
		this.set('Q3', [this.get('Q3A'),this.get('Q3B')]);
		this.set('Q4', [this.get('Q4A'),this.get('Q4B')]);
	}
});
