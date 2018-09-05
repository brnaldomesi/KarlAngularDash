/**
 * Created by liqihai on 16/8/17.
 */

TimeClock={
    0: {index_id: 0,  time:'12:00 AM'},
    1: {index_id: 1,  time:'01:00 AM'},
    2: {index_id: 2,  time:'02:00 AM'},
    3: {index_id: 3,  time:'03:00 AM'},
    4: {index_id: 4,  time:'04:00 AM'},
    5: {index_id: 5,  time:'05:00 AM'},
    6: {index_id: 6,  time:'06:00 AM'},
    7: {index_id: 7,  time:'07:00 AM'},
    8: {index_id: 8,  time:'08:00 AM'},
    9: {index_id: 9,  time:'09:00 AM'},
    10:{index_id: 10, time:'10:00 AM'},
    11:{index_id: 11, time:'11:00 AM'},
    12:{index_id: 12, time:'12:00 PM'},
    13:{index_id: 13, time:'01:00 PM'},
    14:{index_id: 14, time:'02:00 PM'},
    15:{index_id: 15, time:'03:00 PM'},
    16:{index_id: 16, time:'04:00 PM'},
    17:{index_id: 17, time:'05:00 PM'},
    18:{index_id: 18, time:'06:00 PM'},
    19:{index_id: 19, time:'07:00 PM'},
    20:{index_id: 20, time:'08:00 PM'},
    21:{index_id: 21, time:'09:00 PM'},
    22:{index_id: 22, time:'10:00 PM'},
    23:{index_id: 23, time:'11:00 PM'},
    24:{index_id: 24, time:'12:00 AM'}
};

frTimeClock = {
    0: {index_id: 0, time: '00:00'},
    1: {index_id: 1, time: '01:00'},
    2: {index_id: 2, time: '02:00'},
    3: {index_id: 3, time: '03:00'},
    4: {index_id: 4, time: '04:00'},
    5: {index_id: 5, time: '05:00'},
    6: {index_id: 6, time: '06:00'},
    7: {index_id: 7, time: '07:00'},
    8: {index_id: 8, time: '08:00'},
    9: {index_id: 9, time: '09:00'},
    10: {index_id: 10, time: '10:00'},
    11: {index_id: 11, time: '11:00'},
    12: {index_id: 12, time: '12:00'},
    13: {index_id: 13, time: '13:00'},
    14: {index_id: 14, time: '14:00'},
    15: {index_id: 15, time: '15:00'},
    16: {index_id: 16, time: '16:00'},
    17: {index_id: 17, time: '17:00'},
    18: {index_id: 18, time: '18:00'},
    19: {index_id: 19, time: '19:00'},
    20: {index_id: 20, time: '20:00'},
    21: {index_id: 21, time: '21:00'},
    22: {index_id: 22, time: '22:00'},
    23: {index_id: 23, time: '23:00'},
    24: {index_id: 24, time: '23:59'}
};

DriverRoutineDefault={
    0: {name:'board_comment.h5Sun',start:0,end:24,work:false},
    1: {name:'board_comment.h5Mon',start:9,end:17,work:true},
    2: {name:'board_comment.h5Tue',start:9,end:17,work:true},
    3: {name:'board_comment.h5Wen',start:9,end:17,work:true},
    4: {name:'board_comment.h5Thu',start:9,end:17,work:true},
    5: {name:'board_comment.h5Fri',start:9,end:17,work:true},
    6: {name:'board_comment.h5Sat',start:0,end:24,work:false}
};

DriverDelayTime={
    0:{hour_value:1,  hours:'board_comment.h51hour'},
    1:{hour_value:2,  hours:'board_comment.h52hour'},
    2:{hour_value:3,  hours:'board_comment.h53hour'},
    3:{hour_value:4,  hours:'board_comment.h54hour'},
    4:{hour_value:5,  hours:'board_comment.h55hour'},
    5:{hour_value:6,  hours:'board_comment.h56hour'},
    6:{hour_value:7,  hours:'board_comment.h57hour'},
    7:{hour_value:8,  hours:'board_comment.h58hour'},
    8:{hour_value:24, hours:'board_comment.h524hour'},
    9:{hour_value:48, hours:'board_comment.h548hour'}
};
USAStates={
     0:{value:'AL',state:'AL'},
     1:{value:'AK',state:'AK'},
     2:{value:'AZ',state:'AZ'},
     3:{value:'AR',state:'AR'},
     4:{value:'CA',state:'CA'},
     5:{value:'CO',state:'CO'},
     6:{value:'CT',state:'CT'},
     7:{value:'DE',state:'DE'},
     8:{value:'FL',state:'FL'},
     9:{value:'GA',state:'GA'},
    10:{value:'HI',state:'HI'},
    11:{value:'ID',state:'ID'},
    12:{value:'IL',state:'IL'},
    13:{value:'IN',state:'IN'},
    14:{value:'IA',state:'IA'},
    15:{value:'KS',state:'KS'},
    16:{value:'KY',state:'KY'},
    17:{value:'LA',state:'LA'},
    18:{value:'ME',state:'ME'},
    19:{value:'MD',state:'MD'},
    20:{value:'MA',state:'MA'},
    21:{value:'MI',state:'MI'},
    22:{value:'MN',state:'MN'},
    23:{value:'MS',state:'MS'},
    24:{value:'MO',state:'MO'},
    25:{value:'MT',state:'MT'},
    26:{value:'NE',state:'NE'},
    27:{value:'NV',state:'NV'},
    28:{value:'NH',state:'NH'},
    29:{value:'NJ',state:'NJ'},
    30:{value:'NM',state:'NM'},
    31:{value:'NY',state:'NY'},
    32:{value:'NC',state:'NC'},
    33:{value:'ND',state:'ND'},
    34:{value:'OH',state:'OH'},
    35:{value:'OK',state:'OK'},
    36:{value:'OR',state:'OR'},
    37:{value:'PA',state:'PA'},
    38:{value:'RI',state:'RI'},
    39:{value:'SC',state:'SC'},
    40:{value:'SD',state:'SD'},
    41:{value:'TN',state:'TN'},
    42:{value:'TX',state:'TX'},
    43:{value:'UT',state:'UT'},
    44:{value:'VT',state:'VT'},
    45:{value:'VA',state:'VA'},
    46:{value:'WA',state:'WA'},
    47:{value:'WV',state:'WV'},
    48:{value:'WI',state:'WI'},
    49:{value:'WY',state:'WY'}
};
countryCurrency=[
    // {id:1,country:'CN',currency:'CNY'},
    {id:2,country:'US',currency:'USD'},
    // {id:3,country:'CA',currency:'CAD'},
    {id:3,country:'GB',currency:'GBP'},
    {id:4,country:'EURO',currency:'EUR'}
];

EuropeCountry=['IT','FR','DE','ES','PT','GR','NO','SE','CH','AT','BE','CZ','FI','LU','NL'];

