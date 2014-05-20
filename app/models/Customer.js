module.exports = function(options){
  var Customer = options.db.define(options.table, {
    id_customer: Number,
    customer_name: String,
    address: String,
    email: String,
    phone: String
  },{
    id: 'id_customer',
    methods: {

    },
    validations: {
      customer_name: options.orm.enforce.ranges.length(5, 45, "Invalid Name"),
      address: options.orm.enforce.ranges.length(5, undefined, "Invalid Address"),
      phone : options.orm.enforce.ranges.length(10, 10, "Invalid Phone Number"),
      email: options.orm.enforce.patterns.email("Invalid E-Mail")
    }
  });
};
