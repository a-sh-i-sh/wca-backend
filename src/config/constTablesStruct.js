module.exports = {
    marketcheck_vehicle_info: {
       tablename: "wca_marketcheck_vehicle_info",
       id: "id",
       vin: "vin",
       vehicle_id: "vehicle_id",
       heading: "heading",
       miles: "miles",
       target_retail: "target_retail",
       ext_color: "ext_color",
       int_color: "int_color",
       base_ext_color: "base_ext_color",
       base_int_color: "base_int_color",
       dom: "dom",
       seller_type: "seller_type",
    },

    marketcheck_vehicle_dealer_info: {
        tablename: "wca_marketcheck_vehicle_dealer_info",
        id: "id",
        vin: "vin",
        dealer_id: "dealer_id",
        name: "name",
        city: "city",
        state: "state",
        country: "country",
        zip: "zip",
        phone: "phone",
        seller_email: "seller_email",
    },

    marketcheck_vehicle_build_info: {
        tablename: "wca_marketcheck_vehicle_build_info",
        id: "id",
        vin: "vin",
        year: "year",
        make: "make",
        model: "model",
        fuel_type: "fuel_type",
        doors: "doors",
        cylinders: "cylinders",
        engine: "engine",
        transmission: "transmission",
        trim: "trim",
        body_type: "body_type",
        drivetrain: "drivetrain",
        std_seating: "std_seating",
        highway_mpg: "highway_mpg",
        city_mpg: "city_mpg",
    },

    marketcheck_vehicle_media_info: {
        tablename: "wca_marketcheck_vehicle_media_info",
        id: "id",
        vin: "vin",
        photo_link: "photo_link",
        type: "type"
    }
}