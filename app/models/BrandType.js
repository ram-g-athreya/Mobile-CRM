;
module.exports = function(options) {
    var BrandType = options.db.define(options.table, {
        id_brand_type: Number,
        brand_type: String
    }, {
        id: 'id_brand_type',
        methods: {
        }
    });
};
