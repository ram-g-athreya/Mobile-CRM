function productDetails(options){
  $(document).ready(function(){
    if(!options.is_sold && window.localStorage.customer_info){
      var info = JSON.parse(window.localStorage.customer_info);
      $("[name='customer_name']").val(info.customer_name);
      $("[name='email']").val(info.email);
      $("[name='phone']").val(info.phone);
      $("[name='address']").val(info.address);
    }

    $('#buy').click(function(){
      var customer_info = {
        customer_name: $("[name='customer_name']").val(),
        email: $("[name='email']").val(),
        phone: $("[name='phone']").val(),
        address: $("[name='address']").val()
      };
      $.ajax({
        url: '/sell-product',
        method: 'POST',
        data: {
          customer_info: customer_info,
          id_product : options.id_product
        },
        success: function(response){
          window.localStorage.customer_info = JSON.stringify(customer_info);
          window.location.reload();
        }
      });
    });
  });
}
