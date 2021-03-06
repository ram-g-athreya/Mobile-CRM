function filterController(options){

  $(document).ready(function(){
    var id_brand_type = options.id_brand_type;
    var params = {
      page: 1,
      id_brand_type: id_brand_type
    };

    function applyFilter(reset){
      $.ajax({
        url: '/product/filter-products',
        method: 'POST',
        data: params,
        success: function(response){
          if(reset){
            $('.content').html(response);
          }
          else{
            $('.content').append(response);
          }
        }
      });
    }

    //On filter button Click
    $("button[name='filter']").click(function(){
      params = {
        price: $("[name=price]:checked").map(function(){return $(this).val();}).get(),
        id_brand: $("[name=id_brand]:checked").map(function(){return $(this).val();}).get(),
        offer: $("[name=offer]:checked").val(),
        warranty: $("[name=warranty]:checked").val(),
        page: 1,
        id_brand_type: id_brand_type
      };
      applyFilter(true);
    });

    //Paginate on scroll end
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() + 200 >= $(document).height()) {
        params.page++;
        applyFilter();
      }
   });

  });
}
