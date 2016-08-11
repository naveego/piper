var Runner = function(options) {
    _.bindAll(this, '_submit');

    this.options = _.extend({
        formEl: $('#runForm'),
        resultsEl: $('#results')
    }, options || {});

    this.form = $(this.options.formEl);
    this.form.submit(this._submit);
    this.results = $(this.options.resultsEl);
}

_.extend(Runner.prototype, {

    _submit: function(e) {
        e.preventDefault();

        var self = this,
            name = this.form.find('[name=name]').val(),
            importPath = this.form.find('[name=importPath]').val(),
            executeReq = {
                "name": name,
                "importPath": importPath
            };

        $.ajax({
            type: 'POST',
            url: '/api/execute',
            dataType: 'json',
            data: JSON.stringify(executeReq)
        })
        .done(function(resp) {
            output = resp.output.replace(/(?:\r\n|\r|\n)/g, '<br />');
            self.results.html(output);
        })
        .fail(function(err) {
            alert("Error: " + err)
        })
        
    }

});