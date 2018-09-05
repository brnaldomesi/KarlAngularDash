Api = {
    user: {
        login: ApiServer.serverUrl + ApiServer.version + '/login',
        logout: ApiServer.serverUrl + ApiServer.version + '/logout'
    },
    admin: {
        updateAdmin: ApiServer.serverUrl + ApiServer.version + '/companies/admins',
        changeAvatar: ApiServer.serverUrl + ApiServer.version + '/admins/avatar',
        changePassword: ApiServer.serverUrl + ApiServer.version + '/users/change/password',
        forgotPassword: ApiServer.serverUrl + ApiServer.version + '/dashboard/template/password',
        getProxyAdmin: ApiServer.serverUrl + ApiServer.version + '/companies/proxy/admin',
        createProxyAdmin: ApiServer.serverUrl + ApiServer.version + '/companies/proxy/admin',
        deleteProxyAdmin: ApiServer.serverUrl + ApiServer.version + '/companies/proxy/admin',
        pushWebToken: ApiServer.serverUrl + ApiServer.version + '/companies/admin/setting/push/{0}'
    },
    carCategory: {
        getAll: ApiServer.serverUrl + ApiServer.version + '/cars/categories'
    },
    carBrand: {
        getAll: ApiServer.serverUrl + ApiServer.version + '/cars/brands'
    },
    carModel: {
        getAll: ApiServer.serverUrl + ApiServer.version + '/cars/brands/{0}/models',
        getAllCarsModels: ApiServer.serverUrl + ApiServer.version + '/cars/brands/models'
    },
    car: {
        getCurrentUserAll: ApiServer.serverUrl + ApiServer.version + '/companies/cars',
        getCurrentUserAllAndDriver: ApiServer.serverUrl + ApiServer.version + '/companies/offers/cars',
        getAll: ApiServer.serverUrl + ApiServer.version + '/cars',
        addToCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/cars',
        deleteFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/cars/{0}',
        getDetailFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/cars/{0}',
        updateToCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/cars/{0}/info',
        changeCarImage: ApiServer.serverUrl + ApiServer.version + '/companies/cars/{0}/image'
    },
    coupon: {
        getCouponsAll: ApiServer.serverUrl + ApiServer.version + '/coupon',
        getDetail: ApiServer.serverUrl + ApiServer.version + '/coupon/{0}',
        delete: ApiServer.serverUrl + ApiServer.version + '/coupon/{0}',
        create: ApiServer.serverUrl + ApiServer.version + '/coupon',
        update: ApiServer.serverUrl + ApiServer.version + '/coupon/{0}'
    },
    driver: {
        getCurrentUserAll: ApiServer.serverUrl + ApiServer.version + '/companies/drivers',
        addAdminToDriverUser: ApiServer.serverUrl + ApiServer.version + '/companies/add/admin/as/driver',
        addToCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/drivers',
        deleteFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/drivers/{0}',
        getDetailFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/drivers/{0}',
        updateToCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/drivers/{0}',
        changeDriverImage: ApiServer.serverUrl + ApiServer.version + '/companies/drivers/{0}/avatar'
    },
    option: {
        currentOptionAll: ApiServer.serverUrl + ApiServer.version + '/companies/options',
        deleteFromCurrentUserOption: ApiServer.serverUrl + ApiServer.version + '/companies/options/{0}',
        updateFromCurrentOption: ApiServer.serverUrl + ApiServer.version + '/companies/options/{0}'
    },
    offer: {
        getCurrentOfferAll: ApiServer.serverUrl + ApiServer.version + '/companies/offers',
        getAll: ApiServer.serverUrl + ApiServer.version + '/offers',
        addToCurrentOffer: ApiServer.serverUrl + ApiServer.version + '/companies/offers',
        updateToCurrentOffer: ApiServer.serverUrl + ApiServer.version + '/companies/offers/{0}',
        deleteFromCurrentOffer: ApiServer.serverUrl + ApiServer.version + '/companies/offers/{0}',
        getDetailFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/offers/{0}',
        getOffers: ApiServer.serverUrl + ApiServer.version + '/companies/' + '{0}' + '/offers/availability',
        getModifyOffers: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}/offers/availability',
        getCustomQuote: ApiServer.serverUrl + ApiServer.version + "/companies/customer/quote/availability",
        addCustomQuote: ApiServer.serverUrl + ApiServer.version + "/companies/add/customer/quote"
    },
    order: {
        statistics: ApiServer.serverUrl + ApiServer.version + '/companies/orders/statistics',
        getActiveOrder: ApiServer.serverUrl + ApiServer.version + '/companies/orders/state',
        getBookInfo: ApiServer.serverUrl + ApiServer.version + '/companies/booking/{0}/offer/info'
    },
    transaction: {
        getTransaction: ApiServer.serverUrl + ApiServer.version + '/companies/transactions',
        getTransactionBill: ApiServer.serverUrl + ApiServer.version + '/companies/transactions/bills',
        sendInvoiceEmail: ApiServer.serverUrl + ApiServer.version + '/companies/send/bookings/{0}/invoice',
        // getInvoiceDetail: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}/invoice/info',
        getInvoiceDetail: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/transactions/{0}',
        editArchive: ApiServer.serverUrl + ApiServer.version + '/companies/orders/{0}/archive'
    },
    company: {
        getAllCompanies: ApiServer.serverUrl + ApiServer.version + '/companies',
        getACompanyDetail: ApiServer.serverUrl + ApiServer.version + '/companies/{0}',
        createAllNewCompany: ApiServer.serverUrl + ApiServer.version + '/companies', //POST
        getCurrentCompanies: ApiServer.serverUrl + ApiServer.version + '/companies/own',
        changeLogo: ApiServer.serverUrl + ApiServer.version + '/companies/logo',
        getCompanyDetail: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/details',
        companyDetailRate: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/rate',
        addCompanyPush: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/push/config',
        getCompanyPush: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/push/config',
        modifyCompanyPush: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/push/config',
        getCompanyApp: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/app/url',
        modifyCompanyApp: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/app',
        getCompanySetting: ApiServer.serverUrl + ApiServer.version + '/companies/settings',
        editCompanySetting: ApiServer.serverUrl + ApiServer.version + '/companies/settings',
        getCompanyDisclaimer: ApiServer.serverUrl + ApiServer.version + '/companies/disclaimer',
        editCompanyDisclaimer: ApiServer.serverUrl + ApiServer.version + '/companies/disclaimer', //PATCH
        changeCompanyAnLocked: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/an/locked', //PATCH

        checkOutGroupKey: ApiServer.serverUrl + ApiServer.version + '/companies/out/group/check',
        getGroupSetting: ApiServer.serverUrl + ApiServer.version + "/companies/group/setting",
        bindStripe: ApiServer.serverUrl + ApiServer.version + "/companies/bind/stripe",


        getSalesRep: ApiServer.serverUrl + ApiServer.version + '/sales',
        createSalesRep: ApiServer.serverUrl + ApiServer.version + '/sales',
        getEditSalesRepInfo: ApiServer.serverUrl + ApiServer.version + '/sales/{0}',
        updateSalesRepInfo: ApiServer.serverUrl + ApiServer.version + '/sales/{0}',
        deleteSalesRepInfo: ApiServer.serverUrl + ApiServer.version + '/sales/{0}',


        getSalesAssistant: ApiServer.serverUrl + ApiServer.version + '/assts',
        createSalesAssistant: ApiServer.serverUrl + ApiServer.version + '/assts',
        getEditSalesAssistantInfo: ApiServer.serverUrl + ApiServer.version + '/assts/{0}',
        updateSalesAssistantInfo: ApiServer.serverUrl + ApiServer.version + '/assts/{0}',
        deleteSalesAssistantInfo: ApiServer.serverUrl + ApiServer.version + '/assts/{0}',

        setCcy : ApiServer.serverUrl+ApiServer.version +"/companies/set/"
    },
    book: {
        book: ApiServer.serverUrl + ApiServer.version + '/bookings',
        ratesFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/companies/bookings',
        ratesCountsFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/counts',
        detail: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}',
        cancel: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}/end',
        changeBook: ApiServer.serverUrl + ApiServer.version + '/bookings/{0}',
        sendEmail: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}/email/itinerary',
        getEditBookingCars: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}/offers/availability',
        editBookingCars: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}',
        editTripState: ApiServer.serverUrl + ApiServer.version + '/companies/orders/state',
        sendBackBooking: ApiServer.serverUrl + ApiServer.version + '/companies/bookings/{0}/send/back'
    },
    customer: {
        searchCurrentCustomers: ApiServer.serverUrl + ApiServer.version + '/companies/customers',
        customerRegister: ApiServer.serverUrl + ApiServer.version + '/companies' + '/{0}' + '/customers/register',
        getFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/customers',
        updateToCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/customers/{0}',
        getDetailFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/customers/{0}',
        getFlightsList: ApiServer.serverUrl + ApiServer.version + '/airline/flights/list',
        checkPaymentExistCustomer: ApiServer.serverUrl + ApiServer.version + '/companies/payment/exist/customers/',
        verifyCode: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/coupon/{1}',

        getOutGroupListMember: ApiServer.serverUrl + ApiServer.version + "/companies/out/group/member",
        changeOutGroupList: ApiServer.serverUrl + ApiServer.version + '/companies/out/group/member'
    },
    card: {
        getFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/company/credit_cards',
        addToCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/company/credit_cards',
        updateCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/company/credit_cards',
        getFromCurrentUser: ApiServer.serverUrl + ApiServer.version + '/companies/customers/{0}/credit_cards'
    },
    payment: {
        getFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/companies/payment/methods',
        deleteFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/companies/payment/methods/{0}',
        activeFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/companies/payment/methods/{0}/active',
        getCardByClient: ApiServer.serverUrl + ApiServer.version + '/companies/customers/{0}/credit_cards',
        addCardByClient: ApiServer.serverUrl + ApiServer.version + '/companies/customers/{0}/credit_cards',
        deleteCardByClient: ApiServer.serverUrl + ApiServer.version + '/companies/customers/{0}/credit_cards/{1}'
    },
    event: {
        addToCalendar: ApiServer.serverUrl + ApiServer.version + '/calendars/events',
        deleteCalendarEvent: ApiServer.serverUrl + ApiServer.version + '/calendars/events/{0}',
        eventsFromCurrentCompany: ApiServer.serverUrl + ApiServer.version + '/companies/calendars/events/upcoming'
    },
    flow: {
        login: ApiServer.serverUrl + ApiServer.version + '/{0}/login',
        register: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/customers/register',
        getOffers: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/offers/availability',
        booking: ApiServer.serverUrl + ApiServer.version + '/customers/bookings',
        addCreditCard: ApiServer.serverUrl + ApiServer.version + '/customer/credit_cards',
        getCreditCards: ApiServer.serverUrl + ApiServer.version + '/customer/credit_cards',
        getCompanyInfor: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/info',
        getCompanyDisclaimer: ApiServer.serverUrl + ApiServer.version + '/companies/{0}/disclaimer'
    },
    onboard: {
        verifyCode: ApiServer.serverUrl + ApiServer.version + '/service/coupon/{0}',
        servicePrice: ApiServer.serverUrl + ApiServer.version + '/service/price',
        payOrder: ApiServer.serverUrl + ApiServer.version + '/service/pay/order',
        addDrivers: ApiServer.serverUrl + ApiServer.version + '/companies/drivers',
        addAdminAsDriver: ApiServer.serverUrl + ApiServer.version + '/companies/add/admin/as/driver',
    },
    easysignup: {
        easysignup: ApiServer.serverUrl + ApiServer.version + '/companies/easysignup',
    },
    super: {
        carModelsOnPlatform: ApiServer.serverUrl + ApiServer.version + '/car/models',
        carModelsImageOnPlatform: ApiServer.serverUrl + ApiServer.version + '/cars/models/{0}/image',
        carModelsImageIdOnPlatform: ApiServer.serverUrl + ApiServer.version + '/cars/models/images/{0}',
        carCategoriesOnPlatform: ApiServer.serverUrl + ApiServer.version + '/car/categories',
        carBrandsOnPlatform: ApiServer.serverUrl + ApiServer.version + '/car/brands',
        carModelIdOnPlatform: ApiServer.serverUrl + ApiServer.version + '/car/models/{0}',
        modifyCategories: ApiServer.serverUrl + ApiServer.version + '/car/categories/{0}',
        getCompaniesList: ApiServer.serverUrl + ApiServer.version + '/companies/info',
        companyStatistics: ApiServer.serverUrl + ApiServer.version + '/bookings/statistics',
        rateRules: ApiServer.serverUrl + ApiServer.version + '/rate/rules'
    },
    an: {
        getSetting: ApiServer.serverUrl + ApiServer.version + '/companies/an/setting',
        enableLnSetting: ApiServer.serverUrl + ApiServer.version + '/companies/ln/{0}',
        enableGnSetting: ApiServer.serverUrl + ApiServer.version + '/companies/gn/{0}',
        enableCombineSetting: ApiServer.serverUrl + ApiServer.version + '/companies/combine/{0}',
        addLnWantedCarModel: ApiServer.serverUrl + ApiServer.version + '/companies/car/for/ask/{0}',
        deleteLnWantedCarModel: ApiServer.serverUrl + ApiServer.version + '/companies/car/for/ask/{0}',
        addLnGivenCar: ApiServer.serverUrl + ApiServer.version + '/companies/car/for/provide/{0}',
        deleteLnGivenCar: ApiServer.serverUrl + ApiServer.version + '/companies/car/for/provide/{0}',
        updateLnRadius: ApiServer.serverUrl + ApiServer.version + '/companies/an/radius'
    },
    salesRep: {
        updateSalesRep: ApiServer.serverUrl + ApiServer.version + '/sale/info',
        getCompaniesTotalsData: ApiServer.serverUrl + ApiServer.version + '/sale/companies',
        getCompaniesState: ApiServer.serverUrl + ApiServer.version + '/sale/companies/stats'
    },
    salesAssistant: {
        updateSalesAssistant: ApiServer.serverUrl + ApiServer.version + '/asst/info',
        getCompaniesTotalsData: ApiServer.serverUrl + ApiServer.version + '/asst/companies'
    }
};

ErrorCodeDictionary =
    {
        6000: "Wrong Email/Password",
        3000: "Missing required parameter",
        // 3001:"Error required parameter",
        3002: "Can not find object",
        3806: "Event time has been used",

        3003: "Mobile has be used",
        3004: "Email has be used",
        3006: "You do not have access",
        3001: "Please fill in the value in correct format",
        3007: "Authentication expired, please sign in again",
        3102: "Email has be used",
        3101: "Mobile has be used",
        3100: "Username has be used",
        3700: "This mobile has been used by the other user",
        3701: "This email has been used by the other user",
        3702: "Wrong Password",
        3703: "Password not changed",
        3800: "This offer can't provide services",
        3803: "This appoint time in the offer can't provide services",
        7200: "Can't change or end this trip because it has been started",

        "GET": "Get error, please retry later",
        "POST": "Post error, please retry later",
        "PUT": "Put error, please retry later",
        "PATCH": "Patch error, please retry later",
        "DELETE": "Delete error, please retry later",
        "UPLOAD": "Upload error, please retry later"
    };

ErrorCode =
    {
        getErrorMessage: function (code) {
            return ErrorCodeDictionary[code];
        }
    };
