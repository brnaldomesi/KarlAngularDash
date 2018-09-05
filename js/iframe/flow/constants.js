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

RoutineDefault = {
    0: {name: 'Sun', start: 0, end: 24, work: false},
    1: {name: 'Mon', start: 0, end: 24, work: true},
    2: {name: 'Tue', start: 0, end: 24, work: true},
    3: {name: 'Wen', start: 0, end: 24, work: true},
    4: {name: 'Thu', start: 0, end: 24, work: true},
    5: {name: 'Fri', start: 0, end: 24, work: true},
    6: {name: 'Sat', start: 0, end: 24, work: false}
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
    ORDER_STATE_BOOKING : 0,
    ORDER_STATE_RUN : 1,
    ORDER_STATE_DRIVER_UNRUN : 2,
    ORDER_STATE_SETTLE_ERROR : 3,
    ORDER_STATE_DONE : 4,
    ORDER_STATE_ADMIN_CANCEL : 5,
    ORDER_STATE_SUPER_ADMIN_CANCEL : 6,
    ORDER_STATE_PASSENGER_CANCEL : 7,
    ORDER_STATE_TIMES_UP_CANCEL : 8,
    ORDER_STATE_WAIT_DETERMINE : 9
};

OrderTripState = {
    TRIP_STATE_WAIT_TO_DEPARTURE : 0,
    TRIP_STATE_DRIVE_TO_PICK_UP : 1,
    TRIP_STATE_WAITING_CUSTOMER : 2,
    TRIP_STATE_GO_TO_DROP_OFF : 3,
    TRIP_STATE_WAITING_DRIVER_DETERMINE : 4,
    TRIP_STATE_WAITING_TO_SETTLE : 5,
    TRIP_STATE_SETTLING : 6,
    TRIP_STATE_SETTLE_DONE : 7
};

YoutobeUrls = {
    0: "https://www.youtube.com/embed/I3fPdxReKW8",//home
    1: "https://www.youtube.com/embed/KRcam1kJsIo",//book
    2: "",
    3: ""
};


RateType = {
    LONG : 1,
    HOUR : 2,
    TRAN : 3
};

BookingCheck = {
    TRAN : 1,
    HOUR : 2,
    CUST : 3
};

AnLocked={
    Locked : 1,
    Unlocked : 0
};



