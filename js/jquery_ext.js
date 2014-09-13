(function( $ ) {
    $.fn.extTab = function ()
    {
        var tabs = this.find('a[data-toggle="tab"]');
        tabs.on('show.bs.tab', function (event){
            var target = $(event.target);
            var panel = $(target.attr('href'));
            if (!panel.attr('data-url')){return;}
            panel.html('<div class="progress progress-striped active" style="margin: 50px auto;width: 50%">\
                            <div class="progress-bar" style="width: 100%"></div>\
                        </div>');
            $.ajax({
                url: panel.attr('data-url'),
                data: panel.attr('data-post'),
                type: 'post',
                success: function (data){
                    panel.html(data);
                },
                error: function (){
                    //TODO add error message
                    //panel.html('');
                }
            })
        });
        tabs.first().trigger('click');
    };
})(jQuery);