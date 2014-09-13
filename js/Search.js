var Search = Backbone.Model.extend({
    form: '',
    container: '',
    template: '',
    go: function (type, page, limit){ //TODO make page and limit work
        var container = this.get('container');
        var template = this.get('template');
        $.ajax({
            url: '/search/' + type,
            data: this.get('form').serialize(),
            dataType: 'json',
            type: 'post',
            success: function (data){
                container.html('');
                data.forEach(function (item)
                {
                    container.append(template.format(item));
                })
            }
        })
    }
});