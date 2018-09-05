// 这里放一些程序使用的常量申明

// calendar事件类型
EventCalendarType = {
    Car: 2,
    Driver: 1
};

TimeClock = {
    0: {index_id: 0, time: '12:00 AM'},
    1: {index_id: 1, time: '01:00 AM'},
    2: {index_id: 2, time: '02:00 AM'},
    3: {index_id: 3, time: '03:00 AM'},
    4: {index_id: 4, time: '04:00 AM'},
    5: {index_id: 5, time: '05:00 AM'},
    6: {index_id: 6, time: '06:00 AM'},
    7: {index_id: 7, time: '07:00 AM'},
    8: {index_id: 8, time: '08:00 AM'},
    9: {index_id: 9, time: '09:00 AM'},
    10: {index_id: 10, time: '10:00 AM'},
    11: {index_id: 11, time: '11:00 AM'},
    12: {index_id: 12, time: '12:00 PM'},
    13: {index_id: 13, time: '01:00 PM'},
    14: {index_id: 14, time: '02:00 PM'},
    15: {index_id: 15, time: '03:00 PM'},
    16: {index_id: 16, time: '04:00 PM'},
    17: {index_id: 17, time: '05:00 PM'},
    18: {index_id: 18, time: '06:00 PM'},
    19: {index_id: 19, time: '07:00 PM'},
    20: {index_id: 20, time: '08:00 PM'},
    21: {index_id: 21, time: '09:00 PM'},
    22: {index_id: 22, time: '10:00 PM'},
    23: {index_id: 23, time: '11:00 PM'},
    24: {index_id: 24, time: '11:59 PM'}
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

RoutineDefault = {
    0: {name: 'comment.h5Sun', start: 0, end: 24, work: false},
    1: {name: 'comment.h5Mon', start: 0, end: 24, work: true},
    2: {name: 'comment.h5Tue', start: 0, end: 24, work: true},
    3: {name: 'comment.h5Wen', start: 0, end: 24, work: true},
    4: {name: 'comment.h5Thu', start: 0, end: 24, work: true},
    5: {name: 'comment.h5Fri', start: 0, end: 24, work: true},
    6: {name: 'comment.h5Sat', start: 0, end: 24, work: false}
};

PaymentMethod = {
    1: "PayPal",
    2: "Chase",
    3: "Stripe"
};

CreditCardType = {
    1: "VISA",
    2: "MasterCard",
    3: "AmericanExpress",
    4: "DISCOVER"
};


OrderOrderState = {
    ORDER_STATE_BOOKING: 0,
    ORDER_STATE_RUN: 1,
    ORDER_STATE_DRIVER_UNRUN: 2,
    ORDER_STATE_SETTLE_ERROR: 3,
    ORDER_STATE_DONE: 4,
    ORDER_STATE_ADMIN_CANCEL: 5,
    ORDER_STATE_SUPER_ADMIN_CANCEL: 6,
    ORDER_STATE_PASSENGER_CANCEL: 7,
    ORDER_STATE_TIMES_UP_CANCEL: 8,
    ORDER_STATE_WAIT_DETERMINE: 9
};

OrderTripState = {
    TRIP_STATE_WAIT_TO_DEPARTURE: 0,
    TRIP_STATE_DRIVE_TO_PICK_UP: 1,
    TRIP_STATE_WAITING_CUSTOMER: 2,
    TRIP_STATE_GO_TO_DROP_OFF: 3,
    TRIP_STATE_WAITING_DRIVER_DETERMINE: 4,
    TRIP_STATE_WAITING_TO_SETTLE: 5,
    TRIP_STATE_SETTLING: 6,
    TRIP_STATE_SETTLE_DONE: 7
};

YoutobeUrls = {
    0: "https://www.youtube.com/embed/I3fPdxReKW8",//home
    1: "https://www.youtube.com/embed/KRcam1kJsIo",//book
    2: "",
    3: ""
};


RateType = {
    LONG: 1,
    HOUR: 2,
    TRAN: 3
};

BookingCheck = {
    TRAN: 1,
    HOUR: 2,
    CUST: 3
};

AnLocked = {
    Locked: 1,
    Unlocked: 0
};

viewTitles = {
    0: 'header_menu.h5home',
    1: 'header_menu.h5easy_book',
    2: 'header_menu.h5calendar',
    3: 'header_menu.h5vehicles',
    4: 'header_menu.h5drivers',
    5: 'header_menu.h5add-Ons',
    6: 'header_menu.h5stats',
    7: 'header_menu.h5Clients',
    8: 'header_menu.h5affiliate_network',
    9: 'header_menu.h5rates',
    10: 'header_menu.h5finance',
    11: 'header_menu.h5companies',
    12: 'header_menu.h5car_model',
    13: 'header_menu.h5profile',
    14: 'header_menu.h5vehicle_category',
    15: 'header_menu.h5vehicle_maker',
    16: 'header_menu.h5vehicle_model',
    17: 'header_menu.h5super_stats',
    18: 'header_menu.h5Setting',
    19: 'header_menu.h5salesRep',
    20: 'header_menu.h5Sales_Rep_home',
    21: 'header_menu.h5Sales_Rep_totals',
    22: 'header_menu.h5Sales_Rep_companies',
    23: 'header_menu.h5RateRule',
    24: 'header_menu.h5salesAssistant',
    25: 'header_menu.h5Sales_Assistant_home',
    26: 'header_menu.h5Sales_Assistant_companies',
    27: 'God view',
    28: 'header_menu.h5coupon'
};

countrysCode = [
    {
        name: 'USA',
        countryCode: 'USA'
    },
    {
        name: 'France',
        countryCode: 'FRA'
    },
    {
        name: 'UK',
        countryCode: 'GBR'
    },
    {
        name: 'China',
        countryCode: 'CHN'
    }
];

defaultCompanyLanguage = [
    {
        title: 'English',
        value: 'en'
    },
    {
        title: 'France',
        value: 'fr'
    }
];

defaultCurrency = [
    {
        title: 'USD',
        value: 'USD'
    },
    {
        title: 'EUR',
        value: 'EUR'
    },
    {
        title: 'GBP',
        value: 'GBP'
    },
    {
        title: 'AUD',
        value: 'AUD'
    },
    {
        title: 'DKK',
        value: 'DKK'
    },
    {
        title: 'CAD',
        value: 'CAD'
    },
    {
        title: 'HKD',
        value: 'HKD'
    },
    {
        title: 'JPY',
        value: 'JPY'
    },
    {
        title: 'NZD',
        value: 'NZD'
    },
    {
        title: 'NOK',
        value: 'NOK'
    },
    {
        title: 'SGD',
        value: 'SGD'
    },
    {
        title: 'SEK',
        value: 'SEK'
    },
    {
        title: 'CHF',
        value: 'CHF'
    },
];