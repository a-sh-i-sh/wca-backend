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
        city: "city",
        state: "state",
        country: "country"
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
        engine: "engine"
    },

    marketcheck_vehicle_media_info: {
        tablename: "wca_marketcheck_vehicle_media_info",
        id: "id",
        vin: "vin",
        photo_link: "photo_link",
        type: "type"
    }
}