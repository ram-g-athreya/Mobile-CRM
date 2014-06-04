function recommendController(options) {
    $(document).ready(function() {
        var params = {
            page: 1
        };
        var waiting = false;

        function applyFilter() {
            $.ajax({
                url: '/admin/recommend',
                method: 'POST',
                data: params,
                success: function(response) {
                    console.log(response);
                    waiting = false;
                    $('.content').append(response);
                }
            });
        }

        //Paginate on scroll end
        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() + 200 >= $(document).height() && !waiting) {
                waiting = true;
                params.page++;
                applyFilter();
            }
        });

    });
}
